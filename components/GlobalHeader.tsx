import React from 'react';

export default function GlobalHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Placeholder for an icon/logo */}
          <div className="w-8 h-8 bg-[#059669] rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <h1 className="text-xl font-semibold text-[#111827]">Birds of Lima</h1>
        </div>
      </div>
    </header>
  );
}