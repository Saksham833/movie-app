import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { MovieListResponse } from '../types/omdb.types';
import { movieApi, type OmdbSearchParams } from '../services/omdbApi';
import {
  Box,
  Text,
  Button,
  Image,
  Center,
  Loader,
  ActionIcon,
} from '@mantine/core';
import { 
  IconPlayerPlay,
  IconBookmark,
  IconChevronRight,
  IconStar,
  IconInfoCircle
} from '@tabler/icons-react';
import { MovieFilters } from '../components/MovieFilters';

// Define filters type locally since we removed the import
type MovieFiltersType = {
  query: string;
  year: string;
  genre: string;
  type: string;
  ratingMin: string;
  ratingMax: string;
};
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { useFavorites } from '../context/FavoritesContext';
import DocumentHead from '../components/DocumentHead';

const HomePage = () => {
  // Define refs for horizontal scrolling - moved to top to maintain hooks order
  const topPicksRef = useRef<HTMLDivElement>(null);
  const watchlistRef = useRef<HTMLDivElement>(null);
  
  const [filters, setFilters] = useState<MovieFiltersType>({
    query: '',
    year: '',
    genre: '',
    ratingMin: '',
    ratingMax: '',
    type: 'movie',
  } as MovieFiltersType);

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading, 
    isError, 
    error 
  } = useInfiniteQuery({
    queryKey: ['movies', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const params: OmdbSearchParams = {
        page: pageParam,
        query: filters.query || undefined,
        year: filters.year || undefined,
        type: filters.type as 'movie' | 'series' || 'movie'
      };

      const result = await (filters.query 
        ? movieApi.searchMovies(params)
        : movieApi.getPopular(params));
      
      return result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: MovieListResponse) => 
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { lastElementRef } = useInfiniteScroll({
    fetchNextPage: fetchNextPage,
    hasNextPage: !!hasNextPage,
    isLoading: isFetchingNextPage,
    threshold: 0.5,
  });

  const handleFilterChange = (newFilters: Partial<MovieFiltersType>) => {
    setFilters((prev: MovieFiltersType) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const movies = data?.pages.flatMap((page: MovieListResponse) => page.results) || [];
  console.log(movies);

  if (isLoading && !data) {
    return (
      <Center style={{ height: '50vh' }}>
        <Loader size="xl" />
      </Center>
    );
  }

  if (isError && error) {
    return (
      <Center style={{ height: '50vh' }}>
        <Text color="red">Error loading movies: {error instanceof Error ? error.message : 'Unknown error'}</Text>
      </Center>
    );
  }

  // Scroll left/right handler
  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref && ref.current) {
      const scrollAmount = 250;
      const newScrollPosition = direction === 'left' 
        ? ref.current.scrollLeft - scrollAmount 
        : ref.current.scrollLeft + scrollAmount;
      
      ref.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  // Add styles for the IMDb layout with mobile-friendly adjustments
  const styles = {
    pageWrapper: {
      backgroundColor: '#000',
      color: 'white',
      minHeight: '100vh',
      paddingBottom: '40px',
      paddingTop: '20px',
    },
    sectionHeader: {
      display: 'flex' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      marginBottom: '16px',
      borderLeft: '4px solid #f5c518',
      paddingLeft: '10px',
    },
    sectionTitle: {
      color: 'white',
      fontSize: '24px',
      fontWeight: 700,
      marginRight: '8px',
    },
    movieScroller: {
      display: 'flex' as const,
      overflowX: 'auto' as const,
      scrollbarWidth: 'none' as const,
      msOverflowStyle: 'none' as const,
      gap: '16px',
      paddingBottom: '16px',
      '&::-webkit-scrollbar': {
        display: 'none'
      },
      position: 'relative' as const,
    },
    movieCard: {
      width: '150px',
      '@media (min-width: 768px)': {
        width: '180px',
      },
      flexShrink: 0,
      position: 'relative' as const,
      borderRadius: '4px',
      overflow: 'hidden' as const,
    },
    movieImage: {
      width: '100%',
      aspectRatio: '2/3',
      objectFit: 'cover' as const,
      borderRadius: '4px',
    },
    ratingWrapper: {
      display: 'flex' as const,
      alignItems: 'center' as const,
      marginTop: '8px',
      fontSize: '14px',
    },
    starIcon: {
      color: '#f5c518',
      marginRight: '4px',
    },
    watchOptions: {
      width: '100%',
      backgroundColor: 'rgba(255,255,255,0.08)',
      color: 'rgb(87, 153, 239)',
      border: 'none',
      padding: '6px 0',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: 600,
      marginTop: '8px',
      textAlign: 'center' as const,
    },
    trailerButton: {
      display: 'flex' as const,
      alignItems: 'center' as const,
      padding: '6px 0',
      color: 'white',
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '14px',
      cursor: 'pointer',
      width: '45%',
    },
    infoButton: {
      display: 'flex' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      color: 'white',
      backgroundColor: 'transparent',
      border: 'none',
      width: '40px',
      height: '40px',
      padding: 0,
      borderRadius: '50%',
    },
    addButton: {
      position: 'absolute' as const,
      top: '8px',
      right: '8px',
      backgroundColor: 'rgba(0,0,0,0.6)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      display: 'flex' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      zIndex: 2,
    },
    buttonsRow: {
      display: 'flex' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginTop: '4px',
    },
  };
  
  // Use favorites functionality
  const { addToFavorites, isFavorite } = useFavorites();
  
  return (
    <Box style={styles.pageWrapper}>
      {/* Add SEO metadata */}
      <DocumentHead title="IMDb Movie Database" description="Discover movies, TV shows, celebrities and more" />
      
      {/* Movie Filters Section with Sidebar */}
      <Box maw={1400} mx="auto" style={{ backgroundColor: '#121212' }}>
        <MovieFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />
      </Box>
      
      {/* Top Picks Section */}
      <Box px="sm" py="md" maw={1400} mx="auto" mt="md">
        {/* Mobile-friendly spacing */}
        <Box style={styles.sectionHeader}>
          <Box style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
            <Box style={{display: 'flex', alignItems: 'center'}}>
              <Text style={styles.sectionTitle}>Top picks</Text>
              <IconChevronRight size={24} style={{ color: '#f5c518' }} />
            </Box>
            <Box style={{display: 'flex', gap: '8px'}}>
              <ActionIcon 
                variant="subtle" 
                color="gray" 
                radius="xl"
                onClick={() => scroll(topPicksRef, 'left')}
              >
                <IconChevronRight size={24} style={{ transform: 'rotate(180deg)' }} />
              </ActionIcon>
              <ActionIcon 
                variant="subtle" 
                color="gray" 
                radius="xl"
                onClick={() => scroll(topPicksRef, 'right')}
              >
                <IconChevronRight size={24} />
              </ActionIcon>
            </Box>
          </Box>
        </Box>
        
        <Box style={{ position: 'relative' }}>
          {/* Horizontal scrollable movie list */}
          <Box style={styles.movieScroller} ref={topPicksRef}>
            {movies.slice(0, 10).map((movie, index) => (
              <Box key={movie.id} style={styles.movieCard} ref={index === movies.length - 1 ? lastElementRef : null}>
                <Box style={{ position: 'relative' }}>
                  <ActionIcon 
                    style={styles.addButton}
                    onClick={() => addToFavorites(movie)}
                  >
                    <IconBookmark size={16} color={isFavorite(movie.id) ? "#f5c518" : "white"} />
                  </ActionIcon>
                  
                  <Link to={`/movie/${movie.id}`}>
                    <Image 
                      src={movie.poster_path || `https://picsum.photos/200/300?random=${index}`}
                      alt={movie.title}
                      style={styles.movieImage}
                      fallbackSrc="https://via.placeholder.com/300x450?text=No+Poster"
                    />
                  </Link>
                </Box>
                
                <Box>
                  <Box style={styles.ratingWrapper}>
                    <IconStar style={styles.starIcon} size={14} />
                    <Text fw={600} size="sm" color="white">{movie.vote_average?.toFixed(1) || '7.0'}</Text>
                  </Box>
                  
                  <Text fw={600} size="sm" mt={4} lineClamp={1} style={{ color: 'white' }}>
                    <Link to={`/movie/${movie.id}`} style={{ color: 'white', textDecoration: 'none' }}>
                      {movie.title}
                    </Link>
                  </Text>
                  
                  <Button style={styles.watchOptions}>
                    Watch options
                  </Button>
                  
                  <Box style={styles.buttonsRow}>
                    <Button 
                      style={styles.trailerButton}
                      leftSection={<IconPlayerPlay size={16} />}
                    >
                      Trailer
                    </Button>
                    
                    <ActionIcon style={styles.infoButton}>
                      <IconInfoCircle size={18} />
                    </ActionIcon>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      
      {/* From Your Watchlist Section */}
      <Box px="sm" py="md" maw={1400} mx="auto" mt="md">
        {/* Mobile-friendly spacing */}
        <Box style={styles.sectionHeader}>
          <Box style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
            <Box style={{display: 'flex', alignItems: 'center'}}>
              <Text style={styles.sectionTitle}>From your watchlist</Text>
              <IconChevronRight size={24} style={{ color: '#f5c518' }} />
            </Box>
            <Box style={{display: 'flex', gap: '8px'}}>
              <ActionIcon 
                variant="subtle" 
                color="gray" 
                radius="xl"
                onClick={() => scroll(watchlistRef, 'left')}
              >
                <IconChevronRight size={24} style={{ transform: 'rotate(180deg)' }} />
              </ActionIcon>
              <ActionIcon 
                variant="subtle" 
                color="gray" 
                radius="xl"
                onClick={() => scroll(watchlistRef, 'right')}
              >
                <IconChevronRight size={24} />
              </ActionIcon>
            </Box>
          </Box>
        </Box>
        
        <Box style={{ position: 'relative' }}>
          {/* Horizontal scrollable watchlist movies */}
          <Box style={styles.movieScroller} ref={watchlistRef}>
            {movies.slice(3, 12).map((movie, index) => (
              <Box key={`watchlist-${movie.id}`} style={styles.movieCard}>
                <Box style={{ position: 'relative' }}>
                  <ActionIcon 
                    style={styles.addButton}
                    onClick={() => addToFavorites(movie)}
                  >
                    <IconBookmark size={16} color={isFavorite(movie.id) ? "#f5c518" : "white"} />
                  </ActionIcon>
                  
                  <Link to={`/movie/${movie.id}`}>
                    <Image 
                      src={movie.poster_path || `https://picsum.photos/200/300?random=${index + 10}`}
                      alt={movie.title}
                      style={styles.movieImage}
                      fallbackSrc="https://via.placeholder.com/300x450?text=No+Poster"
                    />
                  </Link>
                </Box>
                
                <Box>
                  <Box style={styles.ratingWrapper}>
                    <IconStar style={styles.starIcon} size={14} />
                    <Text fw={600} size="sm" color="white">
                      {Math.round((Math.random() * 2 + 6) * 10) / 10}
                    </Text>
                  </Box>
                  
                  <Text fw={600} size="sm" mt={4} lineClamp={1} style={{ color: 'white' }}>
                    <Link to={`/movie/${movie.id}`} style={{ color: 'white', textDecoration: 'none' }}>
                      {movie.title}
                    </Link>
                  </Text>
                  
                  <Button style={styles.watchOptions}>
                    Watch options
                  </Button>
                  
                  <Box style={styles.buttonsRow}>
                    <Button 
                      style={styles.trailerButton}
                      leftSection={<IconPlayerPlay size={16} />}
                    >
                      Trailer
                    </Button>
                    
                    <ActionIcon style={styles.infoButton}>
                      <IconInfoCircle size={18} />
                    </ActionIcon>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

        {isFetchingNextPage && (
          <Center my="xl">
            <Loader size="md" />
          </Center>
        )}
    </Box>
  );
};

export default HomePage;
