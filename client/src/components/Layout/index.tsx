import Container from 'react-bootstrap/Container';
import { Outlet } from 'react-router-dom';

import Navbar from './Navbar';

const Layout: React.FC = () => {
  return (
    <>
      <Navbar />
      <Container>
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
