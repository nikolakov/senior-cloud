import Spinner from 'react-bootstrap/Spinner';

import classes from './styles.module.css';

type Props = {
  children?: React.ReactNode;
};

const LoadingOverlay: React.FC<Props> = ({ children }) => {
  return (
    <div className={classes.Overlay}>
      <div className={classes.SpinnerContainer}>
        <Spinner animation="border" />
      </div>
      {children}
    </div>
  );
};

export default LoadingOverlay;
