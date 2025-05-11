import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-blue-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          {/* Organization info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Karn Kayastha Mahila Samaj</h3>
            <p className="max-w-xs text-sm text-blue-200">
              Empowering women in our community through unity, education, and cultural activities.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-200 transition-colors hover:text-white"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-200 transition-colors hover:text-white"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="transition-colors hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/members"
                  className="transition-colors hover:text-white"
                >
                  Members
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="transition-colors hover:text-white"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="transition-colors hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>123 Main Street, City, Country</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0" />
                <span>+1 (123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0" />
                <span>info@kkms.org</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3 lg:col-span-1">
            <h3 className="mb-4 text-lg font-semibold text-white">Newsletter</h3>
            <p className="mb-3 text-sm">Subscribe to our newsletter for updates</p>
            <form className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              <input
                type="email"
                placeholder="Your email"
                className="rounded-md border-gray-300 bg-blue-800 px-4 py-2 text-white placeholder-blue-300 focus:border-blue-400 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-blue-800 pt-6 text-center text-sm">
          <p>© {new Date().getFullYear()} Karn Kayastha Mahila Samaj. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;