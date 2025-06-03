import { Link, useLocation } from 'react-router-dom';
import { Group, Text, Container, Burger, rem, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMovie } from '@tabler/icons-react';

const links = [
  { link: '/', label: 'Home' },
  { link: '/favorites', label: 'Favorites' },
];

const Header = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const location = useLocation();

  const items = links.map((link) => (
    <Button
      key={link.label}
      component={Link}
      to={link.link}
      variant={location.pathname === link.link ? 'light' : 'subtle'}
      color="blue"
      size="sm"
    >
      {link.label}
    </Button>
  ));

  return (
    <header className="border-b border-gray-700">
      <Container size="xl" h="100%">
        <div className="h-full flex items-center justify-between">
          <Group gap="sm" className="flex-1">
            <IconMovie size={28} />
            <Text fw={700} size="lg">
              MovieDB
            </Text>
          </Group>

          <Group gap={5} visibleFrom="sm">
            {items}
          </Group>

          <Burger
            opened={opened}
            onClick={toggle}
            size="sm"
            hiddenFrom="sm"
          />
        </div>
      </Container>
    </header>
  );
};

export default Header;
