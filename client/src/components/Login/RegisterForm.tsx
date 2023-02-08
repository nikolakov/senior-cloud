import { useRef } from 'react';
import { Formik, Form } from 'formik';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import * as Yup from 'yup';
import Reaptcha from 'reaptcha';
import { useTranslation } from 'react-i18next';

import i18nHelper from 'i18n';
import TextInput from 'components/shared/Form/TextInput';
import PasswordInput from 'components/shared/Form/PasswordInput';
import handleError from 'utils/handleError';
import useAuth from 'hooks/useAuth';

const i18n = i18nHelper.i18n;

const getValidationSchema = () =>
  Yup.object().shape({
    username: Yup.string().required(i18n.t('public:register.usernameRequiredErrorText')),
    email: Yup.string().email().required(i18n.t('public:register.emailRequiredErrorText')),
    password: Yup.string().required(i18n.t('public:register.passwordRequiredErrorText')),
    passwordConfirmation: Yup.string().test(
      'passwords-match',
      i18n.t('public:register.passwordConfirmationErrorText'),
      function (value) {
        return this.parent.password === value;
      }
    ),
  });

(window as any).recaptchaOptions = {
  removeOnMount: false,
};

type Props = {};

const RegisterForm: React.FC<Props> = () => {
  const { register } = useAuth();
  const { t } = useTranslation('public');
  const { t: tc } = useTranslation('common');

  const captchaRef = useRef<Reaptcha>(null);
  const tokenRef = useRef<string>('');

  return (
    <Formik
      initialValues={{ username: '', email: '', password: '', passwordConfirmation: '' }}
      validationSchema={getValidationSchema()}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          const token = tokenRef.current;

          if (!token) {
            throw new Error('recaptcha_failed');
          }

          await register(values.username, values.email, values.password, token);
        } catch (e: any) {
          const errorMessage = handleError(e);

          if (errorMessage === 'username_exists') {
            setErrors({ username: tc(errorMessage) });
          } else if (errorMessage === 'email_exists') {
            setErrors({ email: tc(errorMessage) });
          } else {
            setErrors({ password: tc(errorMessage) });
          }
          setSubmitting(false);
          captchaRef.current?.reset();
        }
      }}
    >
      {({ isSubmitting, setSubmitting, submitForm }) => (
        <Form>
          <Row className="gy-3 mb-3">
            <TextInput
              xs={12}
              label={t('register.usernameFieldLabel')}
              type="text"
              name="username"
              autoComplete="username"
              required
            />
            <TextInput
              xs={12}
              label={t('register.emailFieldLabel')}
              type="text"
              name="email"
              autoComplete="email"
              required
            />
            <PasswordInput
              xs={12}
              label={t('register.passwordFieldLabel')}
              type="password"
              name="password"
              autoComplete="new-password"
              required
            />
            <PasswordInput
              xs={12}
              label={t('register.passwordConfirmationFieldLabel')}
              type="password"
              name="passwordConfirmation"
              autoComplete="new-password"
              required
            />
          </Row>
          <Reaptcha
            sitekey={process.env.REACT_APP_RECAPTCHA_KEY as string}
            ref={captchaRef}
            size="invisible"
            onVerify={token => {
              tokenRef.current = token;
              submitForm();
            }}
          />
          <Row className="justify-content-between align-items-center">
            <Col xs="auto">
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="primary"
                onClick={() => {
                  captchaRef.current?.execute();
                  setSubmitting(true);
                }}
              >
                {t('register.registerButtonText')}
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
