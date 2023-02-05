import { useState, useRef, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';

import UploadingModal from './UploadingModal';
import handleError from 'utils/handleError';
import FilesService from 'services/FilesService';

import classes from './styles.module.css';

type Props = {
  onFileUpload: () => void;
};

const UploadInput: React.FC<Props> = ({ onFileUpload }) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [progress, setProgress] = useState<number>();
  const [uploadError, setUploadError] = useState('');
  const [filesUploaded, setFilesUploaded] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { t } = useTranslation('private');
  const { t: tc } = useTranslation('common');

  useEffect(() => {
    if (fileInputRef.current) {
      (window as any).customFileInput = fileInputRef.current;
    }
  }, []);

  const filesChangedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
    console.log(e.target.files);
  };

  const hasFiles = !!(files && files.length > 0);

  const uploadHandler = async () => {
    if (files) {
      try {
        setProgress(1);
        let count = 0;

        for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
          const file = files[fileIndex];
          // eslint-disable-next-line no-loop-func
          await FilesService.uploadFile(file, fileProgress => {
            setProgress(Math.ceil(1 + ((count + fileProgress) / files.length) * 100));
            setFilesUploaded(count);
          });

          onFileUpload();
          count += 1;
        }

        setProgress(101);
      } catch (e: any) {
        setUploadError(handleError(e));

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
            <h4 className={classes.FileMessage}>{t('dashboard.fileInputDragDropText')}</h4>
            <p>{tc('or')}</p>
            <Button>{t('dashboard.fileInputButtonText')}</Button>

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
        onClose={() => setFiles(null)}
        onExited={clearStateHandler}
        files={files}
        onSubmit={uploadHandler}
        progress={progress}
        filesUploaded={filesUploaded}
        error={uploadError}
      />
    </>
  );
};

export default UploadInput;
