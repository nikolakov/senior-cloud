import { useState } from 'react';
import Form from 'react-bootstrap/Form';

import useAuth from 'hooks/useAuth';
import { Role } from 'types';
import handleError from 'utils/handleError';

const ManagerSection: React.FC = () => {
  const { profileInfo, updateProfileInfo } = useAuth();

  const [isManager, setIsManager] = useState(profileInfo.role === Role.Manager);
  const [isDisabled, setIsDisabled] = useState(false);

  const isManagerToggleHandler = async () => {
    const newIsManager = !isManager;
    setIsManager(newIsManager);
    setIsDisabled(true);

    const newRole = newIsManager ? Role.Manager : Role.User;
    await updateRole(newRole, () => setIsManager(prev => !prev));

    setIsDisabled(false);
  };

  const updateRole = async (role: Role, onError: (e: any) => any) => {
    try {
      await updateProfileInfo({ role });
    } catch (e) {
      handleError(e);
      onError(e);
    }
  };

  return (
    <>
      <div
        style={{
          marginTop: '2rem',
          marginBottom: '1rem',
          borderBottom: '1px solid var(--bs-body-color)',
        }}
      >
        <h2>Manager Section</h2>
      </div>
      <p>
        Becoming a manager will unlock and add to the UI new functionalities, most important of
        which - the ability to manage other accounts. This is to offload the complexity of managing
        a Personal Cloud Storage account from technically illiterate people (most commonly seniors).
      </p>
      <p>
        Enable this feature only if you know what you're doing and you know someone, whose account
        you want to manage.
      </p>
      <Form.Check
        type="switch"
        id="toggle-management"
        label="Activate management"
        checked={isManager}
        disabled={isDisabled}
        onChange={isManagerToggleHandler}
      />
    </>
  );
};

export default ManagerSection;
