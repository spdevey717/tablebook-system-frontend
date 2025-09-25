import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/users", label: "Users", icon: "👥" },
    { path: "/admin/bookings", label: "Bookings", icon: "📅" },
    { path: "/admin/phone-upload", label: "Phone Upload", icon: "📱" },
    { path: "/admin/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="w-72 bg-gradient-to-b from-dark-800 to-dark-900 text-white shadow-2xl">
      <div className="p-8 border-b border-gray-700">
        <h1 className="text-3xl font-bold text-gradient mb-2">TableBook.Me</h1>
        <p className="text-gray-400 text-sm">Admin Panel</p>
      </div>
      <nav className="mt-8">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-8 py-4 text-gray-300 hover:bg-gradient-to-r hover:from-primary-600/20 hover:to-secondary-600/20 hover:text-white transition-all duration-300 group ${
              location.pathname === item.path 
                ? "bg-gradient-to-r from-primary-600/30 to-secondary-600/30 text-white border-r-4 border-primary-500" 
                : ""
            }`}
          >
            <span className="mr-4 text-xl group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      {/* <div className="absolute bottom-8 left-8 right-8">
        <div className="card bg-white/10 backdrop-blur-sm p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <div>
              <p className="text-white font-medium">Admin User</p>
              <p className="text-gray-400 text-sm">Super Admin</p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default AdminSidebar;
