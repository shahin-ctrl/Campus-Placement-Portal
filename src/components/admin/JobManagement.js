import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/data';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    company: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = () => {
    const allJobs = dataService.getJobs();
    setJobs(allJobs);
    setFilteredJobs(allJobs);
  };

  useEffect(() => {
    filterJobs();
  }, [filters, jobs]);

  const filterJobs = () => {
    let filtered = jobs;

    if (filters.company) {
      filtered = filtered.filter(job => job.companyName === filters.company);
    }

    if (filters.status) {
      const today = new Date();
      if (filters.status === 'active') {
        filtered = filtered.filter(job => new Date(job.deadline) > today);
      } else if (filters.status === 'expired') {
        filtered = filtered.filter(job => new Date(job.deadline) <= today);
      }
    }

    if (filters.search) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.companyName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting? This will also delete all associated applications.')) {
      // Delete job
      dataService.deleteJob(jobId);
      
      // Delete associated applications
      const applications = dataService.getApplications();
      const filteredApplications = applications.filter(app => app.jobId !== jobId);
      localStorage.setItem('applications', JSON.stringify(filteredApplications));
      
      loadJobs();
      alert('Job deleted successfully!');
    }
  };

  const getJobStatus = (deadline) => {
    const today = new Date();
    const jobDeadline = new Date(deadline);
    return jobDeadline > today ? 'Active' : 'Expired';
  };

  const getStatusBadge = (status) => {
    return status === 'Active' ? 
      <span className="status-approved">{status}</span> : 
      <span className="status-rejected">{status}</span>;
  };

  const getUniqueCompanies = () => {
    return [...new Set(jobs.map(job => job.companyName))];
  };

  const getJobApplicationsCount = (jobId) => {
    const applications = dataService.getApplications();
    return applications.filter(app => app.jobId === jobId).length;
  };

  return (
    <div>
      <div className="card">
        <h2>Job Management</h2>
        <p>Manage all job postings in the placement portal.</p>
      </div>

      {/* Filters */}
      <div className="card">
        <h3>Filters</h3>
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
            <label>Filter by Company:</label>
            <select
              className="form-control"
              value={filters.company}
              onChange={(e) => setFilters({...filters, company: e.target.value})}
            >
              <option value="">All Companies</option>
              {getUniqueCompanies().map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Filter by Status:</label>
            <select
              className="form-control"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="card">
        <h3>All Job Postings ({filteredJobs.length})</h3>
        
        {filteredJobs.length === 0 ? (
          <p>No jobs found matching your criteria.</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Salary</th>
                  <th>Type</th>
                  <th>Applications</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map(job => (
                  <tr key={job.id}>
                    <td>
                      <strong>{job.title}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#cccccc' }}>
                        {job.requirements.slice(0, 2).join(', ')}...
                      </div>
                    </td>
                    <td>{job.companyName}</td>
                    <td>{job.location}</td>
                    <td>{job.salary}</td>
                    <td>{job.type}</td>
                    <td style={{ textAlign: 'center' }}>
                      <strong>{getJobApplicationsCount(job.id)}</strong>
                    </td>
                    <td>{getStatusBadge(getJobStatus(job.deadline))}</td>
                    <td>{new Date(job.deadline).toLocaleDateString()}</td>
                    <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteJob(job.id)}
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Job Statistics */}
      <div className="grid grid-3">
        <div className="stat-card">
          <div className="stat-number">{jobs.length}</div>
          <div className="stat-label">Total Jobs</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {jobs.filter(job => getJobStatus(job.deadline) === 'Active').length}
          </div>
          <div className="stat-label">Active Jobs</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {dataService.getApplications().length}
          </div>
          <div className="stat-label">Total Applications</div>
        </div>
      </div>
    </div>
  );
};

export default JobManagement;