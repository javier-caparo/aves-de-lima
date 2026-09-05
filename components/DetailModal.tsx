import React, { useEffect } from 'react';
import Image from 'next/image';
import { Bird } from '../types';

interface DetailModalProps {
  bird: Bird;
  onClose: () => void;
}

export default function DetailModal({ bird, onClose }: DetailModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        <button 
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full text-gray-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative w-full aspect-video sm:aspect-[21/9] bg-gray-100">
          <Image 
            src={bird.image_url} 
            alt={bird.common_name}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-1 mb-6">
            <h2 className="text-3xl font-bold text-[#111827]">{bird.common_name}</h2>
            <p className="italic text-lg text-[#6B7280]">{bird.scientific_name}</p>
          </div>
          
          <div className="mb-6">
             <span className="inline-block px-3 py-1 bg-[#059669]/10 text-[#059669] text-sm font-medium rounded-md">
              Habitat: {bird.habitat}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#111827] uppercase tracking-wider mb-2">Description</h3>
            <p className="text-base text-[#6B7280] leading-relaxed">
              {bird.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}