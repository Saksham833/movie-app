import { Container, Title, Text, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft } from '@tabler/icons-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container size="md" style={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', width: '100%' }}>
        <Title 
          style={{
            fontSize: '8rem',
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: '1rem',
            color: 'var(--mantine-color-blue-6)',
            opacity: 0.7,
          }}
        >
          404
        </Title>
        <Title order={2} style={{ marginBottom: '1rem' }}>
          Oops! Page not found
        </Title>
        <Text color="dimmed" size="lg" style={{ marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Text>
        <Button 
          leftSection={<IconArrowLeft size={16} />} 
          onClick={() => navigate('/')}
          size="md"
        >
          Go back home
        </Button>
      </div>
    </Container>
  );
};

export default NotFoundPage;
