import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/data';

const StudentProfile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enrollment: '',
    course: '',
    year: '',
    cgpa: '',
    skills: ''
  });
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('placement_current_user'));
    setCurrentUser(user);
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        enrollment: user.enrollment || '',
        course: user.course || '',
        year: user.year || '',
        cgpa: user.cgpa || '',
        skills: user.skills ? user.skills.join(', ') : ''
      });
      setResume(user.resume || null);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResume(file);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let resumeUrl = resume;
      
      if (resume && typeof resume !== 'string') {
        const uploadResult = await dataService.uploadResume(resume);
        resumeUrl = uploadResult.url;
      }

      const updatedUser = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        resume: resumeUrl
      };

      dataService.updateUser(currentUser.id, updatedUser);
      setMessage('Profile updated successfully!');
      
      // Update current user in state and localStorage
      const newUser = { ...currentUser, ...updatedUser };
      setCurrentUser(newUser);
      localStorage.setItem('placement_current_user', JSON.stringify(newUser));
      
    } catch (error) {
      setMessage('Error updating profile: ' + error.message);
    }
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div>
      <div className="card">
        <h2>Student Profile</h2>
        
        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label>Full Name:</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
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
                required
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Enrollment Number:</label>
              <input
                type="text"
                name="enrollment"
                className="form-control"
                value={formData.enrollment}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>Course:</label>
              <select
                name="course"
                className="form-control"
                value={formData.course}
                onChange={handleChange}
                required
              >
                <option value="">Select Course</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="MBA">MBA</option>
                <option value="MCA">MCA</option>
              </select>
            </div>

            <div className="form-group">
              <label>Year:</label>
              <select
                name="year"
                className="form-control"
                value={formData.year}
                onChange={handleChange}
                required
              >
                <option value="">Select Year</option>
                <option value="First">First</option>
                <option value="Second">Second</option>
                <option value="Third">Third</option>
                <option value="Final">Final</option>
              </select>
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>CGPA:</label>
              <input
                type="number"
                name="cgpa"
                className="form-control"
                value={formData.cgpa}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.1"
                required
              />
            </div>

            <div className="form-group">
              <label>Skills (comma separated):</label>
              <input
                type="text"
                name="skills"
                className="form-control"
                value={formData.skills}
                onChange={handleChange}
                placeholder="JavaScript, React, Node.js, Python"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Resume Upload:</label>
            <div className="file-upload">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />
              <div>
                {resume ? (
                  <div>
                    <p>✅ Resume uploaded: {resume.name || 'resume.pdf'}</p>
                    {typeof resume === 'string' && (
                      <a href={resume} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                        View Current Resume
                      </a>
                    )}
                  </div>
                ) : (
                  <div>
                    <p>Click to upload your resume (PDF only)</p>
                    <p style={{ fontSize: '0.9rem', color: '#cccccc' }}>Max size: 5MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;