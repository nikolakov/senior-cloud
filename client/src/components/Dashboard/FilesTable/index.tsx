import React from 'react';
import Button from 'react-bootstrap/Button';

import { FileFromApi } from 'types';
import MoreOptionsDropdown from './MoreOptionsDropdown';
import useAuth from 'hooks/useAuth';

import classes from './styles.module.css';

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
};

const TableHeader: React.FC = () => {
  return (
    <div className={classes.TableHeader}>
      <div className={classes.IconContainer}>#</div>
      <div className={classes.NameContainer}>
        <div>Name</div>
      </div>
    </div>
  );
};

const FileRow: React.FC<RowProps> = ({ file }) => {
  const { profileInfo } = useAuth();

  const ext = file.name.split('.').pop() || '';

  return (
    <div className={classes.TableRow}>
      <div className={classes.IconContainer}>{icons[ext] || icons.default}</div>
      <div className={classes.NameContainer}>
        <div title={file.name}>{file.name}</div>
      </div>
      <div className={classes.DownloadContainer}>
        <Button
          size="sm"
          href={`api/files/${profileInfo._id}/${file._id}/download`}
          // target="_blank"
        >
          Download
        </Button>
      </div>
      <div className={classes.MoreOptionsContainer}>
        {/* <button className={classes.MoreOptionsButton}>
          <i className="bi bi-three-dots" />
        </button> */}
        <MoreOptionsDropdown />
      </div>
    </div>
  );
};

type Props = {
  files: FileFromApi[];
};

const FilesTable: React.FC<Props> = ({ files }) => {
  return (
    <div style={{ width: '100%' }}>
      <TableHeader />
      <div className={classes.FilesTable}>
        {files.map(file => (
          <FileRow key={file._id} file={file} />
        ))}
      </div>
    </div>
  );
};

export default FilesTable;
