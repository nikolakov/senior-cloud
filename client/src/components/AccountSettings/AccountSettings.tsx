import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import i18n from 'i18n';
import useAuth from 'hooks/useAuth';
import TextInput from 'components/shared/Form/TextInput';
import handleError from 'utils/handleError';
// import ManagerSection from './ManagerSection';
// import ManagedBySection from './ManagedBySection';

const getValidationSchema = () =>
  Yup.object().shape({
    username: Yup.string().required(i18n.t('private:accountSettings.usernameRequiredErrorText')),
    email: Yup.string().email().required(i18n.t('private:accountSettings.emailRequiredErrorText')),
  });

const AccountSettings: React.FC = () => {
  const { profileInfo, updateProfileInfo } = useAuth();

  const { t } = useTranslation('private');
  const { t: tc } = useTranslation('common');

  return (
    <div style={{ margin: 'auto', maxWidth: '768px' }}>
      <h1>{t('accountSettings.accountSettingsTitle')}</h1>
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
            {t('accountSettings.profileIdLabel')} {profileInfo.id}
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
            const message = handleError(e);
            if (message === 'username_exists') {
              setErrors({ username: tc(message) });
            } else {
              setErrors({ email: tc(message) });
            }
            setSubmitting(false);
          }
        }}
        validationSchema={getValidationSchema()}
      >
        {({ isSubmitting }) => (
          <Form>
            <Row className="gy-3 mb-3">
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
                  {tc('save')}
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
      {/* <ManagedBySection />
      <ManagerSection /> */}
    </div>
  );
};

export default AccountSettings;
