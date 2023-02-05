import { BrowserRouter } from 'react-router-dom';

import useAuth from 'hooks/useAuth';
import Router from './Routes';
import { AuthContextProvider } from './contexts/auth-context';
import './styles/bootstrapTheme.scss';
import './App.css';
import LoadingOverlay from 'components/shared/UI/LoadingOverlay';

const AppWithAuth: React.FC = () => {
  const { loading } = useAuth();

  return loading ? <LoadingOverlay /> : <Router />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <AppWithAuth />
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
