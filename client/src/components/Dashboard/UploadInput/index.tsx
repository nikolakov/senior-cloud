import { useState, useRef, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';

import UploadingModal from './UploadingModal';
import handleError from 'utils/handleError';
import FilesService, { FileProgress } from 'services/FilesService';

import classes from './styles.module.css';

type Props = {
  onFileUpload: () => void;
  folderId: string;
};

const UploadInput: React.FC<Props> = ({ onFileUpload, folderId }) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [filesProgress, setFilesProgress] = useState<FileProgress[]>([]);
  const [uploadError, setUploadError] = useState('');

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
  };

  const hasFiles = !!(files && files.length > 0);

  const uploadHandler = async () => {
    if (hasFiles) {
      try {
        setFilesProgress(new Array(files.length).fill({ totalParts: 1, uploaded: 0 }));

        for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
          const file = files[fileIndex];
          await FilesService.uploadFile(file, folderId, totalParts => {
            setFilesProgress(prevProgress => {
              const newProgress = [...prevProgress];
              const newFileProgress = { totalParts, uploaded: newProgress[fileIndex].uploaded + 1 };
              newProgress[fileIndex] = newFileProgress;
              return newProgress;
            });
          });

          onFileUpload();
        }
      } catch (e: any) {
        setUploadError(handleError(e));
        setFilesProgress([]);
      }
    }
  };

  const clearStateHandler = () => {
    setFilesProgress([]);
    setUploadError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
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
        filesProgress={filesProgress}
        error={uploadError}
      />
    </>
  );
};

export default UploadInput;
