import { BrowserRouter } from 'react-router-dom';

import Router from './Routes';
import { AuthContextProvider } from './contexts/auth-context';
import './styles/bootstrapTheme.scss';
import './App.css';
import useAuth from 'hooks/useAuth';

const AppWithAuth: React.FC = () => {
  const { loading } = useAuth();

  return loading ? <>loading...</> : <Router />;
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
