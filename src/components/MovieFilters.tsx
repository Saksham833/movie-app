import { useState, useEffect, useRef } from 'react';
import { 
  TextInput, 
  Box,
  Stack, 
  Text, 
  Flex,
  ActionIcon,
  
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import {  IconX } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';

type MovieFiltersProps = {
  filters: {
    query: string;
    year: string;
    genre: string;
    type: string;
    ratingMin: string;
    ratingMax: string;
  };
  onFilterChange: (filters: Partial<MovieFiltersProps['filters']>) => void;
};

type Genre = {
  id: number;
  name: string;
};

export const MovieFilters = ({ filters, onFilterChange }: MovieFiltersProps) => {
  // Use useRef to track if this is the first render
  const isFirstRender = useRef(true);
  
  const [search, setSearch] = useState(filters.query || '');
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [activeGenre, setActiveGenre] = useState(filters.genre || '');
  
  // Sync local state with props when props change
  useEffect(() => {
    if (filters.query !== search && filters.query !== debouncedSearch) {
      setSearch(filters.query || '');
    }
  }, [filters.query]);
  
  useEffect(() => {
    if (filters.genre !== activeGenre) {
      setActiveGenre(filters.genre || '');
    }
  }, [filters.genre]);

  // Fetch genres
  const { data: genres } = useQuery<Genre[]>({
    queryKey: ['genres'],
    queryFn: async () => {
      try {
        // Hardcoded genres since we're using OMDb which doesn't have a genres endpoint
        return [
          { id: 1, name: 'All' },
          { id: 2, name: 'Action' },
          { id: 3, name: 'Comedy' },
          { id: 4, name: 'Thriller' },
          { id: 5, name: 'Horror' },
          { id: 6, name: 'Drama' },
          { id: 7, name: 'Fantasy' },
          { id: 8, name: 'Animation' },
          { id: 9, name: 'Sci-Fi' },
          { id: 10, name: 'Romance' },
        ];
      } catch (error) {
        console.error('Error fetching genres:', error);
        return [];
      }
    },
  });

  // Update search query when debounced value changes
  useEffect(() => {
    // Skip the first render to prevent initial update
    if (isFirstRender.current) {
      return;
    }
    
    if (debouncedSearch !== filters.query) {
      onFilterChange({ query: debouncedSearch });
    }
  }, [debouncedSearch, filters.query, onFilterChange]);

  // Update genre filter when active genre changes
  useEffect(() => {
    // Skip the first render to prevent initial update
    if (isFirstRender.current) {
      return;
    }
    
    if (activeGenre !== filters.genre) {
      onFilterChange({ genre: activeGenre });
    }
  }, [activeGenre, filters.genre, onFilterChange]);
  
  // Mark first render as complete
  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  const handleGenreClick = (genre: string) => {
    if (genre === 'All') {
      setActiveGenre('');
    } else {
      setActiveGenre(genre);
    }
  };

  // This function is used in the TextInput rightSection
  const handleClearSearch = () => {
    setSearch('');
    onFilterChange({ query: '' });
  };

  const handleYearChange = (value: string | null) => {
    onFilterChange({ year: value || '' });
  };

  const handleTypeChange = (value: string | null) => {
    onFilterChange({ type: (value as "movie" | "series") || 'movie' });
  };

  const handleRatingMinChange = (value: string | number) => {
    onFilterChange({ 
      ratingMin: value !== '' && value !== undefined ? value.toString() : '' 
    });
  };

  const handleRatingMaxChange = (value: string | number) => {
    onFilterChange({ 
      ratingMax: value !== '' && value !== undefined ? value.toString() : '' 
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      query: '',
      year: '',
      genre: '',
      type: 'movie',
      ratingMin: '',
      ratingMax: '',
    });
    setSearch('');
    setActiveGenre('');
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

  return (
    <Flex style={{  color: 'white', height: '100%' }}>
      {/* Left sidebar with Filters title and genres */}
      <Box w={200} style={{ borderRight: '1px solid #333',display: 'flex' }}>
        <Text fw={600} size="xl" p="md" style={{ borderBottom: '1px solid #333' }}>Filters</Text>
        <Stack gap={0}
        style={{ flex: 1, 
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          width: '100%',
          overflowY: 'auto',
          padding: '10px',
          gap: '38px',
        }}
        >
          {genres?.map((genre) => (
            <Box 
              key={genre.id} 
              p="md"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                cursor: 'pointer',
                borderLeft: genre.name === (activeGenre || 'All') ? '3px solid #E50914' : '3px solid transparent',
                transition: 'all 0.2s ease',
                color: genre.name === (activeGenre || 'All') ? '#fff' : '#aaa',
                fontWeight: genre.name === (activeGenre || 'All') ? 600 : 400,
              }}
              onClick={() => handleGenreClick(genre.name)}
            >
              {genre.name}
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Right content area with search and movie results */}
      <Box style={{ flex: 1 }}>
        {/* Search header */}
        <Box style={{
        display: 'flex',
        width: '96%',
        alignItems: 'end',
        justifyContent: 'end',
        gap: '16px',
        padding: '16px',
        
        }}>
          <Text fw={600} size="lg" mb="xs">Search Movie</Text>
          <TextInput
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            rightSection={
              search ? (
                <ActionIcon onClick={handleClearSearch} variant="transparent" color="gray" style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                  <IconX size={16} />
                </ActionIcon>
             
              ) : null
            }
           
            styles={{
              input: { 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                color: 'white',
                border: 'none',
                '&:focus': {
                  border: '1px solid #f5c518',
                },
              },
            }}
          />
        </Box>
      </Box>
    </Flex>
  );
};

export default MovieFilters;
