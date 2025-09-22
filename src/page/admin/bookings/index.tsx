import { useState, useEffect } from 'react';
import { Download, Trash2, RefreshCw, Phone, Calendar, Users, FileText } from 'lucide-react';
import bookingService, { type Booking } from '../../../services/bookingService';

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Selection state
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  
  // Check bookings state
  const [isCheckingBookings, setIsCheckingBookings] = useState(false);
  const [checkResults, setCheckResults] = useState<any>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingService.getAllBookings();
      console.log(response);
      if (response.success) {
        setBookings(response.data.bookings);
      } else {
        console.log(response);
        setError(response.error || 'Failed to fetch bookings');
      }
    } catch (err) {
      console.log(err);
      setError('Network error: Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearAllData = async () => {
    if (!confirm('Are you sure you want to clear all booking data? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await bookingService.clearAllData();
      if (response.success) {
        setBookings([]);
        alert(`Successfully cleared ${response.data?.deletedCount || 0} records from the database.`);
      } else {
        alert('Error clearing data: ' + response.error);
      }
    } catch (err) {
      alert('Error clearing data: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleCheckBookings = async () => {
    if (selectedRows.size === 0) {
      alert('Please select at least one booking to check.');
      return;
    }

    if (!confirm(`Are you sure you want to make outbound calls to ${selectedRows.size} selected booking(s)? This will initiate phone calls to verify the bookings.`)) {
      return;
    }

    try {
      setIsCheckingBookings(true);
      setCheckResults(null);
      setError(null);

      const selectedBookingsArray = Array.from(selectedRows);
      const response = await bookingService.checkBookings(selectedBookingsArray);

      if (response.success) {
        setCheckResults(response.data);
        
        // Refresh the bookings to show updated statuses
        await fetchBookings();
        
        // Clear selections after successful check
        setSelectedRows(new Set());
        
        // Show success message
        const { summary } = response.data!;
        alert(`Check bookings completed!\n\nTotal: ${summary.total}\nSuccessful: ${summary.successful}\nFailed: ${summary.failed}`);
      } else {
        setError(response.error || 'Failed to check bookings');
        alert('Error checking bookings: ' + (response.error || 'Unknown error'));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Network error: ' + errorMessage);
      alert('Error checking bookings: ' + errorMessage);
      console.error('Error checking bookings:', err);
    } finally {
      setIsCheckingBookings(false);
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Booking Ref', 'Phone Number', 'Guest Name', 'Booking Date', 'Booking Time', 'Party Size', 'Status', 'Outcome', 'Notes', 'Confirmation Notes', 'Recording URL', 'Call Duration'],
      ...filteredBookings.map(booking => [
        booking.booking_ref,
        booking.phone_number,
        `${booking.guest_firstname} ${booking.guest_surname}`,
        booking.booking_date,
        booking.booking_time,
        booking.party_size,
        booking.status,
        booking.outcome,
        booking.notes,
        booking.confirmation_call_notes,
        booking.recording_url,
        booking.call_duration_sec || ''
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'idle': return 'bg-gray-100 text-gray-800';
      case 'calling': return 'bg-purple-100 text-purple-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter bookings based on search term and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.guest_firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest_surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone_number.includes(searchTerm) ||
      booking.booking_ref.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalItems = filteredBookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredBookings.slice(startIndex, endIndex);

  // Selection handlers
  const toggleRowSelection = (bookingId: string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(bookingId)) {
      newSelection.delete(bookingId);
    } else {
      newSelection.add(bookingId);
    }
    setSelectedRows(newSelection);
  };

  const selectAllRows = () => {
    const allIds = filteredBookings.map(booking => booking._id);
    setSelectedRows(new Set(allIds));
  };

  const clearAllSelections = () => {
    setSelectedRows(new Set());
  };

  const selectCurrentPageRows = () => {
    const currentPageIds = currentData.map(booking => booking._id);
    const newSelection = new Set(selectedRows);
    currentPageIds.forEach(id => newSelection.add(id));
    setSelectedRows(newSelection);
  };

  const clearCurrentPageSelections = () => {
    const currentPageIds = currentData.map(booking => booking._id);
    const newSelection = new Set(selectedRows);
    currentPageIds.forEach(id => newSelection.delete(id));
    setSelectedRows(newSelection);
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Export selected data
  const exportSelectedData = () => {
    const selectedBookings = bookings.filter(booking => selectedRows.has(booking._id));
    const csvContent = [
      ['Booking Ref', 'Phone Number', 'Guest Name', 'Booking Date', 'Booking Time', 'Party Size', 'Status', 'Outcome', 'Notes', 'Confirmation Notes', 'Recording URL', 'Call Duration'],
      ...selectedBookings.map(booking => [
        booking.booking_ref,
        booking.phone_number,
        `${booking.guest_firstname} ${booking.guest_surname}`,
        booking.booking_date,
        booking.booking_time,
        booking.party_size,
        booking.status,
        booking.outcome,
        booking.notes,
        booking.confirmation_call_notes,
        booking.recording_url,
        booking.call_duration_sec || ''
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `selected_bookings_${selectedRows.size}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading bookings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600">
            Manage all restaurant bookings • {bookings.length} total bookings
            {totalPages > 1 && (
              <span className="ml-2 text-blue-600">
                • Page {currentPage} of {totalPages}
              </span>
            )}
            {selectedRows.size > 0 && (
              <span className="ml-2 text-green-600">
                • {selectedRows.size} selected
              </span>
            )}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchBookings}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleCheckBookings}
            disabled={selectedRows.size === 0 || isCheckingBookings}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isCheckingBookings ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Checking...</span>
              </>
            ) : (
              <>
                <Phone className="w-4 h-4" />
                <span>Check Bookings ({selectedRows.size})</span>
              </>
            )}
          </button>
          <button
            onClick={exportData}
            disabled={filteredBookings.length === 0}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export All</span>
          </button>
          {selectedRows.size > 0 && (
            <button
              onClick={exportSelectedData}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Selected ({selectedRows.size})</span>
            </button>
          )}
          <button
            onClick={clearAllData}
            disabled={bookings.length === 0}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Remove All</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Check Results */}
      {checkResults && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Check Bookings Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{checkResults.summary.total}</div>
              <div className="text-sm text-gray-600">Total Processed</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{checkResults.summary.successful}</div>
              <div className="text-sm text-gray-600">Successful</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">{checkResults.summary.failed}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
          </div>
          
          {checkResults.results && checkResults.results.length > 0 && (
            <div className="mt-4">
              <h4 className="text-md font-medium text-blue-800 mb-2">Individual Results:</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {checkResults.results.map((result: any, index: number) => (
                  <div key={index} className="bg-white rounded p-3 text-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{result.bookingRef}</span>
                        <span className="text-gray-500 ml-2">({result.phoneNumber})</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        result.status === 'pending' || result.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {result.status}
                      </span>
                    </div>
                    {result.callId && (
                      <div className="text-xs text-gray-500 mt-1">
                        Call ID: {result.callId}
                      </div>
                    )}
                    {result.error && (
                      <div className="text-xs text-red-600 mt-1">
                        Error: {result.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {checkResults.errors && checkResults.errors.length > 0 && (
            <div className="mt-4">
              <h4 className="text-md font-medium text-red-800 mb-2">Errors:</h4>
              <div className="space-y-1">
                {checkResults.errors.map((error: string, index: number) => (
                  <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              All Bookings ({filteredBookings.length} of {bookings.length})
            </h3>
            <div className="flex items-center space-x-4">
              {/* Items per page selector */}
              <div className="flex items-center space-x-2">
                <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
                  Show:
                </label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={filteredBookings.length}>Show All</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="idle">Idle</option>
                  <option value="calling">Calling</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Selection Controls */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={selectAllRows}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Select All ({filteredBookings.length})
              </button>
              <button
                onClick={selectCurrentPageRows}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Select Current Page ({currentData.length})
              </button>
              <button
                onClick={clearAllSelections}
                disabled={selectedRows.size === 0}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Clear All
              </button>
            </div>
            <div className="text-sm text-gray-600">
              {selectedRows.size > 0 && (
                <span className="text-green-600 font-medium">
                  {selectedRows.size} row{selectedRows.size !== 1 ? 's' : ''} selected
                </span>
              )}
            </div>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500">
              {bookings.length === 0 
                ? "No bookings have been uploaded yet. Upload a CSV file to get started."
                : "No bookings match your current search criteria."
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex flex-col space-y-1">
                      <input
                        type="checkbox"
                        checked={selectedRows.size === filteredBookings.length && filteredBookings.length > 0}
                        onChange={() => {
                          if (selectedRows.size === filteredBookings.length) {
                            clearAllSelections();
                          } else {
                            selectAllRows();
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        title="Select All"
                      />
                      {totalPages > 1 && (
                        <input
                          type="checkbox"
                          checked={currentData.every(booking => selectedRows.has(booking._id)) && currentData.length > 0}
                          onChange={() => {
                            const allCurrentPageSelected = currentData.every(booking => selectedRows.has(booking._id));
                            if (allCurrentPageSelected) {
                              clearCurrentPageSelections();
                            } else {
                              selectCurrentPageRows();
                            }
                          }}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          title="Select Current Page"
                        />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Ref
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Party Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Outcome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    New Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    New Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    New Party Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confirmation Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recording URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Call Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.map((booking) => (
                  <tr 
                    key={booking._id} 
                    className={`hover:bg-gray-50 cursor-pointer ${selectedRows.has(booking._id) ? 'bg-blue-100' : ''}`}
                    onClick={() => toggleRowSelection(booking._id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(booking._id)}
                        onChange={() => toggleRowSelection(booking._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.booking_ref}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.guest_firstname} {booking.guest_surname}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{booking.phone_number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-900">{booking.booking_date}</div>
                          <div className="text-sm text-gray-500">{booking.booking_time}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{booking.party_size} people</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{booking.outcome || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{booking.new_time || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{booking.new_date || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{booking.new_party_size || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{booking.notes || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{booking.confirmation_call_notes || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{booking.recording_url || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{booking.call_duration_sec || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                      <button className="text-green-600 hover:text-green-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Cancel</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
              </div>
              <div className="flex items-center space-x-2">
                {/* Previous button */}
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                  {/* Show first page */}
                  {currentPage > 3 && (
                    <>
                      <button
                        onClick={() => goToPage(1)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                      >
                        1
                      </button>
                      {currentPage > 4 && <span className="px-2 text-gray-500">...</span>}
                    </>
                  )}

                  {/* Show pages around current page */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    if (pageNum < 1 || pageNum > totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`px-3 py-1 text-sm border rounded ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Show last page */}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && <span className="px-2 text-gray-500">...</span>}
                      <button
                        onClick={() => goToPage(totalPages)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                {/* Next button */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
