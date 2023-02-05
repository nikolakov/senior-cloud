import { Formik, Form } from 'formik';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import i18n from 'i18n';
import TextInput from 'components/shared/Form/TextInput';
import PasswordInput from 'components/shared/Form/PasswordInput';
import handleError from 'utils/handleError';
import useAuth from 'hooks/useAuth';

const getValidationSchema = () =>
  Yup.object().shape({
    username: Yup.string().required(i18n.t('public:login.usernameRequiredErrorText')),
    password: Yup.string().required(i18n.t('public:login.passwordRequiredErrorText')),
  });

type Props = {
  callback?: () => void;
};

const LoginForm: React.FC<Props> = ({ callback }) => {
  const { login } = useAuth();
  const { t } = useTranslation('public');
  const { t: tc } = useTranslation('common');

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={getValidationSchema()}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          await login(values.username, values.password);
          setSubmitting(false);
          callback && callback();
        } catch (e: any) {
          console.log(e);
          const errorMessage = handleError(e);

          if (errorMessage === 'user_not_found') {
            setErrors({ username: tc(errorMessage) });
          } else {
            setErrors({ password: tc(errorMessage) });
          }
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Row className="gy-3 mb-3">
            <TextInput
              xs={12}
              label={t('login.usernameFieldLabel')}
              type="text"
              name="username"
              autoComplete="username"
            />
            <PasswordInput
              xs={12}
              label={t('login.passwordFieldLabel')}
              type="password"
              name="password"
              autoComplete="current-password"
            />
          </Row>
          <Row className="justify-content-between align-items-center">
            <Col xs="auto">
              <Button type="submit" disabled={isSubmitting} variant="primary">
                {t('login.loginButtonText')}
              </Button>
            </Col>
            <Col xs="auto">
              <Link to="#">{t('login.forgotPasswordLinkText')}</Link>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
