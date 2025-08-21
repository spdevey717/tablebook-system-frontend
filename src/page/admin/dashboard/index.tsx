const DashboardPage = () => {
  const stats = [
    { label: "Total Users", value: "1,234", change: "+12%", icon: "👥", color: "primary" },
    { label: "Active Bookings", value: "89", change: "+5%", icon: "📅", color: "secondary" },
    { label: "Revenue", value: "$12,345", change: "+8%", icon: "💰", color: "accent" },
    { label: "Restaurants", value: "45", change: "+3%", icon: "🍽️", color: "primary" },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary': return 'from-primary-500 to-primary-600';
      case 'secondary': return 'from-secondary-500 to-secondary-600';
      case 'accent': return 'from-accent-500 to-accent-600';
      default: return 'from-primary-500 to-primary-600';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Dashboard</h1>
        <p className="text-gray-600 text-lg">Welcome to your TableBook.Me admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={stat.label} className="card card-hover p-6" style={{animationDelay: `${index * 0.1}s`}}>
            <div className="flex items-center">
              <div className={`w-16 h-16 bg-gradient-to-r ${getColorClasses(stat.color)} rounded-2xl flex items-center justify-center text-white text-2xl mr-4 shadow-lg`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-green-600 font-semibold flex items-center">
                  <span className="mr-1">↗</span>
                  {stat.change}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">📊</span>
            Recent Bookings
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <div>
                  <p className="font-semibold text-gray-900">Booking #{1000 + i}</p>
                  <p className="text-sm text-gray-600">Pizza Palace • 4 guests</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Confirmed
                  </span>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">⚡</span>
            Quick Actions
          </h3>
          <div className="space-y-4">
            <button className="w-full btn-primary text-left flex items-center">
              <span className="mr-3">➕</span>
              Add New Restaurant
            </button>
            <button className="w-full btn-secondary text-left flex items-center">
              <span className="mr-3">📋</span>
              View All Bookings
            </button>
            <button className="w-full btn-accent text-left flex items-center">
              <span className="mr-3">👥</span>
              Manage Users
            </button>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Trends</h3>
        <div className="h-64 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">📈</div>
            <p className="text-gray-600">Chart visualization would go here</p>
            <p className="text-sm text-gray-500">Showing booking trends over the last 30 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
