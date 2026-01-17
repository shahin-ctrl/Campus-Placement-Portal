import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/data';
import { Link } from 'react-router-dom';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('placement_current_user'));
    setCurrentUser(user);
    loadData();
  }, []);

  const loadData = () => {
    const allJobs = dataService.getJobs();
    const allApplications = dataService.getApplications();
    const companyJobs = allJobs.filter(job => job.companyId === currentUser?.id);
    
    setJobs(companyJobs);
    setApplications(allApplications);
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      dataService.deleteJob(jobId);
      loadData();
      alert('Job deleted successfully!');
    }
  };

  const handleApplicationAction = (applicationId, action) => {
    dataService.updateApplicationStatus(applicationId, action);
    loadData();
    alert(`Application ${action} successfully!`);
  };

  const getJobApplications = (jobId) => {
    return applications.filter(app => app.jobId === jobId);
  };

  const getApplicationCounts = (jobId) => {
    const jobApplications = getJobApplications(jobId);
    return {
      total: jobApplications.length,
      pending: jobApplications.filter(app => app.status === 'pending').length,
      approved: jobApplications.filter(app => app.status === 'approved').length,
      rejected: jobApplications.filter(app => app.status === 'rejected').length
    };
  };

  const getJobStatus = (deadline) => {
    const today = new Date();
    const jobDeadline = new Date(deadline);
    return jobDeadline > today ? 'Active' : 'Expired';
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Manage Jobs</h2>
            <p>Manage your job postings and review applications.</p>
          </div>
          <Link to="/company/post-job" className="btn btn-primary">
            Post New Job
          </Link>
        </div>
      </div>

      {/* Jobs List */}
      <div className="card">
        <h3>Your Job Postings ({jobs.length})</h3>
        
        {jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>You haven't posted any jobs yet.</p>
            <Link to="/company/post-job" className="btn btn-primary">
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {jobs.map(job => {
              const counts = getApplicationCounts(job.id);
              const status = getJobStatus(job.deadline);
              
              return (
                <div key={job.id} className="job-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div className="job-title">{job.title}</div>
                      <div className="job-details">
                        <span className="job-detail">📍 {job.location}</span>
                        <span className="job-detail">💰 {job.salary}</span>
                        <span className="job-detail">⏱️ {job.type}</span>
                        <span className="job-detail">
                          📅 Apply by: {new Date(job.deadline).toLocaleDateString()}
                        </span>
                        <span className={`status-${status === 'Active' ? 'approved' : 'rejected'}`}>
                          {status}
                        </span>
                      </div>
                      
                      {/* Application Stats */}
                      <div style={{ marginTop: '1rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
                          <span>📬 Total: {counts.total}</span>
                          <span>⏳ Pending: {counts.pending}</span>
                          <span>✅ Approved: {counts.approved}</span>
                          <span>❌ Rejected: {counts.rejected}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                      >
                        {selectedJob?.id === job.id ? 'Hide Apps' : 'View Apps'}
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Applications for this job */}
                  {selectedJob?.id === job.id && (
                    <div style={{ marginTop: '1rem', borderTop: '1px solid #1b3a5e', paddingTop: '1rem' }}>
                      <h4>Applications for this Job</h4>
                      {counts.total === 0 ? (
                        <p>No applications received for this job yet.</p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {getJobApplications(job.id).map(application => (
                            <div key={application.id} style={{ 
                              padding: '1rem', 
                              background: '#162447', 
                              borderRadius: '5px',
                              border: '1px solid #1b3a5e'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <strong>{application.studentName}</strong>
                                  <div style={{ fontSize: '0.9rem', color: '#cccccc' }}>
                                    {application.studentEmail}
                                  </div>
                                  <div style={{ fontSize: '0.8rem', color: '#cccccc' }}>
                                    Applied: {new Date(application.appliedAt).toLocaleDateString()}
                                  </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                  <span className={`status-${application.status}`}>
                                    {application.status}
                                  </span>
                                  {application.status === 'pending' && (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                      <button
                                        className="btn btn-success"
                                        onClick={() => handleApplicationAction(application.id, 'approved')}
                                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                                      >
                                        Approve
                                      </button>
                                      <button
                                        className="btn btn-danger"
                                        onClick={() => handleApplicationAction(application.id, 'rejected')}
                                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                                      >
                                        Reject
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageJobs;