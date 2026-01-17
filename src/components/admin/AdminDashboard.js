import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../../services/data';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    totalJobs: 0,
    totalApplications: 0,
    pendingApplications: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const users = dataService.getUsers();
    const jobs = dataService.getJobs();
    const applications = dataService.getApplications();

    setStats({
      totalStudents: users.filter(user => user.role === 'student').length,
      totalCompanies: users.filter(user => user.role === 'company').length,
      totalJobs: jobs.length,
      totalApplications: applications.length,
      pendingApplications: applications.filter(app => app.status === 'pending').length
    });
  };

  const getRecentActivities = () => {
    const users = dataService.getUsers();
    const jobs = dataService.getJobs();
    const applications = dataService.getApplications();

    // Combine recent activities
    const activities = [
      ...users.map(user => ({
        type: 'user',
        action: 'registered',
        name: user.name,
        role: user.role,
        time: user.createdAt
      })),
      ...jobs.map(job => ({
        type: 'job',
        action: 'posted',
        name: job.title,
        company: job.companyName,
        time: job.createdAt
      })),
      ...applications.map(app => ({
        type: 'application',
        action: 'submitted',
        student: app.studentName,
        job: app.jobTitle,
        time: app.appliedAt
      }))
    ];

    // Sort by time and get latest 5
    return activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);
  };

  return (
    <div>
      <div className="card">
        <h2>Admin Dashboard</h2>
        <p>Welcome to the placement portal administration panel.</p>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalStudents}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalCompanies}</div>
          <div className="stat-label">Registered Companies</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalJobs}</div>
          <div className="stat-label">Job Postings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalApplications}</div>
          <div className="stat-label">Total Applications</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.pendingApplications}</div>
          <div className="stat-label">Pending Applications</div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Quick Actions */}
        <div className="card">
          <h2>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="/admin/users" className="btn btn-primary">
              Manage Users
            </Link>
            <Link to="/admin/jobs" className="btn btn-success">
              Manage Jobs
            </Link>
            <button className="btn btn-warning" onClick={() => loadStats()}>
              Refresh Statistics
            </button>
            <button className="btn btn-secondary" onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}>
              Reset System Data
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2>Recent Activity</h2>
          {getRecentActivities().length === 0 ? (
            <p>No recent activity.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {getRecentActivities().map((activity, index) => (
                <div key={index} style={{ 
                  padding: '1rem', 
                  background: '#162447', 
                  borderRadius: '5px',
                  border: '1px solid #1b3a5e'
                }}>
                  {activity.type === 'user' && (
                    <div>
                      <strong>{activity.name}</strong> {activity.action} as {activity.role}
                    </div>
                  )}
                  {activity.type === 'job' && (
                    <div>
                      <strong>{activity.name}</strong> {activity.action} by {activity.company}
                    </div>
                  )}
                  {activity.type === 'application' && (
                    <div>
                      <strong>{activity.student}</strong> {activity.action} application for {activity.job}
                    </div>
                  )}
                  <div style={{ fontSize: '0.8rem', color: '#cccccc', marginTop: '0.5rem' }}>
                    {new Date(activity.time).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* System Info */}
      <div className="card">
        <h2>System Information</h2>
        <div className="grid grid-3">
          <div>
            <strong>Portal Status:</strong>
            <div style={{ color: '#2a9d8f' }}>🟢 Operational</div>
          </div>
          <div>
            <strong>Total Users:</strong>
            <div>{stats.totalStudents + stats.totalCompanies + 1}</div>
          </div>
          <div>
            <strong>Last Updated:</strong>
            <div>{new Date().toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;