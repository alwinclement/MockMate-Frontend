import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function InterviewResults() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get(`/api/interview/live/${sessionId}/answers`)
      .then(res => { setAnswers(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [sessionId]);

  if (loading) return (
    <div style={{ textAlign: 'center', marginTop: 80 }}>Loading results...</div>
  );

  const answered = answers.filter(a => !a.timedOut && a.answerText);
  const timedOut = answers.filter(a => a.timedOut);
  const voiceCount = answers.filter(a => a.answeredByVoice).length;

  return (
    <div style={{ maxWidth: 760, margin: '40px auto', padding: 24 }}>
      <h2>Interview Results</h2>

      {/* Summary stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12, marginBottom: 32,
      }}>
        {[
          { label: 'Answered', value: answered.length, color: '#059669' },
          { label: 'Timed out', value: timedOut.length, color: '#dc2626' },
          { label: 'Voice answers', value: voiceCount, color: '#7c3aed' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: '#f9fafb', borderRadius: 10,
            padding: '16px', textAlign: 'center',
            border: '1px solid #e5e7eb',
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Answer list */}
      {answers.map((answer, i) => (
        <div key={answer.id} style={{
          background: '#fff', border: '1px solid #e5e7eb',
          borderRadius: 10, padding: 20, marginBottom: 12,
          borderLeft: `4px solid ${answer.timedOut ? '#fca5a5' : '#86efac'}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontWeight: 600, color: '#374151' }}>
              Q{i + 1}. {answer.questionContent}
            </span>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {answer.answeredByVoice && (
                <span style={{ fontSize: 12, color: '#7c3aed' }}>🎤 Voice</span>
              )}
              <span style={{ fontSize: 12, color: '#6b7280' }}>
                ⏱ {answer.timeTakenSeconds}s
              </span>
              {answer.timedOut && (
                <span style={{
                  fontSize: 11, padding: '2px 8px', borderRadius: 20,
                  background: '#fee2e2', color: '#dc2626', fontWeight: 600,
                }}>
                  Timed out
                </span>
              )}
            </div>
          </div>
          <p style={{
            margin: 0, fontSize: 14, color: answer.timedOut ? '#9ca3af' : '#374151',
            fontStyle: answer.timedOut ? 'italic' : 'normal', lineHeight: 1.6,
          }}>
            {answer.timedOut
              ? 'No answer submitted — time ran out'
              : answer.answerText || 'No answer text'}
          </p>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <button
          onClick={() => navigate('/interview/setup')}
          style={{
            flex: 1, padding: '12px 0', background: '#4f46e5',
            color: '#fff', border: 'none', borderRadius: 8,
            fontSize: 14, cursor: 'pointer',
          }}
        >
          Start new interview
        </button>
        <button
          onClick={() => navigate('/home')}
          style={{
            flex: 1, padding: '12px 0', background: '#fff',
            border: '1px solid #e5e7eb', borderRadius: 8,
            fontSize: 14, cursor: 'pointer',
          }}
        >
          Home
        </button>
      </div>
    </div>
  );
}

export default InterviewResults;