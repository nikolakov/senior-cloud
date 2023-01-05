import { useRef } from 'react';
import { Formik, Form } from 'formik';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import * as Yup from 'yup';
import ReCAPTCHA from 'react-google-recaptcha';

import TextInput from 'components/shared/Form/TextInput';
import PasswordInput from 'components/shared/Form/PasswordInput';
import handleError from 'utils/handleError';
import useAuth from 'hooks/useAuth';

const validationSchema = Yup.object().shape({
  username: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  passwordConfirmation: Yup.string().test(
    'passwords-match',
    'Passwords must match',
    function (value) {
      return this.parent.password === value;
    }
  ),
});

type Props = {
  callback?: () => void;
};

const RegisterForm: React.FC<Props> = ({ callback }) => {
  const { register } = useAuth();

  const captchaRef = useRef<ReCAPTCHA>(null);

  return (
    <Formik
      initialValues={{ username: '', email: '', password: '', passwordConfirmation: '' }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        let captchaToken = '';

        try {
          try {
            if (captchaRef.current) {
              captchaToken = (await captchaRef.current.executeAsync()) || '';
            }

            if (!captchaToken) {
              throw new Error();
            }
          } catch (e) {
            throw new Error('captcha_failed');
          }

          await register(values.username, values.email, values.password, captchaToken);
          setSubmitting(false);
          callback && callback();
        } catch (e: any) {
          console.log(e);
          const errorMessage = handleError(e);

          if (errorMessage === 'username_exists') {
            setErrors({ username: errorMessage });
          } else {
            setErrors({ password: errorMessage });
          }
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Row className="gy-3 mb-3">
            <TextInput
              xs={12}
              label="Username"
              type="text"
              name="username"
              autoComplete="username"
              required
            />
            <TextInput
              xs={12}
              label="Email"
              type="text"
              name="email"
              autoComplete="email"
              required
            />
            <PasswordInput
              xs={12}
              label="Password"
              type="password"
              name="password"
              autoComplete="new-password"
              required
            />
            <PasswordInput
              xs={12}
              label="Repeat password"
              type="password"
              name="passwordConfirmation"
              autoComplete="new-password"
              required
            />
          </Row>
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_RECAPTCHA_KEY as string}
            ref={captchaRef}
            size="invisible"
          />
          <Row className="justify-content-between align-items-center">
            <Col xs="auto">
              <Button type="submit" disabled={isSubmitting} variant="primary">
                Register
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
