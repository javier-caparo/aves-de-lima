import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for Tailwind class merging
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeFilter: string;
  onFilterChange: (value: string) => void;
}

const HABITAT_FILTERS = ['All', 'Coastal', 'Urban', 'Andean'];

export default function SearchFilterBar({ 
  searchTerm, 
  onSearchChange, 
  activeFilter, 
  onFilterChange 
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
      <div className="relative w-full md:w-96">
        <svg 
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" 
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          type="text"
          placeholder="Search birds..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
        />
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 w-full md:w-auto hide-scrollbar">
        {HABITAT_FILTERS.map(filter => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              activeFilter === filter 
                ? "bg-brand text-white" 
                : "bg-white border border-gray-200 text-muted hover:bg-gray-50"
            )}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}