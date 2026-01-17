import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/data';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('placement_current_user'));
    setCurrentUser(user);
    loadApplications();
  }, []);

  const loadApplications = () => {
    const allApplications = dataService.getApplications();
    const userApplications = allApplications.filter(app => app.studentId === currentUser?.id);
    setApplications(userApplications);
  };

  const getStatusBadge = (status) => {
    const statusClass = `status-${status}`;
    return <span className={statusClass}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div className="card">
        <h2>My Applications</h2>
        <p>Track all your job applications in one place.</p>
      </div>

      <div className="card">
        <h2>Application History ({applications.length})</h2>
        
        {applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>You haven't applied to any jobs yet.</p>
            <a href="/student/jobs" className="btn btn-primary">Browse Jobs</a>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Salary</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(application => (
                  <tr key={application.id}>
                    <td>
                      <strong>{application.jobTitle}</strong>
                    </td>
                    <td>{application.companyName}</td>
                    <td>{formatDate(application.appliedAt)}</td>
                    <td>{getStatusBadge(application.status)}</td>
                    <td>
                      {dataService.getJobs().find(job => job.id === application.jobId)?.location || 'N/A'}
                    </td>
                    <td>
                      {dataService.getJobs().find(job => job.id === application.jobId)?.salary || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Application Statistics */}
      <div className="grid grid-3">
        <div className="stat-card">
          <div className="stat-number">
            {applications.filter(app => app.status === 'pending').length}
          </div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {applications.filter(app => app.status === 'approved').length}
          </div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {applications.filter(app => app.status === 'rejected').length}
          </div>
          <div className="stat-label">Rejected</div>
        </div>
      </div>
    </div>
  );
};

export default StudentApplications;