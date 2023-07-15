import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { FileProgress } from 'services/FilesService';

type Props = {
  show: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onExited: () => void;
  files: FileList | null;
  error?: string;
  filesProgress: FileProgress[];
};

const UploadingModal: React.FC<Props> = ({
  show,
  onClose,
  onSubmit,
  onExited,
  files,
  filesProgress,
  error,
}) => {
  const { t } = useTranslation('private');
  const { t: tc } = useTranslation('common');

  const fileNames = useMemo(() => {
    if (!files) return [];

    let res: string[] = [];
    for (let i = 0; i < files.length; i++) {
      res[i] = files[i].name;
    }
    return res;
  }, [files]);

  const isNotStartedUploading = filesProgress.length === 0;
  const uploading = filesProgress.filter(p => p.uploaded < p.totalParts).length > 0;

  let progress = 0;
  filesProgress.forEach((p, i, arr) => {
    progress += (100 * (p.uploaded / p.totalParts)) / arr.length;
  });

  const filesUploaded = filesProgress.filter(p => p.uploaded === p.totalParts).length;

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
        {isNotStartedUploading ? (
          <>
            <h4>{t('dashboard.uploadFilesListTitle', { count: fileNames.length })}</h4>
            {fileNames.map(name => (
              <p key={name}>{name}</p>
            ))}
          </>
        ) : uploading ? (
          <>
            <h4>
              {t('dashboard.uploadFilesProgressText', {
                fileNumber: filesUploaded + 1,
                filesCount: fileNames.length,
              })}
            </h4>
            <ProgressBar
              style={{ width: '100%' }}
              animated
              now={progress}
              label={`${progress.toFixed(0)}%`}
            />
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
        {isNotStartedUploading ? (
          <>
            <Button variant="outline-danger" onClick={onClose}>
              {tc('cancel')}
            </Button>
            <Button variant="success" onClick={onSubmit}>
              {tc('upload')}
            </Button>
          </>
        ) : uploading ? null : (
          <Button onClick={onClose}>{tc('close')}</Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default UploadingModal;
