import { Link } from 'react-router-dom';

const Page404: React.FC = () => (
  <>
    <h1>404 Not Found</h1>
    <h3>
      <Link to="/">Return home</Link>
    </h3>
  </>
);

export default Page404;
