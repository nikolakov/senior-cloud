import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import classes from './styles.module.css';

type Props = {
  children: React.ReactNode;
  title: string;
  buttonText: string;
  buttonHref: string;
};

const Card: React.FC<Props> = ({ children, title, buttonText, buttonHref }) => {
  return (
    <div className={classes.LoginCard}>
      <Row className="justify-content-between align-items-center">
        <Col xs="auto">
          <h1 style={{ fontWeight: 'bold' }}>{title}</h1>
        </Col>
        <Col xs="auto">
          <Link to={buttonHref}>
            <Button variant="outline-primary">{buttonText}</Button>
          </Link>
        </Col>
      </Row>
      <hr />
      {children}
    </div>
  );
};

export default Card;
