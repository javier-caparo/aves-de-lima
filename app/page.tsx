'use client';

import React, { useState } from 'react';
import { useBirds } from '../hooks/useBirds';
import { Bird } from '../types';
import GlobalHeader from '../components/GlobalHeader';
import SearchFilterBar from '../components/SearchFilterBar';
import BirdCard from '../components/BirdCard';
import DetailModal from '../components/DetailModal';

export default function MainGallery() {
  const { 
    birds, 
    isLoading, 
    error, 
    refetch: retry,
    searchTerm, 
    setSearchTerm, 
    activeFilter, 
    setActiveFilter 
  } = useBirds();

  const [selectedBird, setSelectedBird] = useState<Bird | null>(null);

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <GlobalHeader />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <SearchFilterBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {error && (
          <div className="mt-8 p-4 bg-[#EF4444]/10 text-[#EF4444] rounded-lg border border-[#EF4444]/20 flex items-center justify-between gap-4">
            <p>{error}</p>
            <button
              onClick={retry}
              className="shrink-0 px-4 py-2 bg-[#EF4444] text-white rounded-md hover:bg-[#fca5a5] transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : birds.length === 0 ? (
          <div className="mt-24 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-medium text-[#111827]">No birds found matching your criteria</h3>
            <button 
              onClick={() => { setSearchTerm(''); setActiveFilter('All'); }}
              className="mt-4 px-6 py-2 bg-[#059669] text-white rounded-md hover:bg-[#047857] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {birds.map(bird => (
              <BirdCard 
                key={bird.id} 
                bird={bird} 
                onClick={() => setSelectedBird(bird)} 
              />
            ))} 
          </div>
        )}
      </div>

      {selectedBird && <DetailModal bird={selectedBird} onClose={() => setSelectedBird(null)} />}
    </main>
  );
}