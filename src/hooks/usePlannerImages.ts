import { useState, useEffect, useRef } from 'react';
import { getCachedImage, setCachedImage, fetchPlannerImage } from '@/utils/plannerImageFetcher';

interface Planner {
  name: string;
  website?: string;
}

interface UsePlannerImagesResult {
  getImage: (name: string) => string | null;
  isLoading: (name: string) => boolean;
  progress: { loaded: number; total: number };
}

export const usePlannerImages = (planners: Planner[]): UsePlannerImagesResult => {
  const [imageMap, setImageMap] = useState<Record<string, string | null>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });
  const isLoadingRef = useRef(false);
  const plannersKey = JSON.stringify(planners.map(p => p.name));

  useEffect(() => {
    // Prevent concurrent execution
    if (isLoadingRef.current) return;
    
    const loadImages = async () => {
      isLoadingRef.current = true;
      
      // First, load all cached images immediately
      const cachedImages: Record<string, string | null> = {};
      const plannersToFetch: Planner[] = [];

      planners.forEach(planner => {
        const cached = getCachedImage(planner.name);
        if (cached) {
          cachedImages[planner.name] = cached;
        } else if (planner.website) {
          plannersToFetch.push(planner);
        }
      });

      // Batch state updates
      setImageMap(cachedImages);
      setProgress({ loaded: Object.keys(cachedImages).length, total: planners.length });

      // If no planners to fetch, we're done
      if (plannersToFetch.length === 0) {
        isLoadingRef.current = false;
        return;
      }

      // Mark all planners to fetch as loading
      const initialLoadingMap: Record<string, boolean> = {};
      plannersToFetch.forEach(planner => {
        initialLoadingMap[planner.name] = true;
      });
      setLoadingMap(initialLoadingMap);

      // Batch fetch images (3 at a time with delay)
      const batchSize = 3;
      let loadedCount = Object.keys(cachedImages).length;

      for (let i = 0; i < plannersToFetch.length; i += batchSize) {
        const batch = plannersToFetch.slice(i, i + batchSize);
        
        // Fetch batch in parallel
        const results = await Promise.allSettled(
          batch.map(async (planner) => {
            try {
              const imageUrl = await fetchPlannerImage(planner.website);
              return { planner, imageUrl, error: null };
            } catch (error) {
              return { planner, imageUrl: null, error };
            }
          })
        );

        // Batch state updates for the entire batch
        const newImages: Record<string, string | null> = {};
        const newLoadingStates: Record<string, boolean> = {};
        
        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            const { planner, imageUrl, error } = result.value;
            newImages[planner.name] = imageUrl;
            newLoadingStates[planner.name] = false;
            
            if (imageUrl) {
              setCachedImage(planner.name, imageUrl);
            }
            if (error) {
              console.error(`Failed to fetch image for ${planner.name}:`, error);
            }
          }
        });

        loadedCount += batch.length;
        
        // Single batched state update per batch
        setImageMap(prev => ({ ...prev, ...newImages }));
        setLoadingMap(prev => ({ ...prev, ...newLoadingStates }));
        setProgress({ loaded: loadedCount, total: planners.length });

        // Delay between batches
        if (i + batchSize < plannersToFetch.length) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }
      
      isLoadingRef.current = false;
    };

    loadImages();
  }, [plannersKey]); // Use stringified key instead of array reference

  const getImage = (name: string): string | null => {
    return imageMap[name] ?? null;
  };

  const isLoading = (name: string): boolean => {
    return loadingMap[name] ?? false;
  };

  return { getImage, isLoading, progress };
};
