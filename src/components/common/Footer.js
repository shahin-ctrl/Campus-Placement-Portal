import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      background: '#162447',
      color: '#ffffff',
      padding: '2rem',
      marginTop: 'auto',
      borderTop: '2px solid #1b3a5e'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem'
      }}>
        <div>
          <h3 style={{ color: '#00b4d8', marginBottom: '1rem' }}>Campus Placement Portal</h3>
          <p>Connecting talented students with top companies for career opportunities and internships.</p>
        </div>
        
        <div>
          <h4 style={{ color: '#00b4d8', marginBottom: '1rem' }}>Quick Links</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <a href="/student/jobs" style={{ color: '#cccccc', textDecoration: 'none' }}>Browse Jobs</a>
            <a href="/company/post-job" style={{ color: '#cccccc', textDecoration: 'none' }}>Post a Job</a>
            <a href="/login" style={{ color: '#cccccc', textDecoration: 'none' }}>Student Login</a>
            <a href="/login" style={{ color: '#cccccc', textDecoration: 'none' }}>Company Login</a>
          </div>
        </div>
        
        <div>
          <h4 style={{ color: '#00b4d8', marginBottom: '1rem' }}>Contact Info</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#cccccc' }}>
            <div>📧 support@placementportal.com</div>
            <div>📞 +1 (555) 123-4567</div>
            <div>🏢 University Campus, Education City</div>
          </div>
        </div>
        
        <div>
          <h4 style={{ color: '#00b4d8', marginBottom: '1rem' }}>System Status</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#cccccc' }}>
            <div>🟢 Portal: Operational</div>
            <div>🟢 Applications: Open</div>
            <div>🟢 Support: Available</div>
          </div>
        </div>
      </div>
      
      <div style={{
        marginTop: '2rem',
        paddingTop: '1rem',
        borderTop: '1px solid #1b3a5e',
        textAlign: 'center',
        color: '#cccccc'
      }}>
        <p>&copy; 2024 Campus Placement Portal. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;