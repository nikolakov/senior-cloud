import { useState, useEffect, useCallback } from 'react';
import Spinner from 'react-bootstrap/Spinner';

import UploadInput from './UploadInput';
import FilesTable from './FilesTable';
import { FileFromApi } from 'types';
import handleError from 'utils/handleError';
import FoldersService from 'services/FoldersService';
import useAuth from 'hooks/useAuth';

const Dashboard: React.FC = () => {
  const { profileInfo } = useAuth();

  const [files, setFiles] = useState<FileFromApi[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFiles = useCallback(async () => {
    try {
      const res = await FoldersService.getFolderFiles(profileInfo.rootFolder.id);
      setFiles(res.data);
    } catch (e: any) {
      handleError(e);
    }
  }, [profileInfo.rootFolder.id]);

  useEffect(() => {
    const initialFetch = async () => {
      setLoading(true);
      await fetchFiles();
      setLoading(false);
    };

    initialFetch();
  }, [fetchFiles]);

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <UploadInput onFileUpload={fetchFiles} folderId={profileInfo.rootFolder.id} />
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <FilesTable files={files} onChange={fetchFiles} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
