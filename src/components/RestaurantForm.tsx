import React, { useState, useEffect } from 'react';
import { Building2, Phone, Hash, Save, X } from 'lucide-react';
import { type Restaurant } from '../types';

interface RestaurantFormProps {
  restaurant?: Restaurant;
  onSubmit: (restaurant: Omit<Restaurant, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const RestaurantForm: React.FC<RestaurantFormProps> = ({ 
  restaurant, 
  onSubmit, 
  onCancel, 
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact_info: '',
    country_code: 'GB',
    dial_prefix: '+44',
    retell_agent_id: '',
    retell_number: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name,
        address: restaurant.address,
        contact_info: restaurant.contact_info,
        country_code: restaurant.country_code,
        dial_prefix: restaurant.dial_prefix,
        retell_agent_id: restaurant.retell_agent_id,
        retell_number: restaurant.retell_number
      });
    }
  }, [restaurant]);

  const countryOptions = [
    { code: 'GB', name: 'United Kingdom', prefix: '+44' },
    { code: 'US', name: 'United States', prefix: '+1' },
    { code: 'CA', name: 'Canada', prefix: '+1' },
    { code: 'AU', name: 'Australia', prefix: '+61' },
    { code: 'DE', name: 'Germany', prefix: '+49' },
    { code: 'FR', name: 'France', prefix: '+33' },
    { code: 'IT', name: 'Italy', prefix: '+39' },
    { code: 'ES', name: 'Spain', prefix: '+34' },
    { code: 'NL', name: 'Netherlands', prefix: '+31' },
    { code: 'BE', name: 'Belgium', prefix: '+32' }
  ];

  const handleCountryChange = (countryCode: string) => {
    const country = countryOptions.find(c => c.code === countryCode);
    setFormData(prev => ({
      ...prev,
      country_code: countryCode,
      dial_prefix: country?.prefix || prev.dial_prefix
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Restaurant name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.contact_info.trim()) {
      newErrors.contact_info = 'Contact information is required';
    }

    if (!formData.retell_agent_id.trim()) {
      newErrors.retell_agent_id = 'Retell Agent ID is required';
    }

    if (!formData.retell_number.trim()) {
      newErrors.retell_number = 'Retell phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Building2 className="w-6 h-6 mr-3 text-primary-600" />
          {isEditing ? 'Edit Restaurant' : 'Add New Restaurant'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Restaurant Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter restaurant name"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Information *
            </label>
            <input
              type="text"
              value={formData.contact_info}
              onChange={(e) => handleInputChange('contact_info', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.contact_info ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Email or phone number"
            />
            {errors.contact_info && (
              <p className="text-red-600 text-sm mt-1">{errors.contact_info}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            rows={3}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.address ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter full address"
          />
          {errors.address && (
            <p className="text-red-600 text-sm mt-1">{errors.address}</p>
          )}
        </div>

        {/* Location & Phone Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country *
            </label>
            <select
              value={formData.country_code}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {countryOptions.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name} ({country.prefix})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dial Prefix *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.dial_prefix}
                onChange={(e) => handleInputChange('dial_prefix', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="+44"
              />
              <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Used for phone number normalization
            </p>
          </div>
        </div>

        {/* Retell Integration */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <Hash className="w-5 h-5 mr-2" />
            Retell Integration Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Retell Agent ID *
              </label>
              <input
                type="text"
                value={formData.retell_agent_id}
                onChange={(e) => handleInputChange('retell_agent_id', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.retell_agent_id ? 'border-red-300' : 'border-blue-300'
                }`}
                placeholder="Enter Retell Agent ID"
              />
              {errors.retell_agent_id && (
                <p className="text-red-600 text-sm mt-1">{errors.retell_agent_id}</p>
              )}
              <p className="text-xs text-blue-600 mt-1">
                Unique identifier for the Retell agent
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Retell Phone Number *
              </label>
              <input
                type="text"
                value={formData.retell_number}
                onChange={(e) => handleInputChange('retell_number', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.retell_number ? 'border-red-300' : 'border-blue-300'
                }`}
                placeholder="+44 20 1234 5678"
              />
              {errors.retell_number && (
                <p className="text-red-600 text-sm mt-1">{errors.retell_number}</p>
              )}
              <p className="text-xs text-blue-600 mt-1">
                Dedicated phone number for this restaurant
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center"
          >
            <Save className="w-5 h-5 mr-2" />
            {isEditing ? 'Update Restaurant' : 'Create Restaurant'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantForm;
