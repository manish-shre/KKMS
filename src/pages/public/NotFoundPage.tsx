import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 text-center">
      <h1 className="mb-6 text-8xl font-bold text-blue-800">404</h1>
      <h2 className="mb-4 text-2xl font-semibold">Page Not Found</h2>
      <p className="mb-8 max-w-md text-gray-600">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button size="lg">Return to Homepage</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;