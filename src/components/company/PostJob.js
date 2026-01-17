import React, { useState } from 'react';
import { dataService } from '../../services/data';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: '',
    type: 'Full-time',
    deadline: ''
  });
  const [message, setMessage] = useState('');

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('placement_current_user'));
    setCurrentUser(user);
    
    // Set default deadline to 30 days from now
    const defaultDeadline = new Date();
    defaultDeadline.setDate(defaultDeadline.getDate() + 30);
    setFormData(prev => ({
      ...prev,
      deadline: defaultDeadline.toISOString().split('T')[0]
    }));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const job = {
      ...formData,
      companyId: currentUser.id,
      companyName: currentUser.name,
      requirements: formData.requirements.split(',').map(req => req.trim())
    };

    dataService.createJob(job);
    setMessage('Job posted successfully!');
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      requirements: '',
      location: '',
      salary: '',
      type: 'Full-time',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    setTimeout(() => {
      navigate('/company/jobs');
    }, 2000);
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div>
      <div className="card">
        <h2>Post New Job</h2>
        
        {message && (
          <div className="alert alert-success">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Job Title:</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Frontend Developer, Data Scientist"
              required
            />
          </div>

          <div className="form-group">
            <label>Job Description:</label>
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the job role, responsibilities, and what you're looking for in a candidate..."
              rows="5"
              required
            />
          </div>

          <div className="form-group">
            <label>Requirements (comma separated):</label>
            <input
              type="text"
              name="requirements"
              className="form-control"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="e.g., JavaScript, React, Node.js, Python"
              required
            />
          </div>

          <div className="grid grid-3">
            <div className="form-group">
              <label>Location:</label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Bangalore, Remote"
                required
              />
            </div>

            <div className="form-group">
              <label>Salary:</label>
              <input
                type="text"
                name="salary"
                className="form-control"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g., 8-12 LPA, Negotiable"
                required
              />
            </div>

            <div className="form-group">
              <label>Job Type:</label>
              <select
                name="type"
                className="form-control"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Application Deadline:</label>
            <input
              type="date"
              name="deadline"
              className="form-control"
              value={formData.deadline}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;