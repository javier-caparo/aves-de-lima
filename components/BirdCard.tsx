import React from 'react';
import Image from 'next/image';
import { Bird } from '../types';

interface BirdCardProps {
  bird: Bird;
  onClick: () => void;
}

export default function BirdCard({ bird, onClick }: BirdCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-lg shadow-[0px_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <Image 
          src={bird.image_url} 
          alt={bird.common_name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">{bird.common_name}</h2>
          <p className="italic text-sm text-[#6B7280]">{bird.scientific_name}</p>
        </div>
        <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-[#6B7280] text-xs font-medium rounded-md w-fit">
          {bird.habitat}
        </span>
      </div>
    </div>
  );
}