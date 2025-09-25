import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Settings } from 'lucide-react';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/auth/signin');
  };

  const handleProfile = () => {
    setShowDropdown(false);
    navigate('/admin/profile');
  };

  const handleSettings = () => {
    setShowDropdown(false);
    navigate('/admin/settings');
  };

  return (
    <header className="glass border-b border-gray-200 px-8 py-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gradient">Admin Dashboard</h2>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}! Here's what's happening today.</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="flex items-center space-x-4 p-3 bg-white/50 rounded-xl backdrop-blur-sm cursor-pointer hover:bg-white/70 transition-colors" onClick={() => setShowDropdown(!showDropdown)}>
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-gray-900 font-semibold">{user?.name || 'User'}</p>
                <p className="text-gray-500 text-sm">{user?.role === 'admin' ? 'Super Admin' : 'Standard User'}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                ⬇️
              </button>
            </div>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <button 
                  onClick={handleProfile}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </button>
                <button 
                  onClick={handleSettings}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </button>
                <hr className="my-2" />
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
