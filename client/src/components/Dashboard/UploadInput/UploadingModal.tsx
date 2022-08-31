import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';

type Props = {
  show: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onExited: () => void;
  files: FileList | null;
  progress?: number;
  filesUploaded: number;
  error?: any;
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
        <Modal.Title>Uploading files</Modal.Title>
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
            <h4>The following file(s) will be uploaded:</h4>
            {fileNames.map(name => (
              <p key={name}>{name}</p>
            ))}
          </>
        ) : progress <= 100 ? (
          <>
            <h4>
              Uploading {filesUploaded + 1} of {fileNames.length}...
            </h4>
            <ProgressBar style={{ width: '100%' }} animated now={progress} label={`${progress}%`} />
          </>
        ) : error ? (
          <>
            <h4>Could not upload files</h4>
            <p className="text-danger">{error}</p>
          </>
        ) : (
          <>
            <i className="bi bi-check2-circle text-success" style={{ fontSize: '3rem' }} />
            <h4>Upload complete</h4>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {!progress ? (
          <>
            <Button variant="outline-danger" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="success" onClick={onSubmit}>
              Upload
            </Button>
          </>
        ) : progress <= 100 ? null : (
          <Button onClick={onClose}>Close</Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default UploadingModal;
