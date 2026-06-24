import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { startInterview } from '../store/interviewSlice';
import { fetchMyResumes } from '../store/resumeSlice';

const JOB_ROLES = [
  { value: 'BACKEND_ENGINEER',   label: 'Backend Engineer',          icon: '⚙️' },
  { value: 'FRONTEND_ENGINEER',  label: 'Frontend Engineer',         icon: '🎨' },
  { value: 'FULLSTACK_ENGINEER', label: 'Full Stack Engineer',       icon: '🔧' },
  { value: 'DATA_SCIENTIST',     label: 'Data Scientist',            icon: '📊' },
  { value: 'DEVOPS_ENGINEER',    label: 'DevOps Engineer',           icon: '🚀' },
  { value: 'ML_ENGINEER',        label: 'Machine Learning Engineer', icon: '🤖' },
  { value: 'QA_ENGINEER',        label: 'QA Engineer',               icon: '🧪' },
  { value: 'SYSTEM_DESIGN',      label: 'System Design',             icon: '🏗️' },
];

function InterviewSetup() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.interview);
  const { resumes } = useSelector((s) => s.resume);

  useEffect(() => {
    dispatch(fetchMyResumes());
  }, [dispatch]);

  // Auto-select the most recent resume
  useEffect(() => {
    if (resumes.length > 0 && !selectedResume) {
      setSelectedResume(resumes[0].id);
    }
  }, [resumes]);

  const handleStart = async () => {
    if (!selectedRole || !selectedResume) return;
    const result = await dispatch(startInterview({
      resumeId: selectedResume,
      jobRole: selectedRole,
    }));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/interview/questions');
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 24 }}>
      <h2 style={{ marginBottom: 8 }}>Start a mock interview</h2>
      <p style={{ color: '#666', marginBottom: 32 }}>
        Select your target role and we'll generate 10 personalised questions from your resume.
      </p>

      {/* Resume selector */}
      {resumes.length > 1 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 12 }}>Select resume</h3>
          <select
            value={selectedResume || ''}
            onChange={(e) => setSelectedResume(Number(e.target.value))}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }}
          >
            {resumes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.fileName} — {r.candidateName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Role grid */}
      <h3 style={{ marginBottom: 16 }}>Select target role</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 12,
        marginBottom: 32,
      }}>
        {JOB_ROLES.map((role) => (
          <div
            key={role.value}
            onClick={() => setSelectedRole(role.value)}
            style={{
              padding: '16px 12px',
              borderRadius: 10,
              border: `2px solid ${selectedRole === role.value ? '#4f46e5' : '#e5e7eb'}`,
              background: selectedRole === role.value ? '#eef2ff' : '#fff',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{role.icon}</div>
            <div style={{
              fontSize: 13,
              fontWeight: selectedRole === role.value ? 600 : 400,
              color: selectedRole === role.value ? '#3730a3' : '#374151',
            }}>
              {role.label}
            </div>
          </div>
        ))}
      </div>

      {error && <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>}

      <button
        onClick={handleStart}
        disabled={!selectedRole || !selectedResume || loading}
        style={{
          width: '100%',
          padding: '14px 0',
          background: selectedRole && selectedResume && !loading ? '#4f46e5' : '#e5e7eb',
          color: selectedRole && selectedResume && !loading ? '#fff' : '#9ca3af',
          border: 'none',
          borderRadius: 10,
          fontSize: 16,
          fontWeight: 600,
          cursor: selectedRole && selectedResume && !loading ? 'pointer' : 'not-allowed',
          transition: 'all 0.15s',
        }}
      >
        {loading ? 'Generating your questions...' : 'Generate 10 interview questions →'}
      </button>

      {loading && (
        <p style={{ textAlign: 'center', color: '#666', marginTop: 12, fontSize: 14 }}>
          AI is analysing your resume and crafting personalised questions. This takes 5–10 seconds.
        </p>
      )}
    </div>
  );
}

export default InterviewSetup;