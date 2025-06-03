import { Outlet } from 'react-router-dom';
import { AppShell } from '@mantine/core';

const Layout = () => {
  return (
      <AppShell
        padding={0}
      >
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
  );
};

export default Layout;
