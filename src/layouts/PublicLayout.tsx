import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';

const PublicLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;