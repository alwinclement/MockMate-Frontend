import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const TYPE_CONFIG = {
  HR:         { label: 'HR & Behavioural', color: '#0891b2', bg: '#ecfeff' },
  TECHNICAL:  { label: 'Technical',        color: '#7c3aed', bg: '#f5f3ff' },
  CODING:     { label: 'Coding',           color: '#059669', bg: '#ecfdf5' },
};

const DIFFICULTY_CONFIG = {
  EASY:   { color: '#15803d', bg: '#dcfce7' },
  MEDIUM: { color: '#b45309', bg: '#fef3c7' },
  HARD:   { color: '#b91c1c', bg: '#fee2e2' },
};

function QuestionCard({ question, index }) {
  const typeConf = TYPE_CONFIG[question.type] || TYPE_CONFIG.TECHNICAL;
  const diffConf = DIFFICULTY_CONFIG[question.difficulty] || DIFFICULTY_CONFIG.MEDIUM;

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderLeft: `4px solid ${typeConf.color}`,
      borderRadius: 10,
      padding: '16px 20px',
      marginBottom: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ color: '#9ca3af', fontSize: 13, fontWeight: 600 }}>Q{index + 1}</span>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: '2px 8px',
          borderRadius: 20, background: typeConf.bg, color: typeConf.color,
        }}>
          {typeConf.label}
        </span>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: '2px 8px',
          borderRadius: 20, background: diffConf.bg, color: diffConf.color,
        }}>
          {question.difficulty}
        </span>
      </div>

      <p style={{ margin: 0, fontSize: 15, color: '#111827', lineHeight: 1.6 }}>
        {question.content}
      </p>

      {question.hint && (
        <details style={{ marginTop: 12 }}>
          <summary style={{ fontSize: 13, color: '#6b7280', cursor: 'pointer' }}>
            Show hint
          </summary>
          <p style={{ marginTop: 8, fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
            {question.hint}
          </p>
        </details>
      )}
    </div>
  );
}

function SectionBlock({ title, questions, color }) {
  if (!questions || questions.length === 0) return null;
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ color, marginBottom: 16, fontSize: 16 }}>
        {title} ({questions.length})
      </h3>
      {questions.map((q, i) => (
        <QuestionCard key={q.id} question={q} index={i} />
      ))}
    </div>
  );
}

function InterviewQuestions() {
  const navigate = useNavigate();
  const { currentSession } = useSelector((s) => s.interview);

  if (!currentSession) {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center' }}>
        <p>No active session. Start a new interview first.</p>
        <button onClick={() => navigate(`/interview/live/${currentSession.id}`)}
          style={{
            width: '100%', padding: '14px 0',
            background: '#4f46e5', color: '#fff',
            border: 'none', borderRadius: 10,
            fontSize: 16, fontWeight: 600, cursor: 'pointer',
          }}>   
          Start live interview →
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: '40px auto', padding: 24 }}>

      {/* Header */}
      <div style={{
        background: '#f9fafb', borderRadius: 12,
        padding: '20px 24px', marginBottom: 32,
        border: '1px solid #e5e7eb',
      }}>
        <h2 style={{ margin: 0, marginBottom: 4 }}>
          {currentSession.jobRoleDisplay} — Mock Interview
        </h2>
        <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
          {currentSession.questions.length} questions generated · Session #{currentSession.id}
        </p>
      </div>

      {/* Questions grouped by category */}
      <SectionBlock
        title="HR & Behavioural"
        questions={currentSession.hrQuestions}
        color="#0891b2"
      />
      <SectionBlock
        title="Technical"
        questions={currentSession.technicalQuestions}
        color="#7c3aed"
      />
      <SectionBlock
        title="Coding"
        questions={currentSession.codingQuestions}
        color="#059669"
      />

      {/* Actions */}
      {/* Start live interview button — the main action */}
      <button
          onClick={() => navigate(`/interview/live/${currentSession.id}`)}
          style={{
              width: '100%', padding: '14px 0',
              background: '#4f46e5', color: '#fff',
              border: 'none', borderRadius: 10,
              fontSize: 16, fontWeight: 600, cursor: 'pointer',
              marginBottom: 12,
          }}
      >
        Start live interview →
      </button>

      {/* Secondary actions */}
      <div style={{ display: 'flex', gap: 12 }}>
          <button
              onClick={() => navigate('/interview/setup')}
              style={{
                  flex: 1, padding: '12px 0',
                  background: '#fff', border: '1px solid #e5e7eb',
                  borderRadius: 8, fontSize: 14, cursor: 'pointer',
              }}
          >
              Generate new set
          </button>
          <button
              onClick={() => navigate('/home')}
              style={{
                  flex: 1, padding: '12px 0',
                  background: '#fff', border: '1px solid #e5e7eb',
                  borderRadius: 8, fontSize: 14, cursor: 'pointer',
              }}
          >
              Back to home
          </button>
      </div>
    </div>
  );
}

export default InterviewQuestions;