import { useContext } from 'react';
import BSNavbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { Link, NavLink } from 'react-router-dom';

import { AuthContext } from 'contexts/auth-context';

const Navbar: React.FC = () => {
  const { isLoggedIn, profileInfo, logout } = useContext(AuthContext);

  return (
    <BSNavbar bg="dark" variant="dark" expand="md">
      <Container fluid>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <BSNavbar.Brand>Senior Cloud</BSNavbar.Brand>
        </Link>
        <BSNavbar.Toggle aria-controls="responsive-navbar-nav" />
        <BSNavbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {isLoggedIn ? (
              <NavLink to="/" style={{ textDecoration: 'none' }}>
                {({ isActive }) => (
                  <span className={`nav-link${isActive ? ' active' : ''}`}>Home</span>
                )}
              </NavLink>
            ) : null}
          </Nav>
          <Nav>
            {isLoggedIn ? (
              <>
                <NavDropdown
                  style={{
                    fontSize: '1.625rem',
                    marginTop: '-0.375rem',
                    marginBottom: '-0.375rem',
                  }}
                  title={<i className="bi bi-person-circle" />}
                  // title="text"
                  id="profile-dropdown"
                  align="end"
                >
                  <NavDropdown.ItemText>{profileInfo.username}</NavDropdown.ItemText>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/account">
                    Settings
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as="button"
                    style={{ display: 'flex', justifyContent: 'space-between', color: 'red' }}
                    onClick={logout}
                  >
                    Logout <i className="bi bi-box-arrow-right"></i>
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <Link to="/login">
                <Button>Sign in</Button>
              </Link>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
