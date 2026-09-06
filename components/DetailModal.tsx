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
      <div className="relative bg-surface rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        <button 
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 rounded-full text-gray-800 dark:text-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <Image 
          src={bird.image_url} 
          alt={bird.common_name}
          width={200}
          height={300}
          className="w-full h-auto object-cover"
        />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-1 mb-6">
            <h2 className="text-3xl font-bold text-foreground">{bird.common_name}</h2>
            <p className="italic text-lg text-muted">{bird.scientific_name}</p>
          </div>
          
          <div className="mb-6">
             <span className="inline-block px-3 py-1 bg-brand/10 text-brand text-sm font-medium rounded-md">
              Habitat: {bird.habitat}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">Description</h3>
            <p className="text-base text-muted leading-relaxed">
              {bird.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}