import { useState, useEffect, useMemo, useCallback } from 'react';
import { Bird } from '../types';
import birdsData from '../data/birds.json';

/**
 * Custom hook to manage fetching, searching, and filtering of bird data.
 */
export const useBirds = () => {
  const [birds, setBirds] = useState<Bird[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadCount, setLoadCount] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('All');

  useEffect(() => {
    let ignore = false;

    const fetchBirds = async () => {
      try {
        // Simulating an async network request for future API readiness
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (!ignore) {
          setBirds(birdsData as Bird[]);
          setError(null);
        }
      } catch {
        if (!ignore) {
          setError('Failed to load bird data. Please try again.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void fetchBirds();

    return () => {
      ignore = true;
    };
  }, [loadCount]);

  const retry = useCallback(() => {
    setIsLoading(true);
    setLoadCount((current) => current + 1);
  }, []);

  const filteredBirds = useMemo(() => {
    return birds.filter((bird) => {
      const normalizedSearch = searchTerm.toLowerCase();
      const matchesSearch = 
        bird.common_name.toLowerCase().includes(normalizedSearch) || 
        bird.scientific_name.toLowerCase().includes(normalizedSearch);
      
      const matchesFilter = activeFilter === 'All' || bird.habitat === activeFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [birds, searchTerm, activeFilter]);

  return {
    birds: filteredBirds,
    isLoading,
    error,
    refetch: retry,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
  };
};