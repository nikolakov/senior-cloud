import BSNavbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import i18nHelper from 'i18n';
import useAuth from 'hooks/useAuth';

const Navbar: React.FC = () => {
  const { isLoggedIn, profileInfo, logout } = useAuth();

  const { t, i18n } = useTranslation('public');
  const { t: tpriv } = useTranslation('private');

  return (
    <BSNavbar bg="dark" variant="dark" expand="md">
      <Container fluid>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <BSNavbar.Brand>Senior Cloud</BSNavbar.Brand>
        </Link>
        <Nav>
          <NavDropdown
            title={
              <>
                <i className="bi bi-translate" /> <span>{i18nHelper.getActualLanguage().name}</span>
              </>
            }
            id="language-dropdown"
            style={{ textTransform: 'none' }}
            align="end"
          >
            {i18nHelper.supportedLanguages.map(lang => (
              <NavDropdown.Item
                as="button"
                onClick={() => i18n.changeLanguage(lang.code)}
                key={lang.code}
              >
                {lang.name}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
        </Nav>
        <BSNavbar.Toggle aria-controls="responsive-navbar-nav" />
        <BSNavbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {isLoggedIn ? (
              <NavLink to="/" style={{ textDecoration: 'none' }}>
                {({ isActive }) => (
                  <span className={`nav-link${isActive ? ' active' : ''}`}>
                    {tpriv('header.homeLinkText')}
                  </span>
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
                    marginTop: '-0.5rem',
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
                    {tpriv('header.accountSettingsLinkText')}
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as="button"
                    style={{ display: 'flex', justifyContent: 'space-between', color: 'red' }}
                    onClick={logout}
                  >
                    {tpriv('header.logoutLinkText')} <i className="bi bi-box-arrow-right" />
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <Link to="/login">
                <Button>{t('header.signInButtonText')}</Button>
              </Link>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
