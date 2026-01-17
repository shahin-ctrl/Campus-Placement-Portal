const AUTH_KEY = 'placement_current_user';
const USERS_KEY = 'placement_users';

// Initialize sample data
export const initializeData = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    const sampleUsers = [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@placement.com',
        password: 'admin123',
        role: 'admin',
        phone: '111-111-1111',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Tech Solutions Inc.',
        email: 'company@placement.com',
        password: 'company123',
        role: 'company',
        phone: '222-222-2222',
        industry: 'Technology',
        description: 'Leading tech company',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'John Student',
        email: 'student@placement.com',
        password: 'student123',
        role: 'student',
        phone: '333-333-3333',
        enrollment: '2024CS001',
        course: 'Computer Science',
        year: 'Final',
        cgpa: '8.5',
        skills: ['JavaScript', 'React', 'Node.js'],
        resume: null,
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(sampleUsers));
  }

  if (!localStorage.getItem('jobs')) {
    const sampleJobs = [
      {
        id: '1',
        companyId: '2',
        companyName: 'Tech Solutions Inc.',
        title: 'Frontend Developer',
        description: 'We are looking for a skilled Frontend Developer...',
        requirements: ['React', 'JavaScript', 'HTML/CSS'],
        location: 'Bangalore',
        salary: '8-12 LPA',
        type: 'Full-time',
        deadline: '2024-12-31',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('jobs', JSON.stringify(sampleJobs));
  }

  if (!localStorage.getItem('applications')) {
    localStorage.setItem('applications', JSON.stringify([]));
  }
};

export const authService = {
  login: (email, password, role) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => 
      u.email === email && 
      u.password === password && 
      u.role === role
    );
    
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      return user;
    }
    throw new Error('Invalid credentials or role');
  },

  register: async (userData) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const existingUser = users.find(u => u.email === userData.email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    
    return newUser;
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(AUTH_KEY);
  }
};