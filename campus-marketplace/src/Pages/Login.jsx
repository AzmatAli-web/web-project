import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Login attempt:', formData);
      
      const response = await authService.login({
        email: formData.email,
        password: formData.password
      });

      console.log('Login successful:', response);
      // Ensure we have the user role (check response and localStorage)
      const userFromResponse = response?.user;
      const userFromStorage = (() => {
        try {
          return JSON.parse(localStorage.getItem('user'));
        } catch (e) {
          return null;
        }
      })();

      console.log('User from response:', userFromResponse);
      console.log('User from localStorage:', userFromStorage);

      let role = userFromResponse?.role || userFromStorage?.role;

      // If backend didn't return a role, fall back to email-based admin detection
      const email = userFromResponse?.email || userFromStorage?.email || formData.email;
      if (!role && email === 'admin@campus.com') {
        role = 'admin';

        // Ensure localStorage/user reflect admin role so Nav shows correctly
        const updatedUser = { ...(userFromResponse || userFromStorage || {}), role };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      // ✅ Auto-redirect admin to admin dashboard — ensure token/user persisted then force navigation
      if (role === 'admin') {
        // Ensure localStorage has the latest values
        if (response?.token) localStorage.setItem('token', response.token);
        if (response?.user) {
          // If backend didn't include role, augment it
          const respUser = response.user;
          if (!respUser.role && respUser.email === 'admin@campus.com') respUser.role = 'admin';
          localStorage.setItem('user', JSON.stringify(respUser));
        }

        // Try router navigation first, then force full navigation immediately
        try { navigate('/Admin'); } catch (e) {}
        window.location.href = '/Admin';
        return;
      }

      navigate('/');
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter your email"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="submit" 
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p style={styles.signupLink}>
            Don't have an account? <Link to="/signup" style={styles.link}>Sign up here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundImage: 'url("/images/backgroundimg.png")', // ✅ ADD YOUR IMAGE PATH HERE
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    padding: '20px'
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // ✅ TRANSPARENT WHITE
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',

    backdropFilter: 'blur(5px)' // ✅ GLASS EFFECT
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    boxSizing: 'border-box'
  },
  button: {
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '15px'
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb'
  },
  signupLink: {
    textAlign: 'center',
    color: '#666'
  },
  link: {
    color: '#007bff',
    textDecoration: 'none'
  }
};

export default Login;