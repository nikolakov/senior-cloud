import { useState, useRef, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import UploadingModal from './UploadingModal';

import classes from './styles.module.css';
import handleError from 'utils/handleError';
import { isAxiosError } from 'types';
import FilesService from 'services/FilesService';

type Props = {
  onSuccess: () => void;
};

const UploadInput: React.FC<Props> = ({ onSuccess }) => {
  const [filesSelected, setFilesSelected] = useState<FileList | null>(null);
  const [progress, setProgress] = useState<number>();
  const [uploadError, setUploadError] = useState('');
  const [filesUploaded, setFilesUploaded] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fileInputRef.current) {
      (window as any).customFileInput = fileInputRef.current;
    }
  }, []);

  const filesChangedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilesSelected(e.target.files);
    console.log(e.target.files);
  };

  const hasFiles = !!(filesSelected && filesSelected.length > 0);

  const uploadHandler = async () => {
    if (filesSelected) {
      try {
        setProgress(1);

        await FilesService.upload(
          filesSelected,
          (progress, filesUploaded) => {
            setProgress(progress);
            setFilesUploaded(filesUploaded);
          },
          onSuccess
        );
        // onSuccess();
        setProgress(101);
      } catch (e: any) {
        handleError(e);
        if (isAxiosError(e) && e.response?.data.error) {
          setUploadError(e.response.data.error);
        } else {
          setUploadError(e.message);
        }
        setProgress(101);
      }
    }
  };

  const clearStateHandler = () => {
    setProgress(undefined);
    setFilesUploaded(0);
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      console.log(fileInputRef.current.files);
    }
  };

  return (
    <>
      <Row>
        <Col xs={12}>
          <div className={classes.FileDropArea}>
            <h4 className={classes.FileMessage}>Drag and drop files here</h4>
            <p>or</p>
            <Button>Choose files</Button>

            <input
              className={classes.FileInput}
              type="file"
              multiple
              onChange={filesChangedHandler}
              ref={fileInputRef}
            />
          </div>
        </Col>
      </Row>
      <UploadingModal
        show={hasFiles}
        onClose={() => {
          setFilesSelected(null);
        }}
        onExited={clearStateHandler}
        files={filesSelected}
        onSubmit={uploadHandler}
        progress={progress}
        filesUploaded={filesUploaded}
        error={uploadError}
      />
    </>
  );
};

export default UploadInput;
