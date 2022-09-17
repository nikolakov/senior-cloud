import Container from 'react-bootstrap/Container';
import { Outlet } from 'react-router-dom';

import Navbar from './Navbar';

const Layout: React.FC = () => {
  return (
    <>
      <Navbar />
      <Container style={{ paddingTop: '2rem' }}>
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
