import { useState } from 'react';
import { Plus, Building2, Phone, Globe, Hash, Edit, Trash2 } from 'lucide-react';
import { type Restaurant } from '../../../types';
import RestaurantForm from '../../../components/RestaurantForm';

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([
    {
      id: 1,
      name: "Three HorseShoes",
      address: "123 Main Street, London, UK",
      contact_info: "info@threehorseshoes.com",
      country_code: "GB",
      dial_prefix: "+44",
      retell_agent_id: "agent_001",
      retell_number: "+44 20 1234 5678",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      name: "Sushi Palace",
      address: "456 Sushi Lane, Tokyo, Japan",
      contact_info: "contact@sushipalace.jp",
      country_code: "JP",
      dial_prefix: "+81",
      retell_agent_id: "agent_002",
      retell_number: "+81 3 1234 5678",
      created_at: "2024-01-02T00:00:00Z",
      updated_at: "2024-01-02T00:00:00Z"
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');

  const countries = [
    { code: 'all', name: 'All Countries' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'US', name: 'United States' },
    { code: 'JP', name: 'Japan' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' }
  ];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || restaurant.country_code === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const handleAddRestaurant = (restaurantData: Omit<Restaurant, 'id' | 'created_at' | 'updated_at'>) => {
    const newRestaurant: Restaurant = {
      ...restaurantData,
      id: Math.max(...restaurants.map(r => r.id)) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setRestaurants(prev => [...prev, newRestaurant]);
    setShowForm(false);
  };

  const handleEditRestaurant = (restaurantData: Omit<Restaurant, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingRestaurant) {
      const updatedRestaurant: Restaurant = {
        ...editingRestaurant,
        ...restaurantData,
        updated_at: new Date().toISOString()
      };
      setRestaurants(prev => prev.map(r => r.id === editingRestaurant.id ? updatedRestaurant : r));
      setEditingRestaurant(null);
    }
  };

  const handleDeleteRestaurant = (id: number) => {
    if (confirm('Are you sure you want to delete this restaurant? This action cannot be undone.')) {
      setRestaurants(prev => prev.filter(r => r.id !== id));
    }
  };

  const openEditForm = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingRestaurant(null);
  };

  const getCountryFlag = (countryCode: string) => {
    const flagMap: Record<string, string> = {
      'GB': '🇬🇧',
      'US': '🇺🇸',
      'JP': '🇯🇵',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
      'IT': '🇮🇹',
      'ES': '🇪🇸',
      'CA': '🇨🇦',
      'AU': '🇦🇺'
    };
    return flagMap[countryCode] || '🌍';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Restaurant Management</h1>
          <p className="text-gray-600 mt-2">Manage restaurant profiles and Retell integration settings</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Restaurant
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Restaurants</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or address..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCountry('all');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Restaurant Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <RestaurantForm
              restaurant={editingRestaurant || undefined}
              onSubmit={editingRestaurant ? handleEditRestaurant : handleAddRestaurant}
              onCancel={closeForm}
              isEditing={!!editingRestaurant}
            />
          </div>
        </div>
      )}

      {/* Restaurants Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <div key={restaurant.id} className="card p-6 hover:shadow-xl transition-all duration-300">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{restaurant.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getCountryFlag(restaurant.country_code)}</span>
                    <span className="text-sm text-gray-600">{restaurant.country_code}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openEditForm(restaurant)}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Edit Restaurant"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteRestaurant(restaurant.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Restaurant"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Building2 className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                <p className="text-sm text-gray-600">{restaurant.address}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <p className="text-sm text-gray-600">{restaurant.contact_info}</p>
              </div>

              <div className="flex items-center space-x-3">
                <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Dial Prefix: <span className="font-medium">{restaurant.dial_prefix}</span>
                </p>
              </div>
            </div>

            {/* Retell Integration Status */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-700">Retell Integration</span>
                </div>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-600">
                  Agent ID: <span className="font-mono">{restaurant.retell_agent_id}</span>
                </p>
                <p className="text-xs text-gray-600">
                  Phone: <span className="font-mono">{restaurant.retell_number}</span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-2">
                <button className="px-3 py-2 text-xs bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors">
                  View Bookings
                </button>
                <button className="px-3 py-2 text-xs bg-secondary-50 text-secondary-700 rounded-lg hover:bg-secondary-100 transition-colors">
                  Call Queue
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRestaurants.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedCountry !== 'all' 
              ? 'Try adjusting your search criteria'
              : 'Get started by adding your first restaurant'
            }
          </p>
          {!searchTerm && selectedCountry === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Restaurant
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RestaurantsPage;
