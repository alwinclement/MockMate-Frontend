import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchMyResumes } from '../store/resumeSlice';

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.user?.role);

  useEffect(() => {
    dispatch(fetchMyResumes());
  }, [dispatch]);

  const { resumes, loading: resumesLoading } = useSelector((s) => s.resume);

  // If resumes have finished loading and there are none, this user has no resume yet
  const noResumeYet =
  !resumesLoading &&
  (!resumes || resumes.length === 0);

  const hasResume = resumes && resumes.length > 0;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };
  const cards = [
    {
      title: 'Upload Resume',
      description: 'Upload your resume to extract skills and experience automatically',
      icon: '📄',
      path: '/resume',
      color: '#4f46e5',
      bg: '#eef2ff',
    },
    ...(hasResume ? [{
        title: 'Start Mock Interview',
        description: 'Generate personalised questions and practice with a live session',
        icon: '🎤',
        path: '/interview/setup',
        color: '#7c3aed',
        bg: '#f5f3ff',
    }] : []),
    {
      title: 'Progress Dashboard',
      description: 'Track your score trends and identify weak areas over time',
      icon: '📊',
      path: '/dashboard',
      color: '#059669',
      bg: '#ecfdf5',
    },
  ];
  if (role === 'ADMIN') {
    cards.push({
        title: 'Admin Panel',
        description: 'Manage users, roles, and view platform-wide statistics',
        icon: '🛠️',
        path: '/admin',
        color: '#dc2626',
        bg: '#fef2f2',
    });
  }
  if (noResumeYet) {
    return (
        <div style={{ maxWidth: 480, margin: '100px auto', padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📄</div>
            <h3 style={{ marginBottom: 8 }}>Upload your resume first</h3>
            <p style={{ color: '#6b7280', marginBottom: 24 }}>
                We need your resume to generate personalised interview questions.
            </p>
            <button
                onClick={() => navigate('/resume')}
                style={{
                    padding: '12px 28px', background: '#4f46e5', color: '#fff',
                    border: 'none', borderRadius: 8, fontSize: 15,
                    fontWeight: 600, cursor: 'pointer',
                }}
            >
                Upload resume & start mock interview
            </button>
        </div>
    );
}

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f3ff 0%, #eef2ff 50%, #faf5ff 100%)',
      padding: '40px 24px',
    }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 48,
        }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 700,
              color: '#1e1b4b',
            }}>
              Welcome back{user?.name ? `, ${user.name}` : ''}
            </h1>
            <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 15 }}>
              Ready to practice your next interview?
            </p>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              color: '#6b7280',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#dc2626';
              e.currentTarget.style.color = '#dc2626';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            Logout
          </button>
        </div>

        {/* Action cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
          marginBottom: 40,
        }}>
          {cards.map((card) => (
            <Link
              key={card.path}
              to={card.path}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  padding: '28px 24px',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  height: '100%',
                  boxSizing: 'border-box',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(79, 70, 229, 0.12)';
                  e.currentTarget.style.borderColor = card.color;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: card.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                  marginBottom: 16,
                }}>
                  {card.icon}
                </div>
                <h3 style={{
                  margin: '0 0 8px',
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#1e1b4b',
                }}>
                  {card.title}
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: 14,
                  color: '#6b7280',
                  lineHeight: 1.6,
                }}>
                  {card.description}
                </p>
                <div style={{
                  marginTop: 16,
                  color: card.color,
                  fontSize: 14,
                  fontWeight: 600,
                }}>
                  Get started →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer note */}
        <p style={{
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: 13,
        }}>
          MockMate — AI-powered mock interview practice
        </p>
      </div>
    </div>
  );
}

export default Home;



  
