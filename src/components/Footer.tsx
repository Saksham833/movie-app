import { Container, Text, Group } from '@mantine/core';
import { IconBrandGithub, IconMovie } from '@tabler/icons-react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-700">
      <Container size="xl" py="md">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Text size="sm" c="dimmed">
            © {new Date().getFullYear()} MovieDB. All rights reserved.
          </Text>
          
          <Group mt={{ base: 'md', md: 0 }}>
            <Text size="xs" c="dimmed">
              Powered by
            </Text>
            <a 
              href="https://www.themoviedb.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400 transition-colors"
            >
              <IconMovie size={24} />
            </a>
            
            <a 
              href="https://github.com/yourusername/moviedb" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <IconBrandGithub size={20} />
            </a>
          </Group>
        </div>
        
        <Text size="xs" c="dimmed" mt="md" className="text-center">
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </Text>
      </Container>
    </footer>
  );
};

export default Footer;
