import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../../services/data';

const CompanyDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('placement_current_user'));
    setCurrentUser(user);
    loadStats();
  }, []);

  const loadStats = () => {
    const jobs = dataService.getJobs();
    const applications = dataService.getApplications();
    const companyJobs = jobs.filter(job => job.companyId === currentUser?.id);
    const companyApplications = applications.filter(app => 
      companyJobs.some(job => job.id === app.jobId)
    );

    setStats({
      totalJobs: companyJobs.length,
      activeJobs: companyJobs.filter(job => new Date(job.deadline) > new Date()).length,
      totalApplications: companyApplications.length,
      pendingApplications: companyApplications.filter(app => app.status === 'pending').length
    });
  };

  const getRecentApplications = () => {
    const applications = dataService.getApplications();
    const jobs = dataService.getJobs();
    const companyJobs = jobs.filter(job => job.companyId === currentUser?.id);
    const companyApplications = applications.filter(app => 
      companyJobs.some(job => job.id === app.jobId)
    );
    
    return companyApplications.slice(0, 5); // Show 5 most recent
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div>
      <div className="card">
        <h2>Company Dashboard</h2>
        <p>Welcome, {currentUser.name}! Manage your job postings and applications.</p>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalJobs}</div>
          <div className="stat-label">Total Jobs Posted</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.activeJobs}</div>
          <div className="stat-label">Active Jobs</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalApplications}</div>
          <div className="stat-label">Total Applications</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.pendingApplications}</div>
          <div className="stat-label">Pending Reviews</div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Quick Actions */}
        <div className="card">
          <h2>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="/company/post-job" className="btn btn-primary">
              Post New Job
            </Link>
            <Link to="/company/jobs" className="btn btn-success">
              Manage Jobs
            </Link>
            <button className="btn btn-warning">
              View All Applications
            </button>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="card">
          <h2>Recent Applications</h2>
          {getRecentApplications().length === 0 ? (
            <p>No applications received yet.</p>
          ) : (
            getRecentApplications().map(application => (
              <div key={application.id} style={{ 
                padding: '1rem', 
                border: '1px solid #1b3a5e', 
                borderRadius: '5px',
                marginBottom: '0.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{application.studentName}</strong>
                    <div style={{ fontSize: '0.9rem', color: '#cccccc' }}>
                      Applied for: {application.jobTitle}
                    </div>
                  </div>
                  <span className={`status-${application.status}`}>
                    {application.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;