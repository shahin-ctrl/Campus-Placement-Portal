import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService, initializeData } from './services/auth';
import './App.css';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Student Components
import StudentDashboard from './components/student/StudentDashboard';
import StudentProfile from './components/student/Profile';
import StudentJobs from './components/student/Jobs';
import StudentApplications from './components/student/Applications';

// Company Components
import CompanyDashboard from './components/company/CompanyDashboard';
import PostJob from './components/company/PostJob';
import ManageJobs from './components/company/ManageJobs';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import JobManagement from './components/admin/JobManagement';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    initializeData();
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    
    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
      return <Navigate to="/" />;
    }
    
    return children;
  };

  return (
    <Router>
      <div className="app">
        {currentUser && <Navbar currentUser={currentUser} onLogout={handleLogout} />}
        
        <main className="main-content">
          <Routes>
            {/* Auth Routes */}
            <Route 
              path="/login" 
              element={
                currentUser ? 
                <Navigate to={`/${currentUser.role}`} /> : 
                <Login onLogin={handleLogin} />
              } 
            />
            <Route 
              path="/register" 
              element={
                currentUser ? 
                <Navigate to={`/${currentUser.role}`} /> : 
                <Register onRegister={handleLogin} />
              } 
            />

            {/* Student Routes */}
            <Route 
              path="/student" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/profile" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/jobs" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentJobs />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/applications" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentApplications />
                </ProtectedRoute>
              } 
            />

            {/* Company Routes */}
            <Route 
              path="/company" 
              element={
                <ProtectedRoute allowedRoles={['company']}>
                  <CompanyDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/company/post-job" 
              element={
                <ProtectedRoute allowedRoles={['company']}>
                  <PostJob />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/company/jobs" 
              element={
                <ProtectedRoute allowedRoles={['company']}>
                  <ManageJobs />
                </ProtectedRoute>
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/jobs" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <JobManagement />
                </ProtectedRoute>
              } 
            />

            {/* Default Route */}
            <Route 
              path="/" 
              element={
                currentUser ? 
                <Navigate to={`/${currentUser.role}`} /> : 
                <Navigate to="/login" />
              } 
            />
          </Routes>
        </main>
        
        <main className="main-content" style={{ minHeight: 'calc(100vh - 200px)' }}>
  <Routes>
    {/* ... all your routes ... */}
  </Routes>
</main>

{currentUser && <Footer />}

      </div>
    </Router>
  );
}

export default App;