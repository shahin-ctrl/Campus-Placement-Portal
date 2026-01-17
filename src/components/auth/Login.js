import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/auth';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await authService.login(formData.email, formData.password, formData.role);
      onLogin(user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to Placement Portal</h2>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="role-selector">
            {['student', 'company', 'admin'].map(role => (
              <div
                key={role}
                className={`role-option ${formData.role === role ? 'selected' : ''}`}
                onClick={() => setFormData({...formData, role})}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </div>
            ))}
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
            Login
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>

        <div className="demo-credentials" style={{ marginTop: '2rem', padding: '1rem', background: '#162447', borderRadius: '5px' }}>
          <p><strong>Demo Credentials:</strong></p>
          <p>Student: student@placement.com / student123</p>
          <p>Company: company@placement.com / company123</p>
          <p>Admin: admin@placement.com / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;