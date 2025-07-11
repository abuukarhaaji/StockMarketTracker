import React from 'react';
import { Calendar } from 'lucide-react';

interface YearFilterProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export function YearFilter({ selectedYear, onYearChange }: YearFilterProps) {
  // Generate years from 2000 to 2100
  const years = Array.from({ length: 101 }, (_, i) => 2000 + i);

  return (
    <div className="flex items-center space-x-2">
      <div className="bg-blue-100 dark:bg-navy-800 w-8 h-8 rounded-full flex items-center justify-center">
        <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      </div>
      <select
        value={selectedYear}
        onChange={(e) => onYearChange(parseInt(e.target.value))}
        className="px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-navy-800 text-gray-900 dark:text-white font-medium"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Year</span>
    </div>
  );
}