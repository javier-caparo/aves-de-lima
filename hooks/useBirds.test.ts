import { renderHook, act, waitFor } from '@testing-library/react';
import { useBirds } from './useBirds';

// Arrange: Mock the JSON data
jest.mock('../data/birds.json', () => [
  { id: '1', common_name: 'Turtupilín', scientific_name: 'Pyrocephalus rubinus', habitat: 'Urban' },
  { id: '2', common_name: 'Huerequeque', scientific_name: 'Burhinus superciliaris', habitat: 'Coastal' }
]);

describe('useBirds Hook', () => {
  it('should filter birds by habitat', async () => {
    // Act
    const { result } = renderHook(() => useBirds());
    
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setActiveFilter('Coastal');
    });

    // Assert
    expect(result.current.birds).toHaveLength(1);
    expect(result.current.birds[0].common_name).toBe('Huerequeque');
  });

  it('should filter birds by search term', async () => {
    // Act
    const { result } = renderHook(() => useBirds());
    
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setSearchTerm('pyro');
    });

    // Assert
    expect(result.current.birds).toHaveLength(1);
    expect(result.current.birds[0].id).toBe('1');
  });
});