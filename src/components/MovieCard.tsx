import { Link } from 'react-router-dom';
import { Card, Image, Text, Badge, Group, Button, rem } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { IconCalendar, IconStarFilled } from '@tabler/icons-react';
import type { Movie } from '../types/omdb.types';

// Define styles for movie title link
const movieTitleLinkStyle = {
  color: 'inherit',
  textDecoration: 'none'
};

interface MovieCardProps {
  movie: Movie;
  onRemoveFavorite?: (movieId: number) => void;
  showRemoveButton?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  onRemoveFavorite, 
  showRemoveButton = false 
}) => {
  const { hovered, ref } = useHover();
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : (movie.year || 'N/A');
  const posterUrl = movie.poster_path
    ? movie.poster_path
    : 'https://via.placeholder.com/500x750?text=No+Poster';

    

  return (
    <Card
      ref={ref}
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? 'var(--mantine-shadow-md)' : 'none',
      }}
    >
      <Card.Section>
        {showRemoveButton && onRemoveFavorite && (
          <Button
            variant="light"
            color="red"
            size="xs"
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 1,
              opacity: hovered ? 1 : 0.8,
              transition: 'opacity 0.2s',
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemoveFavorite(movie.id);
            }}
          >
            Remove
          </Button>
        )}
        <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', display: 'block' }}>
          <Image
            src={posterUrl}
            h={300}
            alt={movie.title}
            style={{
              objectFit: 'cover',
              width: '100%',
              aspectRatio: '2/3',
            }}
          />
        </Link>
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={600} lineClamp={2} style={{ minHeight: rem(56) }}>
          <Link 
            to={`/movie/${movie.id}`} 
            style={movieTitleLinkStyle}
            onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            {movie.title}
          </Link>
        </Text>
      </Group>

      <Group gap={8} mb="xs">
        <Group gap={4}>
          <IconStarFilled size={16} style={{ color: 'var(--mantine-color-yellow-5)' }} />
          <Text size="sm">
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </Text>
        </Group>
        
        <Text size="sm" c="dimmed">•</Text>
        
        <Group gap={4}>
          <IconCalendar size={16} />
          <Text size="sm">{releaseYear}</Text>
        </Group>
      </Group>

      <div style={{ marginTop: 'auto' }}>
        <Group gap={4} style={{ flexWrap: 'wrap' }}>
          {movie.imdbID && (
            <Badge variant="light" color="blue">
              ID: {movie.imdbID}
            </Badge>
          )}
          {!movie.imdbID && (
            <Badge variant="light" color="gray">
              No ID
            </Badge>
          )}
        </Group>
      </div>
    </Card>
  );
};

export default MovieCard;
