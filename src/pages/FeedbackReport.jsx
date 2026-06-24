import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchReport } from '../store/reportSlice';

const CATEGORIES = [
  { key: 'confidenceScore',     label: 'Confidence',     icon: '💪' },
  { key: 'depthScore',          label: 'Depth',          icon: '🧠' },
  { key: 'communicationScore',  label: 'Communication',  icon: '💬' },
  { key: 'gapsScore',           label: 'Knowledge gaps',  icon: '🎯' },
];

function StarRow({ score }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={{
          fontSize: 18,
          color: n <= score ? '#f59e0b' : '#e5e7eb',
        }}>
          ★
        </span>
      ))}
    </div>
  );
}

function FeedbackReport() {
  const { sessionId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, loading, error } = useSelector((s) => s.report);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    dispatch(fetchReport(sessionId));
  }, [sessionId, dispatch]);

  // Report generation can lag a couple seconds behind session completion —
  // retry once automatically if not found yet
  useEffect(() => {
    if (error && !retrying) {
      setRetrying(true);
      const timer = setTimeout(() => {
        dispatch(fetchReport(sessionId));
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [error, retrying, sessionId, dispatch]);

  if (loading || (error && retrying)) {
    return (
      <div style={{ maxWidth: 560, margin: '80px auto', padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
        <h3>Generating your feedback report...</h3>
        <p style={{ color: '#9ca3af' }}>This usually takes a few seconds</p>
      </div>
    );
  }

  if (error || !current) {
    return (
      <div style={{ maxWidth: 560, margin: '80px auto', padding: 24, textAlign: 'center' }}>
        <p style={{ color: '#dc2626' }}>{error || 'Report not found'}</p>
        <button onClick={() => navigate('/home')} style={{ marginTop: 16, padding: '10px 24px' }}>
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: '40px auto', padding: 24 }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
        borderRadius: 16, padding: '32px 28px', marginBottom: 24,
        color: '#fff',
      }}>
        <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>
          {current.jobRoleDisplay} interview report
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 8 }}>
          <span style={{ fontSize: 44, fontWeight: 700 }}>
            {current.overallScore.toFixed(1)}
          </span>
          <span style={{ fontSize: 16, opacity: 0.8 }}>/ 5 overall</span>
        </div>
      </div>

      {/* Score breakdown */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16, marginBottom: 24,
      }}>
        {CATEGORIES.map((cat) => (
          <div key={cat.key} style={{
            background: '#fff', border: '1px solid #e5e7eb',
            borderRadius: 12, padding: '18px 20px',
          }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{cat.icon}</div>
            <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>{cat.label}</div>
            <StarRow score={current[cat.key]} />
          </div>
        ))}
      </div>

      {/* Overall feedback */}
      <div style={{
        background: '#eef2ff', borderRadius: 12,
        padding: '20px 24px', marginBottom: 24,
      }}>
        <strong style={{ color: '#3730a3', fontSize: 14 }}>Overall feedback</strong>
        <p style={{ marginTop: 8, color: '#374151', lineHeight: 1.7, fontSize: 15 }}>
          {current.overallFeedback}
        </p>
      </div>

      {/* Weak areas + suggested topics */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 16, marginBottom: 24,
      }}>
        {current.weakAreas?.length > 0 && (
          <div style={{ background: '#fef2f2', borderRadius: 12, padding: '18px 20px' }}>
            <strong style={{ color: '#991b1b', fontSize: 14 }}>Areas to improve</strong>
            <ul style={{ marginTop: 10, paddingLeft: 20 }}>
              {current.weakAreas.map((area, i) => (
                <li key={i} style={{ color: '#7f1d1d', fontSize: 14, marginBottom: 6 }}>{area}</li>
              ))}
            </ul>
          </div>
        )}

        {current.suggestedTopics?.length > 0 && (
          <div style={{ background: '#ecfdf5', borderRadius: 12, padding: '18px 20px' }}>
            <strong style={{ color: '#065f46', fontSize: 14 }}>Suggested practice</strong>
            <ul style={{ marginTop: 10, paddingLeft: 20 }}>
              {current.suggestedTopics.map((topic, i) => (
                <li key={i} style={{ color: '#064e3b', fontSize: 14, marginBottom: 6 }}>{topic}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            flex: 1, padding: '12px 0', background: '#4f46e5',
            color: '#fff', border: 'none', borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}
        >
          View progress dashboard
        </button>
        <button
          onClick={() => navigate('/interview/setup')}
          style={{
            flex: 1, padding: '12px 0', background: '#fff',
            border: '1px solid #e5e7eb', borderRadius: 8,
            fontSize: 14, cursor: 'pointer',
          }}
        >
          New interview
        </button>
      </div>
    </div>
  );
}

export default FeedbackReport;