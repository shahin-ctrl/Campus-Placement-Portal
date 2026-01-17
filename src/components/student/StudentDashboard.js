import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../../services/data';

const StudentDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    appliedJobs: 0,
    pending: 0,
    approved: 0
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('placement_current_user'));
    setCurrentUser(user);
    loadStats();
  }, []);

  const loadStats = () => {
    const jobs = dataService.getJobs();
    const applications = dataService.getApplications();
    const userApplications = applications.filter(app => app.studentId === currentUser?.id);
    
    setStats({
      totalJobs: jobs.length,
      appliedJobs: userApplications.length,
      pending: userApplications.filter(app => app.status === 'pending').length,
      approved: userApplications.filter(app => app.status === 'approved').length
    });
  };

  const getRecentJobs = () => {
    const jobs = dataService.getJobs();
    return jobs.slice(0, 3); // Show 3 most recent jobs
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div>
      <div className="card">
        <h2>Student Dashboard</h2>
        <p>Welcome back, {currentUser.name}! Here's your placement overview.</p>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalJobs}</div>
          <div className="stat-label">Available Jobs</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.appliedJobs}</div>
          <div className="stat-label">Applications Sent</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending Reviews</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.approved}</div>
          <div className="stat-label">Approved</div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Quick Actions */}
        <div className="card">
          <h2>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="/student/profile" className="btn btn-primary">
              Update Profile & Resume
            </Link>
            <Link to="/student/jobs" className="btn btn-success">
              Browse All Jobs
            </Link>
            <Link to="/student/applications" className="btn btn-warning">
              View My Applications
            </Link>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="card">
          <h2>Recent Job Postings</h2>
          {getRecentJobs().length === 0 ? (
            <p>No job postings available.</p>
          ) : (
            getRecentJobs().map(job => (
              <div key={job.id} className="job-card">
                <div className="job-title">{job.title}</div>
                <div className="job-company">{job.companyName}</div>
                <div className="job-details">
                  <span className="job-detail">{job.location}</span>
                  <span className="job-detail">{job.salary}</span>
                  <span className="job-detail">{job.type}</span>
                </div>
                <Link to="/student/jobs" className="btn btn-secondary" style={{marginTop: '0.5rem'}}>
                  View Details
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Profile Completion */}
      <div className="card">
        <h2>Profile Completion</h2>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ 
            background: '#162447', 
            borderRadius: '10px', 
            height: '20px',
            marginBottom: '0.5rem'
          }}>
            <div style={{
              background: '#00b4d8',
              height: '100%',
              borderRadius: '10px',
              width: currentUser.resume ? '100%' : '70%',
              transition: 'width 0.3s'
            }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{currentUser.resume ? 'Profile Complete!' : 'Complete your profile'}</span>
            <span>{currentUser.resume ? '100%' : '70%'}</span>
          </div>
        </div>
        {!currentUser.resume && (
          <Link to="/student/profile" className="btn btn-primary">
            Upload Resume to Complete Profile
          </Link>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;