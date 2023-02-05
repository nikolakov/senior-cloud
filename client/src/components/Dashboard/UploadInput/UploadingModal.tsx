import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useTranslation } from 'react-i18next';

type Props = {
  show: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onExited: () => void;
  files: FileList | null;
  progress?: number;
  filesUploaded: number;
  error?: string;
};

const UploadingModal: React.FC<Props> = ({
  show,
  onClose,
  onSubmit,
  onExited,
  files,
  progress,
  filesUploaded,
  error,
}) => {
  const { t } = useTranslation('private');
  const { t: tc } = useTranslation('common');

  let fileNames: string[] = [];

  if (files) {
    for (let i = 0; i < files.length; i++) {
      fileNames[i] = files[i].name;
    }
  }

  const uploading = progress !== undefined && progress <= 100;

  return (
    <Modal
      show={show}
      centered
      backdrop={uploading ? 'static' : undefined}
      keyboard={uploading ? false : undefined}
      onExited={onExited}
    >
      <Modal.Header>
        <Modal.Title>{t('dashboard.uploadFilesModalTitle')}</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          minHeight: '10rem',
          display: 'flex',
          flexFlow: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {progress === undefined ? (
          <>
            <h4>{t('dashboard.uploadFilesListTitle')}</h4>
            {fileNames.map(name => (
              <p key={name}>{name}</p>
            ))}
          </>
        ) : progress <= 100 ? (
          <>
            <h4>
              {t('dashboard.uploadFilesProgressText', {
                fileNumber: filesUploaded + 1,
                filesCount: fileNames.length,
              })}
            </h4>
            <ProgressBar style={{ width: '100%' }} animated now={progress} label={`${progress}%`} />
          </>
        ) : error ? (
          <>
            <h4>{t('dashboard.uploadFilesErrorTitle')}</h4>
            <p className="text-danger">{tc(error)}</p>
          </>
        ) : (
          <>
            <i className="bi bi-check2-circle text-success" style={{ fontSize: '3rem' }} />
            <h4>{t('dashboard.uploadFilesSuccessTitle')}</h4>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {!progress ? (
          <>
            <Button variant="outline-danger" onClick={onClose}>
              {tc('cancel')}
            </Button>
            <Button variant="success" onClick={onSubmit}>
              {tc('upload')}
            </Button>
          </>
        ) : progress <= 100 ? null : (
          <Button onClick={onClose}>{tc('close')}</Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default UploadingModal;
