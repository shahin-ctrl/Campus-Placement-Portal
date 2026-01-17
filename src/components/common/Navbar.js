import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ currentUser, onLogout }) => {
  const getNavLinks = () => {
    switch (currentUser.role) {
      case 'student':
        return (
          <>
            <Link to="/student" className="nav-link">Dashboard</Link>
            <Link to="/student/profile" className="nav-link">Profile</Link>
            <Link to="/student/jobs" className="nav-link">Browse Jobs</Link>
            <Link to="/student/applications" className="nav-link">My Applications</Link>
          </>
        );
      case 'company':
        return (
          <>
            <Link to="/company" className="nav-link">Dashboard</Link>
            <Link to="/company/post-job" className="nav-link">Post Job</Link>
            <Link to="/company/jobs" className="nav-link">Manage Jobs</Link>
          </>
        );
      case 'admin':
        return (
          <>
            <Link to="/admin" className="nav-link">Dashboard</Link>
            <Link to="/admin/users" className="nav-link">Manage Users</Link>
            <Link to="/admin/jobs" className="nav-link">Manage Jobs</Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo">Campus Placement Portal</div>
        <div className="nav-links">
          {getNavLinks()}
          <span className="nav-link">Welcome, {currentUser.name}</span>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;