import React from 'react';

const TimeFilter = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { value: 'all', label: 'Tổng cộng', description: 'Điểm tích lũy từ trước đến nay' },
    { value: 'monthly', label: 'Tháng này', description: 'Điểm trong tháng hiện tại' },
    { value: 'weekly', label: 'Tuần này', description: 'Điểm trong tuần hiện tại' },
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentFilter === filter.value
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
      
      <div className="mt-2">
        <p className="text-sm text-gray-500">
          {filters.find(f => f.value === currentFilter)?.description}
        </p>
      </div>
    </div>
  );
};

export default TimeFilter;