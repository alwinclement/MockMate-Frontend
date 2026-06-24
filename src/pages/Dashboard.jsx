import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { fetchScoreHistory } from '../store/reportSlice';

const LINE_CONFIG = [
  { key: 'confidenceScore',    label: 'Confidence',    color: '#7c3aed' },
  { key: 'depthScore',         label: 'Depth',         color: '#0891b2' },
  { key: 'communicationScore', label: 'Communication', color: '#059669' },
  { key: 'gapsScore',          label: 'Knowledge gaps', color: '#dc2626' },
];

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { history } = useSelector((s) => s.report);

  useEffect(() => {
    dispatch(fetchScoreHistory());
  }, [dispatch]);

  const chartData = history.map((entry, i) => ({
    name: `#${i + 1}`,
    date: new Date(entry.date).toLocaleDateString(),
    role: entry.jobRoleDisplay,
    confidenceScore: entry.confidenceScore,
    depthScore: entry.depthScore,
    communicationScore: entry.communicationScore,
    gapsScore: entry.gapsScore,
    overallScore: entry.overallScore,
    sessionId: entry.sessionId,
  }));

  // Aggregate average per category to surface the single weakest area overall
  const averages = LINE_CONFIG.map((cfg) => {
    const sum = history.reduce((acc, h) => acc + (h[cfg.key] || 0), 0);
    return { ...cfg, avg: history.length ? sum / history.length : 0 };
  });
  const weakest = averages.length
    ? averages.reduce((a, b) => (a.avg < b.avg ? a : b))
    : null;

  if (history.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>📊</div>
        <h3>No completed interviews yet</h3>
        <p style={{ color: '#9ca3af', marginBottom: 20 }}>
          Complete a mock interview to start tracking your progress here.
        </p>
        <button
          onClick={() => navigate('/interview/setup')}
          style={{
            padding: '12px 28px', background: '#4f46e5', color: '#fff',
            border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer',
          }}
        >
          Start your first interview
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 880, margin: '40px auto', padding: 24 }}>
      <h2 style={{ marginBottom: 4 }}>Progress dashboard</h2>
      <p style={{ color: '#6b7280', marginBottom: 32, fontSize: 14 }}>
        {history.length} session{history.length > 1 ? 's' : ''} completed
      </p>

      {/* Trend chart */}
      <div style={{
        background: '#fff', border: '1px solid #e5e7eb',
        borderRadius: 16, padding: '24px', marginBottom: 24,
      }}>
        <h3 style={{ fontSize: 15, marginBottom: 16, color: '#374151' }}>
          Score trend across sessions
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ fontSize: 13, borderRadius: 8 }}
              formatter={(value, name) => [value, name]}
              labelFormatter={(label, payload) =>
                payload?.[0]?.payload ? `${payload[0].payload.role} — ${payload[0].payload.date}` : label
              }
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {LINE_CONFIG.map((cfg) => (
              <Line
                key={cfg.key}
                type="monotone"
                dataKey={cfg.key}
                name={cfg.label}
                stroke={cfg.color}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Weakest area callout */}
      {weakest && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: 12, padding: '18px 22px', marginBottom: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <strong style={{ color: '#991b1b', fontSize: 14 }}>Focus area</strong>
            <p style={{ margin: '4px 0 0', color: '#7f1d1d', fontSize: 14 }}>
              Your average <strong style={{ fontWeight: 500 }}>{weakest.label}</strong> score is the lowest at {weakest.avg.toFixed(1)} / 5
            </p>
          </div>
          <div style={{ fontSize: 28, color: '#dc2626', fontWeight: 700 }}>
            {weakest.avg.toFixed(1)}
          </div>
        </div>
      )}

      {/* Session list */}
      <div style={{
        background: '#fff', border: '1px solid #e5e7eb',
        borderRadius: 16, padding: '8px',
      }}>
        {history.slice().reverse().map((entry) => (
          <div
            key={entry.sessionId}
            onClick={() => navigate(`/interview/results/report/${entry.sessionId}`)}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 16px', borderRadius: 10, cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div>
              <div style={{ fontWeight: 500, fontSize: 14, color: '#111827' }}>
                {entry.jobRoleDisplay}
              </div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>
                {new Date(entry.date).toLocaleDateString()}
              </div>
            </div>
            <div style={{
              fontSize: 16, fontWeight: 700,
              color: entry.overallScore >= 4 ? '#059669' : entry.overallScore >= 3 ? '#b45309' : '#dc2626',
            }}>
              {entry.overallScore.toFixed(1)} / 5
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;