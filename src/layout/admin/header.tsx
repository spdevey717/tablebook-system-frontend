const AdminHeader = () => {
  return (
    <header className="glass border-b border-gray-200 px-8 py-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gradient">Admin Dashboard</h2>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center space-x-6">
          <button className="relative p-3 text-gray-500 hover:text-primary-600 transition-colors group">
            <span className="text-xl">🔔</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full"></span>
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Notifications
            </span>
          </button>
          
          <div className="flex items-center space-x-4 p-3 bg-white/50 rounded-xl backdrop-blur-sm">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              A
            </div>
            <div>
              <p className="text-gray-900 font-semibold">Admin User</p>
              <p className="text-gray-500 text-sm">Super Admin</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              ⬇️
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
