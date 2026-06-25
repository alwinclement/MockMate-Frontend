import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadResume } from '../store/resumeSlice';
import { useNavigate } from 'react-router-dom';

function ResumeUpload() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, current } = useSelector((s) => s.resume);
  console.log('DEBUG resume state:', { loading, error, current });
  
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === 'application/pdf') setFile(dropped);
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected?.type === 'application/pdf') setFile(selected);
  };

  const handleUpload = () => {
    if (file) dispatch(uploadResume(file));
  };

  const dropZoneStyle = {
    border: `2px dashed ${dragging ? '#4f46e5' : '#ccc'}`,
    borderRadius: 12,
    padding: '40px 20px',
    textAlign: 'center',
    background: dragging ? '#f0f0ff' : '#fafafa',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  return (
    <div style={{ maxWidth: 600, margin: '60px auto', padding: 24 }}>
      <h2>Upload your resume</h2>
      <p style={{ color: '#666', marginBottom: 24 }}>
        PDF only. We'll extract your skills and experience automatically.
      </p>

      <div
        style={dropZoneStyle}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        {file ? (
          <p style={{ color: '#4f46e5', fontWeight: 500 }}>
            {file.name}
          </p>
        ) : (
          <>
            <p style={{ fontSize: 18, marginBottom: 8 }}>Drag & drop your PDF here</p>
            <p style={{ color: '#999', fontSize: 14 }}>or click to browse</p>
          </>
        )}
      </div>

      {error && (
        <p style={{ color: 'red', marginTop: 12 }}>{error}</p>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        style={{
          marginTop: 20,
          width: '100%',
          padding: '12px 0',
          background: '#4f46e5',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 16,
          cursor: file && !loading ? 'pointer' : 'not-allowed',
          opacity: file && !loading ? 1 : 0.6,
        }}
      >
        {loading ? 'Parsing your resume...' : 'Upload & Parse'}
      </button>

      {/* Results shown immediately after parsing */}
      {current && !loading && (
        <div style={{ marginTop: 32 }}>
            <h3>Parsed successfully</h3>

            <div style={{ background: '#f5f5f5', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                <p><strong>Name:</strong> {current.candidateName}</p>
                {current.email && <p><strong>Email:</strong> {current.email}</p>}
                {current.phone && <p><strong>Phone:</strong> {current.phone}</p>}
            </div>

            {current.aiSummary && (
                <div style={{ background: '#eef2ff', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                    <strong>AI Summary</strong>
                    <p style={{ marginTop: 8, color: '#444' }}>{current.aiSummary}</p>
                </div>
            )}

            {current.skills?.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                    <strong>Skills detected ({current.skills.length})</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                        {current.skills.map((skill) => (
                            <span key={skill} style={{
                                background: '#e0e7ff', color: '#3730a3',
                                padding: '4px 12px', borderRadius: 20,
                                fontSize: 13, fontWeight: 500,
                            }}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {current.experience?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                  <strong>Experience</strong>
                  <ul style={{ marginTop: 10, paddingLeft: 20 }}>
                      {current.experience.map((exp, i) => (
                          <li key={i} style={{ marginBottom: 6, color: '#444' }}>{exp}</li>
                      ))}
                  </ul>
              </div>
          )}

          <button
              onClick={() => navigate('/interview/setup')}
              style={{
                  width: '100%',
                  marginTop: 24,
                  padding: '14px 0',
                  background: '#4f46e5',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
              }}
          >
              Start mock interview →
          </button>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;