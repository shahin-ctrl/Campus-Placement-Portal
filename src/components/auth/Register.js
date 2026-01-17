import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/auth';

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    phone: '',
    industry: '',
    description: ''
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
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        industry: formData.industry,
        description: formData.description
      };

      const user = await authService.register(userData);
      onRegister(user);
    } catch (err) {
      setError(err.message);
    }
  };

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case 'company':
        return (
          <>
            <div className="form-group">
              <label>Industry:</label>
              <input
                type="text"
                name="industry"
                className="form-control"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g., Technology, Finance, Healthcare"
                required
              />
            </div>
            <div className="form-group">
              <label>Company Description:</label>
              <textarea
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of your company..."
                rows="3"
                required
              />
            </div>
          </>
        );
      case 'student':
        return (
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register for Placement Portal</h2>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="role-selector">
            {['student', 'company'].map(role => (
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
            <label>{formData.role === 'company' ? 'Company Name' : 'Full Name'}:</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              placeholder={formData.role === 'company' ? 'Enter company name' : 'Enter your full name'}
              required
            />
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

          <div className="grid grid-2">
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>

          {renderRoleSpecificFields()}

          <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
            Register as {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;