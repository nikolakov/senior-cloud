import { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { AuthContext } from 'contexts/auth-context';
import Layout from 'components/Layout';
// import Home from 'components/Home';
import LoginPage from 'components/Login/LoginPage';
import RegisterPage from 'components/Login/RegisterPage';
import Dashboard from 'components/Dashboard';
import Page404 from 'components/Layout/Page404';

type RequireAuthProps = {
  children?: React.ReactNode;
};

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  let location = useLocation();

  if (!isLoggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const Router: React.FC = () => (
  <Routes>
    <Route element={<Layout />}>
      {/* <Route path="/" element={<Home />} /> */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Page404 />} />
    </Route>
  </Routes>
);

export default Router;
