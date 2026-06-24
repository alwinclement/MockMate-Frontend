import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchAllUsers, updateUserRole, deleteUser, fetchAdminStats,
} from '../store/adminSlice';

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb',
      borderRadius: 12, padding: '18px 20px',
    }}>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{label}</div>
    </div>
  );
}

function AdminPanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, stats, loading, error } = useSelector((s) => s.admin);
  const currentUserEmail = useSelector((s) => s.auth.user?.email);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const handleRoleChange = (userId, newRole) => {
    dispatch(updateUserRole({ userId, role: newRole }));
  };

  const handleDelete = (userId) => {
    dispatch(deleteUser(userId));
    setConfirmDeleteId(null);
  };

  if (loading && users.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: 80 }}>Loading admin panel...</div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: '40px auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Admin panel</h2>
        <button
          onClick={() => navigate('/home')}
          style={{
            padding: '8px 16px', background: '#fff',
            border: '1px solid #e5e7eb', borderRadius: 8,
            fontSize: 13, cursor: 'pointer',
          }}
        >
          Back to home
        </button>
      </div>

      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: 8, padding: '10px 14px', marginBottom: 16,
          color: '#dc2626', fontSize: 13,
        }}>
          {error}
        </div>
      )}

      {/* Stats row */}
      {stats && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 12, marginBottom: 28,
        }}>
          <StatCard label="Total users" value={stats.totalUsers} color="#4f46e5" />
          <StatCard label="Resumes uploaded" value={stats.totalResumes} color="#7c3aed" />
          <StatCard label="Interview sessions" value={stats.totalSessions} color="#0891b2" />
          <StatCard label="Reports generated" value={stats.totalReports} color="#059669" />
          <StatCard label="Avg score" value={`${stats.averageOverallScore} / 5`} color="#b45309" />
        </div>
      )}

      {/* User table */}
      <div style={{
        background: '#fff', border: '1px solid #e5e7eb',
        borderRadius: 16, overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f9fafb', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px', fontWeight: 500, color: '#6b7280' }}>Email</th>
              <th style={{ padding: '12px 16px', fontWeight: 500, color: '#6b7280' }}>Role</th>
              <th style={{ padding: '12px 16px', fontWeight: 500, color: '#6b7280' }}>Resumes</th>
              <th style={{ padding: '12px 16px', fontWeight: 500, color: '#6b7280' }}>Sessions</th>
              <th style={{ padding: '12px 16px', fontWeight: 500, color: '#6b7280' }}>Reports</th>
              <th style={{ padding: '12px 16px', fontWeight: 500, color: '#6b7280' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px 16px' }}>
                  {u.email}
                  {u.email === currentUserEmail && (
                    <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 6 }}>(you)</span>
                  )}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    disabled={u.email === currentUserEmail}
                    style={{
                      padding: '6px 10px', borderRadius: 6,
                      border: '1px solid #e5e7eb', fontSize: 13,
                      background: u.role === 'ADMIN' ? '#eef2ff' : '#fff',
                      color: u.role === 'ADMIN' ? '#4f46e5' : '#374151',
                      cursor: u.email === currentUserEmail ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{u.resumeCount}</td>
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{u.sessionCount}</td>
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{u.reportCount}</td>
                <td style={{ padding: '12px 16px' }}>
                  {confirmDeleteId === u.id ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => handleDelete(u.id)}
                        style={{
                          padding: '4px 10px', background: '#dc2626', color: '#fff',
                          border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        style={{
                          padding: '4px 10px', background: '#fff',
                          border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(u.id)}
                      disabled={u.email === currentUserEmail}
                      style={{
                        padding: '4px 10px', background: 'none',
                        border: '1px solid #fecaca', borderRadius: 6,
                        color: '#dc2626', fontSize: 12,
                        cursor: u.email === currentUserEmail ? 'not-allowed' : 'pointer',
                        opacity: u.email === currentUserEmail ? 0.4 : 1,
                      }}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPanel;