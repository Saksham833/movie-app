import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollProps {
  /** Function to load the next page */
  fetchNextPage?: () => void;
  /** Whether there are more pages to load */
  hasNextPage?: boolean;
  /** Whether a request is in progress */
  isLoading?: boolean;
  /** Intersection observer threshold (0-1) */
  threshold?: number;
  /** Root margin for the intersection observer */
  rootMargin?: string;
}

/**
 * Custom hook for implementing infinite scroll functionality
 * @param params - Configuration object for the infinite scroll
 * @returns Object containing the ref to attach to the last element in the list
 */
const useInfiniteScroll = (params: UseInfiniteScrollProps = {}) => {
  // Default implementation of fetchNextPage that does nothing
  const defaultFetchNextPage = useCallback(() => {}, []);
  
  const {
    fetchNextPage = defaultFetchNextPage,
    hasNextPage = false,
    isLoading = false,
    threshold = 0.1,
    rootMargin = '0px',
  } = params;

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback<IntersectionObserverCallback>(
    (entries) => {
      const [target] = entries;
      if (target?.isIntersecting && hasNextPage && !isLoading) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isLoading]
  );

  useEffect(() => {
    const element = lastElementRef.current;
    
    if (typeof window === 'undefined' || !element) {
      return;
    }

    const options: IntersectionObserverInit = {
      threshold,
      root: null,
      rootMargin,
    };

    // Disconnect any existing observer
    if (observer.current) {
      observer.current.disconnect();
    }

    // Create new observer
    observer.current = new IntersectionObserver(handleObserver, options);
    observer.current.observe(element);

    // Cleanup function
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [handleObserver, threshold, rootMargin]);

  return { lastElementRef };
};

export default useInfiniteScroll;
