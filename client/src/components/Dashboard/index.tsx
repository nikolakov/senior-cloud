import { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';

import UploadInput from './UploadInput';
import FilesTable from './FilesTable';
import { FileFromApi } from 'types';
import handleError from 'utils/handleError';
import FilesService from 'services/FilesService';

const Dashboard: React.FC = () => {
  const [files, setFiles] = useState<FileFromApi[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFiles = async () => {
    try {
      const res = await FilesService.getFiles();
      setFiles(res.data);
    } catch (e: any) {
      handleError(e);
    }
  };

  useEffect(() => {
    const initialFetch = async () => {
      setLoading(true);
      await fetchFiles();
      setLoading(false);
    };

    initialFetch();
  }, []);

  return (
    <div style={{ padding: '2rem 0' }}>
      <UploadInput onSuccess={fetchFiles} />
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
        {loading ? <Spinner animation="border" /> : <FilesTable files={files} />}
      </div>
    </div>
  );
};

export default Dashboard;
