import { useEffect } from 'react';
import { useLocation, useNavigate, Location } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useTranslation } from 'react-i18next';

import useAuth from 'hooks/useAuth';
import RegisterForm from './RegisterForm';
import Card from './Card';

const RegisterPage: React.FC = () => {
  const location = useLocation();
  const from = (location.state as { from?: Location } | undefined)?.from?.pathname || '/';

  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const { t } = useTranslation('public');

  useEffect(() => {
    if (isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, from, navigate]);

  return (
    <Row className="justify-content-center" style={{ marginTop: '2rem' }}>
      <Col xs={12} sm={10} md={8} lg={6}>
        <Card
          title={t('register.registerFormTitle')}
          buttonText={t('register.signInLinkButtonText')}
          buttonHref="/login"
        >
          <RegisterForm />
        </Card>
      </Col>
    </Row>
  );
};

export default RegisterPage;
