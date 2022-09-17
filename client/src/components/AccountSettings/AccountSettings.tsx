import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import useAuth from 'hooks/useAuth';
import TextInput from 'components/shared/Form/TextInput';
import { isAxiosError } from 'types';

const validationSchema = Yup.object().shape({
  username: Yup.string().required(),
  email: Yup.string().email().required(),
});

const AccountSettings: React.FC = () => {
  const { profileInfo, updateProfileInfo } = useAuth();

  return (
    <div style={{ margin: 'auto', maxWidth: '768px' }}>
      <h1>Account Settings</h1>
      <Row className="justify-content-center">
        <Col
          xs="auto"
          style={{
            display: 'flex',
            flexFlow: 'column',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <i className="bi bi-person-circle" style={{ fontSize: '8rem' }}></i>
          {profileInfo.firstName || profileInfo.lastName ? (
            <h4>
              {profileInfo.firstName} {profileInfo.lastName}
            </h4>
          ) : null}
          <h5
            style={{
              width: '100%',
              textOverflow: 'ellipsis',
              textAlign: 'center',
            }}
          >
            profile ID: {profileInfo._id}
          </h5>
        </Col>
      </Row>
      <Formik
        initialValues={{
          firstName: profileInfo.firstName,
          lastName: profileInfo.lastName,
          username: profileInfo.username,
          email: profileInfo.email,
        }}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            await updateProfileInfo(values);
            setSubmitting(false);
          } catch (e: any) {
            console.log(e);
            if (isAxiosError(e) && e.response?.data.error === 'username_taken') {
              setErrors({ username: e.response.data.error });
            } else if (isAxiosError(e) && e.response?.data.error === 'email_in_use') {
              setErrors({ email: e.response.data.error });
            } else {
              setErrors({ email: e.message });
            }
            setSubmitting(false);
          }
        }}
        validationSchema={validationSchema}
      >
        {({ isSubmitting }) => (
          <Form>
            <Row>
              <TextInput
                xs={12}
                sm={6}
                label="First Name"
                type="text"
                name="firstName"
                autoComplete="given-name"
              />
              <TextInput
                xs={12}
                sm={6}
                label="Last Name"
                type="text"
                name="lastName"
                autoComplete="family-name"
              />
              <TextInput
                xs={12}
                label="username"
                type="text"
                name="username"
                autoComplete="username"
              />
              <TextInput xs={12} label="email" type="text" name="email" autoComplete="email" />
            </Row>
            <Row className="justify-content-between align-items-center">
              <Col xs="auto">
                <Button type="submit" disabled={isSubmitting} variant="primary">
                  Save
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AccountSettings;
