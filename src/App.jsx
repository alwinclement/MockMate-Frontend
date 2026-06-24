import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import ResumeUpload from './pages/ResumeUpload';
import InterviewSetup from './pages/InterviewSetup';
import InterviewQuestions from './pages/InterviewQuestions';
import LiveInterview from './pages/LiveInterview';
import InterviewResults from './pages/InterviewResults';
import FeedbackReport from './pages/FeedbackReport';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route
            path="/resume"
            element={
              <ProtectedRoute>
                <ResumeUpload />
              </ProtectedRoute>
            }
          />
          <Route path="/interview/setup" element={
            <ProtectedRoute>
              <InterviewSetup />
            </ProtectedRoute>
          }
          />
          <Route path="/interview/questions" element={
            <ProtectedRoute>
              <InterviewQuestions />
            </ProtectedRoute>
           } 
          />
          <Route  path="/interview/live/:sessionId" element={
            <ProtectedRoute><LiveInterview /></ProtectedRoute>
            }
          />
          <Route  path="/interview/results/:sessionId"  element={
            <ProtectedRoute><InterviewResults /></ProtectedRoute>
            }
          />
          <Route
            path="/interview/results/report/:sessionId"
            element={
                <ProtectedRoute>
                    <FeedbackReport />
                </ProtectedRoute>
            }
          />
          <Route
              path="/dashboard"
              element={
                  <ProtectedRoute>
                      <Dashboard />
                  </ProtectedRoute>
              }
          />
          <Route
            path="/admin"
            element={
                <AdminRoute>
                    <AdminPanel />
                </AdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;