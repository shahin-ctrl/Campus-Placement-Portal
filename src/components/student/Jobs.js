import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/data';

const StudentJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: ''
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('placement_current_user'));
    setCurrentUser(user);
    loadData();
  }, []);

  const loadData = () => {
    const allJobs = dataService.getJobs();
    const allApplications = dataService.getApplications();
    setJobs(allJobs);
    setApplications(allApplications);
  };

  const handleApply = (jobId) => {
    if (!currentUser.resume) {
      alert('Please upload your resume before applying to jobs.');
      return;
    }

    const existingApplication = applications.find(
      app => app.jobId === jobId && app.studentId === currentUser.id
    );

    if (existingApplication) {
      alert('You have already applied for this job.');
      return;
    }

    const job = jobs.find(j => j.id === jobId);
    const application = {
      jobId: jobId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      jobTitle: job.title,
      companyName: job.companyName,
      companyId: job.companyId
    };

    dataService.createApplication(application);
    loadData();
    alert('Application submitted successfully!');
  };

  const hasApplied = (jobId) => {
    return applications.some(
      app => app.jobId === jobId && app.studentId === currentUser.id
    );
  };

  const getApplicationStatus = (jobId) => {
    const application = applications.find(
      app => app.jobId === jobId && app.studentId === currentUser.id
    );
    return application ? application.status : null;
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         job.companyName.toLowerCase().includes(filters.search.toLowerCase());
    const matchesLocation = !filters.location || job.location === filters.location;
    const matchesType = !filters.type || job.type === filters.type;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  const getUniqueLocations = () => {
    return [...new Set(jobs.map(job => job.location))];
  };

  const getUniqueJobTypes = () => {
    return [...new Set(jobs.map(job => job.type))];
  };

  return (
    <div>
      <div className="card">
        <h2>Browse Jobs</h2>
        
        {/* Filters */}
        <div className="grid grid-3">
          <div className="form-group">
            <label>Search Jobs:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by title or company..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Location:</label>
            <select
              className="form-control"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
            >
              <option value="">All Locations</option>
              {getUniqueLocations().map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Job Type:</label>
            <select
              className="form-control"
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="">All Types</option>
              {getUniqueJobTypes().map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="card">
        <h2>Available Jobs ({filteredJobs.length})</h2>
        
        {filteredJobs.length === 0 ? (
          <p>No jobs found matching your criteria.</p>
        ) : (
          filteredJobs.map(job => {
            const applied = hasApplied(job.id);
            const status = getApplicationStatus(job.id);
            
            return (
              <div key={job.id} className="job-card">
                <div className="job-title">{job.title}</div>
                <div className="job-company">{job.companyName}</div>
                
                <div className="job-details">
                  <span className="job-detail">📍 {job.location}</span>
                  <span className="job-detail">💰 {job.salary}</span>
                  <span className="job-detail">⏱️ {job.type}</span>
                  <span className="job-detail">📅 Apply by: {new Date(job.deadline).toLocaleDateString()}</span>
                </div>
                
                <div className="job-description">
                  {job.description}
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Requirements:</strong>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {job.requirements.map((req, index) => (
                      <span key={index} className="job-detail">{req}</span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {applied ? (
                    <div>
                      <span className={`status-${status}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleApply(job.id)}
                      className="btn btn-primary"
                      disabled={!currentUser?.resume}
                    >
                      {currentUser?.resume ? 'Apply Now' : 'Upload Resume to Apply'}
                    </button>
                  )}
                  
                  {!currentUser?.resume && (
                    <span style={{ color: '#e63946', fontSize: '0.9rem' }}>
                      Please upload your resume to apply
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentJobs;