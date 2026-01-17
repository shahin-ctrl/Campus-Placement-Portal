export const dataService = {
  // User methods
  getUsers: () => {
    return JSON.parse(localStorage.getItem('placement_users') || '[]');
  },

  getStudents: () => {
    const users = JSON.parse(localStorage.getItem('placement_users') || '[]');
    return users.filter(user => user.role === 'student');
  },

  getCompanies: () => {
    const users = JSON.parse(localStorage.getItem('placement_users') || '[]');
    return users.filter(user => user.role === 'company');
  },

  updateUser: (userId, updates) => {
    const users = JSON.parse(localStorage.getItem('placement_users') || '[]');
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('placement_users', JSON.stringify(users));
      
      // Update current user if it's the same user
      const currentUser = JSON.parse(localStorage.getItem('placement_current_user') || '{}');
      if (currentUser.id === userId) {
        localStorage.setItem('placement_current_user', JSON.stringify(users[userIndex]));
      }
      
      return users[userIndex];
    }
    return null;
  },

  // Job methods
  getJobs: () => {
    return JSON.parse(localStorage.getItem('jobs') || '[]');
  },

  createJob: (job) => {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const newJob = {
      id: Date.now().toString(),
      ...job,
      createdAt: new Date().toISOString()
    };
    jobs.push(newJob);
    localStorage.setItem('jobs', JSON.stringify(jobs));
    return newJob;
  },

  updateJob: (jobId, updates) => {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const jobIndex = jobs.findIndex(job => job.id === jobId);
    if (jobIndex !== -1) {
      jobs[jobIndex] = { ...jobs[jobIndex], ...updates };
      localStorage.setItem('jobs', JSON.stringify(jobs));
      return jobs[jobIndex];
    }
    return null;
  },

  deleteJob: (jobId) => {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const filteredJobs = jobs.filter(job => job.id !== jobId);
    localStorage.setItem('jobs', JSON.stringify(filteredJobs));
    return true;
  },

  // Application methods
  getApplications: () => {
    return JSON.parse(localStorage.getItem('applications') || '[]');
  },

  createApplication: (application) => {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const newApplication = {
      id: Date.now().toString(),
      ...application,
      status: 'pending',
      appliedAt: new Date().toISOString()
    };
    applications.push(newApplication);
    localStorage.setItem('applications', JSON.stringify(applications));
    return newApplication;
  },

  updateApplicationStatus: (applicationId, status) => {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const application = applications.find(app => app.id === applicationId);
    if (application) {
      application.status = status;
      application.updatedAt = new Date().toISOString();
      localStorage.setItem('applications', JSON.stringify(applications));
    }
    return application;
  },

  // File upload simulation
  uploadResume: (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const fileUrl = URL.createObjectURL(file);
        resolve({
          success: true,
          url: fileUrl,
          name: file.name,
          size: file.size
        });
      }, 1000);
    });
  }
};