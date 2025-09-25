import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import userService from '../../../services/userService';
import callService, { type Call } from '../../../services/callService';

interface CallStats {
  total: number;
  success: number;
  failed: number;
  today: number;
}

const DashboardPage = () => {
  const [userCount, setUserCount] = useState(0);
  const [callStats, setCallStats] = useState<CallStats>({ total: 0, success: 0, failed: 0, today: 0 });
  const [recentCalls, setRecentCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch user count
        const userResponse = await userService.getAllUsers();
        if (userResponse.success) {
          setUserCount(userResponse.data.count);
        }

        // Fetch call stats
        const callStatsResponse = await callService.getCallStats();
        if (callStatsResponse.success) {
          setCallStats(callStatsResponse.data);
        }

        // Fetch recent calls
        const recentCallsResponse = await callService.getRecentCalls(5);
        if (recentCallsResponse.success) {
          setRecentCalls(recentCallsResponse.data.calls);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { label: "Total Users", value: userCount.toLocaleString(), change: "+12%", icon: "👥", color: "primary" },
    { label: "Total Calls", value: callStats.total.toLocaleString(), change: "+5%", icon: "📞", color: "secondary" },
    { label: "Calls Today", value: callStats.today.toLocaleString(), change: "+15%", icon: "📅", color: "accent" },
  ];

  // Prepare data for pie chart
  const pieData = [
    { name: 'Successful Calls', value: callStats.success, color: '#10B981' },
    { name: 'Failed Calls', value: callStats.failed, color: '#EF4444' },
    { name: 'Pending Calls', value: callStats.total - callStats.success - callStats.failed, color: '#F59E0B' }
  ].filter(item => item.value > 0);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary': return 'from-primary-500 to-primary-600';
      case 'secondary': return 'from-secondary-500 to-secondary-600';
      case 'accent': return 'from-accent-500 to-accent-600';
      default: return 'from-primary-500 to-primary-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Dashboard</h1>
          <p className="text-gray-600 text-lg">Welcome to your TableBook.Me admin panel</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Dashboard</h1>
        <p className="text-gray-600 text-lg">Welcome to your TableBook.Me admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <span className="mr-3">📞</span>
            Recent Calls
          </h3>
          <div className="space-y-4">
            {recentCalls.length > 0 ? (
              recentCalls.map((call) => {
                // Handle booking data - it could be populated or just an ID
                const booking = typeof call.booking_id === 'object' ? call.booking_id : null;
                const customerName = booking 
                  ? `${booking.guest_firstname} ${booking.guest_surname || ''}`.trim()
                  : 'Unknown Customer';
                const phoneNumber = booking?.phone_number || 'No phone';
                
                return (
                  <div key={call._id} className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {customerName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {phoneNumber} • {call.duration_sec}s
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        call.status === 'success' 
                          ? 'bg-green-100 text-green-800'
                          : call.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {call.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(call.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No recent calls found</p>
              </div>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">📊</span>
            Call Statistics
          </h3>
          <div className="h-64">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-4">📊</div>
                  <p>No call data available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
