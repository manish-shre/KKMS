import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';


const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Members', path: '/members' },
  { name: 'Events', path: '/events' },
  { name: 'Contact', path: '/contact' },
];

const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    // Clean up on unmount
    return () => document.body.classList.remove('overflow-hidden');
  }, [isOpen]);

  useEffect(() => {
    // Always scroll window to top
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <header className="bg-white text-blue-800 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="KKMS Logo" className="h-14 w-auto" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    twMerge(
                      'text-[16px] font-semibold transition-colors hover:text-blue-800',
                      isActive ? 'text-red-600' : 'text-blue-800'
                    )
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="rounded-md p-2 text-blue-800 hover:bg-blue-100 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center md:hidden">
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 text-blue-800 hover:bg-blue-100 rounded-full p-2"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X size={32} />
          </button>
          <ul className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    twMerge(
                      'text-2xl font-semibold transition-colors hover:text-blue-800',
                      isActive ? 'text-red-600' : 'text-blue-800'
                    )
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default PublicNavbar;