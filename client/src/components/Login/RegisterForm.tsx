import { useContext } from 'react';
import { Formik, Form } from 'formik';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import * as Yup from 'yup';

import { AuthContext } from 'contexts/auth-context';
import TextInput from 'components/shared/Form/TextInput';
import PasswordInput from 'components/shared/Form/PasswordInput';
import { isAxiosError } from 'types';

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
  const { register } = useContext(AuthContext);

  return (
    <Formik
      initialValues={{ username: '', email: '', password: '', passwordConfirmation: '' }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          await register(values.username, values.email, values.password);
          setSubmitting(false);
          callback && callback();
        } catch (e: any) {
          console.log(e);
          if (isAxiosError(e) && e.response?.data.error === 'incorrect_password') {
            setErrors({ password: e.response.data.error });
          } else if (isAxiosError(e) && e.response?.data.error === 'user_not_found') {
            setErrors({ username: e.response.data.error });
          } else {
            setErrors({ password: e.message });
          }
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Row>
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
