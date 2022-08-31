import { BrowserRouter } from 'react-router-dom';

import Router from './Routes';
import { AuthContext, AuthContextProvider } from './contexts/auth-context';
import './styles/bootstrapTheme.scss';
import './App.css';
import { useContext } from 'react';

const AppWithAuth: React.FC = () => {
  const { loading } = useContext(AuthContext);

  return loading ? <>'...loading'</> : <Router />;
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
