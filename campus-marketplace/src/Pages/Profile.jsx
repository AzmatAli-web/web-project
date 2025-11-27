import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService'; // For profile updates and user data
import ProfileForm from '../Component/Profile/ProfileForm';
import UserProducts from '../Component/Profile/UserProducts';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'products'
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await userService.getProfile();
      setUser(userData);
    } catch (error) {
      setError('Failed to load profile');
      console.error('Profile error:', error);
      
      // Redirect to login if not authenticated
      if (error.message && (error.message.includes('token') || error.message.includes('auth'))) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      const response = await userService.updateProfile(updatedData);
      setUser(response.user);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: error.message || 'Failed to update profile' };
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading your profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3">
          {/* Profile Sidebar */}
          <div className="card">
            <div className="card-body text-center">
              <div className="mb-3">
                <div 
                  className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center text-white"
                  style={{ width: '80px', height: '80px', fontSize: '2rem' }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              <h5 className="card-title">{user?.name}</h5>
              <p className="text-muted">{user?.email}</p>
              <div className={`badge ${user?.status === 'approved' ? 'bg-success' : 'bg-warning'}`}>
                {user?.status || 'pending'}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="card mt-3">
            <div className="card-body p-0">
              <button
                className={`btn w-100 text-start p-3 border-0 ${
                  activeTab === 'profile' ? 'bg-light text-primary' : 'bg-white'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                📝 Edit Profile
              </button>
              <button
                className={`btn w-100 text-start p-3 border-0 ${
                  activeTab === 'products' ? 'bg-light text-primary' : 'bg-white'
                }`}
                onClick={() => setActiveTab('products')}
              >
                🛍️ My Products
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          {/* Main Content */}
          <div className="card">
            <div className="card-body">
              {activeTab === 'profile' && (
                <ProfileForm 
                  user={user} 
                  onUpdate={handleUpdateProfile} 
                />
              )}
              
              {activeTab === 'products' && (
                <UserProducts userId={user?.id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;