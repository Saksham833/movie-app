import { Container, Title, Text, SimpleGrid, Center, Button } from '@mantine/core';
import { IconHeartBroken } from '@tabler/icons-react';
import { useFavorites } from '../context/FavoritesContext';
import MovieCard from '../components/MovieCard';

const FavoritesPage = () => {
  const { favorites, removeFromFavorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <Center style={{ minHeight: '50vh' }}>
        <div style={{ textAlign: 'center' }}>
          <IconHeartBroken size={48} style={{ marginBottom: 16 }} />
          <Title order={3} mb="md">No favorite movies yet</Title>
          <Text color="dimmed" mb="lg">
            You haven't added any movies to your favorites. Start exploring and add some!
          </Text>
          <Button component="a" href="/" variant="light">
            Browse Movies
          </Button>
        </div>
      </Center>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">Your Favorite Movies</Title>
      <SimpleGrid 
        cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
        spacing="lg"
      >
        {favorites.map((movie) => (
          <div key={movie.id}>
            <MovieCard 
              movie={movie} 
              onRemoveFavorite={removeFromFavorites} 
              showRemoveButton 
            />
          </div>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default FavoritesPage;
