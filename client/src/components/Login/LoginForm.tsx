import { useContext } from 'react';
import { Formik, Form } from 'formik';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import { AuthContext } from 'contexts/auth-context';
import TextInput from 'components/shared/Form/TextInput';
import PasswordInput from 'components/shared/Form/PasswordInput';
import handleError from 'utils/handleError';

const validationSchema = Yup.object().shape({
  username: Yup.string().required(),
  password: Yup.string().required(),
});

type Props = {
  callback?: () => void;
};

const LoginForm: React.FC<Props> = ({ callback }) => {
  const { login } = useContext(AuthContext);

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          await login(values.username, values.password);
          setSubmitting(false);
          callback && callback();
        } catch (e: any) {
          console.log(e);
          const errorMessage = handleError(e);

          if (errorMessage === 'user_not_found') {
            setErrors({ username: errorMessage });
          } else {
            setErrors({ password: errorMessage });
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
              label="Your username:"
              type="text"
              name="username"
              autoComplete="username"
            />
            <PasswordInput
              xs={12}
              label="Your password:"
              type="password"
              name="password"
              autoComplete="current-password"
            />
          </Row>
          <Row className="justify-content-between align-items-center">
            <Col xs="auto">
              <Button type="submit" disabled={isSubmitting} variant="primary">
                Login
              </Button>
            </Col>
            <Col xs="auto">
              <Link to="#">Forgot password?</Link>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
