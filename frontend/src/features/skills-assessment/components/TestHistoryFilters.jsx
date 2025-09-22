import React from 'react';
import { FaFilter, FaSearch, FaCalendarAlt, FaTimes } from 'react-icons/fa';

const TestHistoryFilters = ({ filters, onFilterChange, searchTerm, onSearchChange }) => {
  const testTypes = [
    { value: '', label: 'All Types' },
    { value: 'verbal_reasoning', label: 'Verbal Reasoning' },
    { value: 'numerical_reasoning', label: 'Numerical Reasoning' },
    { value: 'logical_reasoning', label: 'Logical Reasoning' },
    { value: 'situational_judgment', label: 'Situational Judgment' },
    { value: 'abstract_reasoning', label: 'Abstract Reasoning' },
    { value: 'spatial_reasoning', label: 'Spatial Reasoning' },
    { value: 'technical', label: 'Technical' },
  ];

  const limitOptions = [
    { value: 10, label: '10 per page' },
    { value: 20, label: '20 per page' },
    { value: 50, label: '50 per page' },
    { value: 100, label: '100 per page' },
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      test_type: '',
      date_from: '',
      date_to: '',
      limit: 20,
      offset: 0
    });
    onSearchChange('');
  };

  const hasActiveFilters = filters.test_type || filters.date_from || filters.date_to || searchTerm;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by test name or category..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center">
          <FaFilter className="text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>

        {/* Test Type Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Type:</label>
          <select
            value={filters.test_type}
            onChange={(e) => handleFilterChange('test_type', e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {testTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date From Filter */}
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="text-gray-400" />
          <label className="text-sm text-gray-600">From:</label>
          <input
            type="date"
            value={filters.date_from}
            onChange={(e) => handleFilterChange('date_from', e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Date To Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">To:</label>
          <input
            type="date"
            value={filters.date_to}
            onChange={(e) => handleFilterChange('date_to', e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Results Per Page */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Show:</label>
          <select
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {limitOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <FaTimes className="mr-1" />
            Clear All
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {filters.test_type && (
            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Type: {testTypes.find(t => t.value === filters.test_type)?.label}
              <button
                onClick={() => handleFilterChange('test_type', '')}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <FaTimes className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.date_from && (
            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              From: {filters.date_from}
              <button
                onClick={() => handleFilterChange('date_from', '')}
                className="ml-1 text-green-600 hover:text-green-800"
              >
                <FaTimes className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.date_to && (
            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              To: {filters.date_to}
              <button
                onClick={() => handleFilterChange('date_to', '')}
                className="ml-1 text-green-600 hover:text-green-800"
              >
                <FaTimes className="h-3 w-3" />
              </button>
            </span>
          )}
          {searchTerm && (
            <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
              Search: "{searchTerm}"
              <button
                onClick={() => onSearchChange('')}
                className="ml-1 text-purple-600 hover:text-purple-800"
              >
                <FaTimes className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TestHistoryFilters;
