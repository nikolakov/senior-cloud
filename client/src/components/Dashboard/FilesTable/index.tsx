import React from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';

import { FileFromApi } from 'types';
import MoreOptionsDropdown from './MoreOptionsDropdown';

import classes from './styles.module.css';
import FilesService from 'services/FilesService';

// ToDo:
// EVERYTHING in this file requires a lot of rework and optimization
// also,
// creating a much more generic table component would be very helpful

const icons: { [key: string]: React.ReactNode } = {
  pdf: <i className="bi bi-file-earmark-pdf" />,
  mp4: <i className="bi bi-file-earmark-play" />,
  mp3: <i className="bi bi-file-earmark-music" />,
  jpeg: <i className="bi bi-file-earmark-image" />,
  jpg: <i className="bi bi-file-earmark-image" />,
  png: <i className="bi bi-file-earmark-image" />,
  ppt: <i className="bi bi-file-earmark-ppt" />,
  pptx: <i className="bi bi-file-earmark-ppt" />,
  doc: <i className="bi bi-file-earmark-word" />,
  docx: <i className="bi bi-file-earmark-word" />,
  xls: <i className="bi bi-file-earmark-excel" />,
  xlsx: <i className="bi bi-file-earmark-excel" />,
  zip: <i className="bi bi-file-earmark-zip" />,
  rar: <i className="bi bi-file-earmark-zip" />,
  '7z': <i className="bi bi-file-earmark-zip" />,
  'tar.gz': <i className="bi bi-file-earmark-zip" />,
  txt: <i className="bi bi-file-earmark-text" />,
  default: <i className="bi bi-file-earmark-binary" />,
};

type RowProps = {
  file: FileFromApi;
  onChange: () => any;
};

const TableHeader: React.FC = () => {
  const { t } = useTranslation('private');

  return (
    <div className={classes.TableHeader}>
      <div className={classes.IconContainer}>#</div>
      <div className={classes.NameContainer}>
        <div>{t('dashboard.fileListNameColumnTitle')}</div>
      </div>
    </div>
  );
};

const FileRow: React.FC<RowProps> = ({ file, onChange }) => {
  const { t: tc } = useTranslation('common');

  const deleteFileHandler = async (fileId: string) => {
    try {
      await FilesService.delete(fileId);
      onChange();
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const ext = file.name.split('.').pop() || '';

  return (
    <div className={classes.TableRow}>
      <div className={classes.IconContainer}>{icons[ext] || icons.default}</div>
      <div className={classes.NameContainer}>
        <div title={file.name}>{file.name}</div>
      </div>
      <div className={classes.DownloadContainer}>
        <Button size="sm" onClick={() => FilesService.download(file.id)}>
          {tc('download')}
        </Button>
      </div>
      <div className={classes.MoreOptionsContainer}>
        <MoreOptionsDropdown fileId={file.id} onDelete={deleteFileHandler} />
      </div>
    </div>
  );
};

type Props = {
  files: FileFromApi[];
  onChange: () => any;
};

const FilesTable: React.FC<Props> = ({ files, onChange }) => {
  return (
    <div style={{ width: '100%' }}>
      <TableHeader />
      <div className={classes.FilesTable}>
        {files.map(file => (
          <FileRow key={file.id} file={file} onChange={onChange} />
        ))}
      </div>
    </div>
  );
};

export default FilesTable;
