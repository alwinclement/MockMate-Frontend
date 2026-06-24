import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useInterviewSocket } from '../hooks/useInterviewSocket';
import { answerSubmitted, resetLiveSession, setSessionId } from '../store/liveInterviewSlice';
import CountdownTimer from '../components/CountdownTimer';
import ProgressIndicator from '../components/ProgressIndicator';
import VoiceInput from '../components/VoiceInput';


const TYPE_COLOR = {
  HR:        { color: '#0891b2', bg: '#ecfeff', label: 'HR' },
  TECHNICAL: { color: '#7c3aed', bg: '#f5f3ff', label: 'Technical' },
  CODING:    { color: '#059669', bg: '#ecfdf5', label: 'Coding' },
};

const DIFF_COLOR = {
  EASY:   { color: '#15803d', bg: '#dcfce7' },
  MEDIUM: { color: '#b45309', bg: '#fef3c7' },
  HARD:   { color: '#b91c1c', bg: '#fee2e2' },
};

function LiveInterview() {
  const { sessionId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    currentQuestion, currentIndex, totalQuestions,
    timeRemaining, status, answers, totalAnswered, timedOutCount,
  } = useSelector((s) => s.liveInterview);

  const [answerText, setAnswerText] = useState('');
  const [inputMode, setInputMode] = useState('text');  // 'text' or 'voice'
  const [showHint, setShowHint] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [timerExpired, setTimerExpired] = useState(false);
  const answerTextRef = useRef('');

  const { sendAnswer } = useInterviewSocket(Number(sessionId));

  // Start the live session via HTTP
  useEffect(() => {
    dispatch(setSessionId(Number(sessionId)));

    axiosInstance.post(`/api/interview/live/start/${sessionId}`)
      .catch(err => console.error('Failed to start live session:', err));

    return () => {
      dispatch(resetLiveSession());
    };
  }, [sessionId, dispatch]);

  // Track when current question arrived so we know how long they took
  useEffect(() => {
    if (currentQuestion) {
      setAnswerText('');
      setShowHint(false);
      setStartTime(Date.now());
    }
  }, [currentQuestion?.id]);

  useEffect(() => {
    answerTextRef.current = answerText;
  }, [answerText]);

  const handleVoiceTranscript = useCallback((transcript) => {
    setAnswerText(transcript);
  }, []);

  const handleSubmit = () => {
    if (!currentQuestion || submitting) return;
    setSubmitting(true);

    const timeTaken = startTime
        ? Math.floor((Date.now() - startTime) / 1000)
        : 120 - timeRemaining;

    const finalAnswer = answerTextRef.current.trim();

    const payload = {
        sessionId: Number(sessionId),
        questionId: currentQuestion.id,
        answerText: finalAnswer,
        answeredByVoice: inputMode === 'voice',
        timeTakenSeconds: timeTaken,
        timedOut: false,
    };

    sendAnswer(payload);
    dispatch(answerSubmitted({ index: currentIndex, timedOut: false }));
    setAnswerText('');
    setSubmitting(false);
  };

  const handleTimeUp = useCallback(() => {
    if (!currentQuestion) return;
      // Step 1: immediately freeze input so voice recognition stops cleanly
        setTimerExpired(true);

        // Step 2: wait a tiny moment for VoiceInput's stop() to finalize 
        // the last onresult callback before we read the answer
      setTimeout(() => {
        const finalAnswer = answerTextRef.current.trim();

        const payload = {
          sessionId: Number(sessionId),
          questionId: currentQuestion.id,
          answerText: finalAnswer,
          answeredByVoice: inputMode === 'voice',
          timeTakenSeconds: 120,
          // Only mark as truly timed out if they genuinely left it blank
          timedOut: finalAnswer.length === 0,
      };

      sendAnswer(payload);
      dispatch(answerSubmitted({
          index: currentIndex,
          timedOut: finalAnswer.length === 0
      }));

      setAnswerText('');
      setTimerExpired(false);
    }, 300); // 300ms grace window for last speech fragment to land

  }, [currentQuestion, currentIndex, sessionId, inputMode, sendAnswer, dispatch]);

  // Completed screen
  if (status === 'COMPLETED') {
    return (
      <div style={{ maxWidth: 560, margin: '80px auto', padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <h2>Interview completed!</h2>
        <p style={{ color: '#6b7280', marginBottom: 24 }}>
          You answered {totalAnswered} of {totalQuestions} questions.
          {timedOutCount > 0 && ` ${timedOutCount} timed out.`}
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={() => navigate(`/interview/results/report/${sessionId}`)}
            style={{
                padding: '12px 28px', background: '#4f46e5', color: '#fff',
                border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer',
            }}
          >
              View feedback report
          </button>
          <button
            onClick={() => navigate('/interview/setup')}
            style={{
              padding: '12px 28px', background: '#fff',
              border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 15, cursor: 'pointer',
            }}
          >
            New interview
          </button>
        </div>
      </div>
    );
  }

  // Connecting screen
  if (status === 'CONNECTING' || !currentQuestion) {
    return (
      <div style={{ maxWidth: 560, margin: '80px auto', padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
        <h3>Preparing your interview...</h3>
        <p style={{ color: '#9ca3af' }}>Connecting to live session</p>
      </div>
    );
  }

  const typeConf = TYPE_COLOR[currentQuestion.type] || TYPE_COLOR.TECHNICAL;
  const diffConf = DIFF_COLOR[currentQuestion.difficulty] || DIFF_COLOR.MEDIUM;

  return (
    <div style={{ maxWidth: 760, margin: '32px auto', padding: 24 }}>

      {/* Header row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 20,
      }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Live Mock Interview</h2>
        <CountdownTimer onTimeUp={handleTimeUp} />
      </div>

      {/* Progress */}
      <ProgressIndicator
        current={currentIndex}
        total={totalQuestions}
        answers={answers}
      />

      {/* Question card */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderLeft: `5px solid ${typeConf.color}`,
        borderRadius: 12,
        padding: '24px',
        marginBottom: 20,
      }}>
        {/* Tags */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '3px 10px',
            borderRadius: 20, background: typeConf.bg, color: typeConf.color,
          }}>
            {typeConf.label}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '3px 10px',
            borderRadius: 20, background: diffConf.bg, color: diffConf.color,
          }}>
            {currentQuestion.difficulty}
          </span>
        </div>

        {/* Question text */}
        <p style={{ fontSize: 17, color: '#111827', lineHeight: 1.7, margin: 0 }}>
          {currentQuestion.content}
        </p>

        {/* Hint toggle */}
        {currentQuestion.hint && (
          <div style={{ marginTop: 16 }}>
            <button
              onClick={() => setShowHint(!showHint)}
              style={{
                fontSize: 13, color: '#6b7280', background: 'none',
                border: 'none', cursor: 'pointer', padding: 0,
              }}
            >
              {showHint ? '▲ Hide hint' : '▼ Show hint'}
            </button>
            {showHint && (
              <p style={{
                marginTop: 8, fontSize: 13, color: '#6b7280',
                background: '#f9fafb', padding: 12, borderRadius: 8, lineHeight: 1.6,
              }}>
                {currentQuestion.hint}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Input mode toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button
          onClick={() => setInputMode('text')}
          style={{
            padding: '6px 16px', borderRadius: 6, fontSize: 13,
            border: `1px solid ${inputMode === 'text' ? '#4f46e5' : '#e5e7eb'}`,
            background: inputMode === 'text' ? '#eef2ff' : '#fff',
            color: inputMode === 'text' ? '#4f46e5' : '#6b7280',
            cursor: 'pointer',
          }}
        >
          ⌨️ Type
        </button>
        <button
          onClick={() => setInputMode('voice')}
          style={{
            padding: '6px 16px', borderRadius: 6, fontSize: 13,
            border: `1px solid ${inputMode === 'voice' ? '#4f46e5' : '#e5e7eb'}`,
            background: inputMode === 'voice' ? '#eef2ff' : '#fff',
            color: inputMode === 'voice' ? '#4f46e5' : '#6b7280',
            cursor: 'pointer',
          }}
        >
          🎤 Voice
        </button>
      </div>

      {/* Answer input */}
      <div style={{ marginBottom: 16 }}>
        <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Type your answer here..."
            rows={6}
            disabled={timerExpired || submitting}
            style={{
                width: '100%', padding: 14,
                border: '1px solid #e5e7eb', borderRadius: 10,
                fontSize: 14, lineHeight: 1.6, resize: 'vertical',
                fontFamily: 'inherit', boxSizing: 'border-box',
                background: timerExpired ? '#f3f4f6' : (inputMode === 'voice' ? '#fafafa' : '#fff'),
                opacity: timerExpired ? 0.6 : 1,
            }}
        />
      </div>

      {/* Voice control */}
      {inputMode === 'voice' && (
        <div style={{ marginBottom: 16 }}>
          <VoiceInput
            onTranscript={handleVoiceTranscript}
            disabled={submitting || timerExpired}
        />
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!answerText.trim() || submitting}
        style={{
          width: '100%', padding: '14px 0',
          background: answerText.trim() && !submitting ? '#4f46e5' : '#e5e7eb',
          color: answerText.trim() && !submitting ? '#fff' : '#9ca3af',
          border: 'none', borderRadius: 10,
          fontSize: 16, fontWeight: 600,
          cursor: answerText.trim() && !submitting ? 'pointer' : 'not-allowed',
          transition: 'all 0.15s',
        }}
      >
        {submitting
          ? 'Submitting...'
          : currentIndex === totalQuestions - 1
          ? 'Submit final answer →'
          : 'Submit & next question →'
        }
      </button>

      {/* Skip option */}
      <button
        onClick={handleTimeUp}
        style={{
          width: '100%', marginTop: 8, padding: '10px 0',
          background: 'none', border: 'none',
          color: '#9ca3af', fontSize: 13, cursor: 'pointer',
        }}
      >
        Skip this question
      </button>
    </div>
  );
}

export default LiveInterview;