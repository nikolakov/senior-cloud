import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Formik, Form } from 'formik';

import useAuth from 'hooks/useAuth';
import bn_wait from 'utils/bn_wait';
import TextInput from 'components/shared/Form/TextInput';
import { Role } from 'types';

const ManagedBySection: React.FC = () => {
  const { profileInfo } = useAuth();

  return (
    <>
      <div
        style={{
          marginTop: '2rem',
          marginBottom: '1rem',
          borderBottom: '1px solid var(--bs-body-color)',
        }}
      >
        <h2>Managed by</h2>
      </div>
      {profileInfo.managedBy ? (
        <ManagedViewContent />
      ) : (
        <NotManagedViewContent isManager={profileInfo.role === Role.Manager} />
      )}
    </>
  );
};

const ManagedViewContent: React.FC = () => {
  return <></>;
};

const NotManagedViewContent: React.FC<{ isManager: boolean }> = ({ isManager }) => {
  return (
    <>
      <p>
        Your account is not managed by anyone. You can request someone to become your account
        manager here:
      </p>
      <Formik
        initialValues={{ username: '' }}
        onSubmit={async (values, { setSubmitting }) => {
          await bn_wait(500);
          alert(`You requested ${values.username} to become your manager`);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Row>
              <TextInput
                xs={12}
                sm={6}
                type="text"
                name="username"
                label=""
                placeholder="Enter username"
              />
              <Col>
                <Button type="submit" disabled={isSubmitting || isManager} variant="primary">
                  Request
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ManagedBySection;
