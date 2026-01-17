import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/data';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    role: '',
    search: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = dataService.getUsers();
    setUsers(allUsers);
    setFilteredUsers(allUsers);
  };

  useEffect(() => {
    filterUsers();
  }, [filters, users]);

  const filterUsers = () => {
    let filtered = users;

    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    if (filters.search) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      const allUsers = dataService.getUsers();
      const filteredUsers = allUsers.filter(user => user.id !== userId);
      localStorage.setItem('placement_users', JSON.stringify(filteredUsers));
      loadUsers();
      alert('User deleted successfully!');
    }
  };

  const handleToggleStatus = (userId, currentStatus) => {
    const users = dataService.getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      users[userIndex].isActive = !currentStatus;
      localStorage.setItem('placement_users', JSON.stringify(users));
      loadUsers();
    }
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      student: '#00b4d8',
      company: '#2a9d8f',
      admin: '#e9c46a'
    };
    
    return (
      <span style={{
        background: roleColors[role],
        color: role === 'admin' ? '#1a1a2e' : 'white',
        padding: '0.3rem 0.8rem',
        borderRadius: '15px',
        fontSize: '0.8rem',
        fontWeight: 'bold'
      }}>
        {role.toUpperCase()}
      </span>
    );
  };

  const getStatusBadge = (user) => {
    const isActive = user.isActive !== false; // Default to true if not specified
    
    return (
      <span
        className={isActive ? 'status-approved' : 'status-rejected'}
        style={{ cursor: 'pointer' }}
        onClick={() => handleToggleStatus(user.id, isActive)}
      >
        {isActive ? 'ACTIVE' : 'INACTIVE'}
      </span>
    );
  };

  return (
    <div>
      <div className="card">
        <h2>User Management</h2>
        <p>Manage all users in the placement portal system.</p>
      </div>

      {/* Filters */}
      <div className="card">
        <h3>Filters</h3>
        <div className="grid grid-3">
          <div className="form-group">
            <label>Search Users:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Filter by Role:</label>
            <select
              className="form-control"
              value={filters.role}
              onChange={(e) => setFilters({...filters, role: e.target.value})}
            >
              <option value="">All Roles</option>
              <option value="student">Students</option>
              <option value="company">Companies</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Actions:</label>
            <button 
              className="btn btn-secondary" 
              onClick={loadUsers}
              style={{ width: '100%' }}
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <h3>All Users ({filteredUsers.length})</h3>
        
        {filteredUsers.length === 0 ? (
          <p>No users found matching your criteria.</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.name}</strong>
                      {user.enrollment && (
                        <div style={{ fontSize: '0.8rem', color: '#cccccc' }}>
                          {user.enrollment}
                        </div>
                      )}
                    </td>
                    <td>{user.email}</td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>{getStatusBadge(user)}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteUser(user.id)}
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Statistics */}
      <div className="grid grid-3">
        <div className="stat-card">
          <div className="stat-number">
            {users.filter(user => user.role === 'student').length}
          </div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {users.filter(user => user.role === 'company').length}
          </div>
          <div className="stat-label">Total Companies</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {users.filter(user => user.role === 'admin').length}
          </div>
          <div className="stat-label">Admin Users</div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;