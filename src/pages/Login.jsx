import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../store/authSlice';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); 
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/home');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f3ff 0%, #eef2ff 50%, #faf5ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: '#fff',
        borderRadius: 20,
        padding: '40px 32px',
        boxShadow: '0 20px 40px rgba(79, 70, 229, 0.1)',
        border: '1px solid #f0f0ff',
      }}>

        {/* Logo / brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            margin: '0 auto 16px',
          }}>
            🎤
          </div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#1e1b4b' }}>
            Welcome back
          </h2>
          <p style={{ margin: '6px 0 0', color: '#6b7280', fontSize: 14 }}>
            Log in to continue your interview prep
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 8,
            padding: '10px 14px',
            marginBottom: 20,
            color: '#dc2626',
            fontSize: 13,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block', fontSize: 13, fontWeight: 500,
              color: '#374151', marginBottom: 6,
            }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%', padding: '11px 14px',
                border: '1px solid #e5e7eb', borderRadius: 10,
                fontSize: 14, boxSizing: 'border-box',
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Password field with show/hide toggle */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block', fontSize: 13, fontWeight: 500,
              color: '#374151', marginBottom: 6,
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', padding: '11px 44px 11px 14px',
                  border: '1px solid #e5e7eb', borderRadius: 10,
                  fontSize: 14, boxSizing: 'border-box',
                  outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  color: '#6b7280',
                  fontSize: 18,
                }}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🔓' : '🔒'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px 0',
              background: loading ? '#a5a3f0' : '#4f46e5',
              color: '#fff', border: 'none', borderRadius: 10,
              fontSize: 15, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => { if (!loading) e.target.style.background = '#4338ca'; }}
            onMouseOut={(e) => { if (!loading) e.target.style.background = '#4f46e5'; }}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', marginTop: 24,
          fontSize: 14, color: '#6b7280',
        }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;