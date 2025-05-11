import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  LogOut, 
  Menu, 
  X, 
  UserCircle, 
  Bell,
  Mail 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import { twMerge } from 'tailwind-merge';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

// Define navigation items for sidebar
const navItems = [
  { 
    name: 'Dashboard', 
    path: '/admin/dashboard', 
    icon: BarChart3
  },
  { 
    name: 'Members', 
    path: '/admin/members', 
    icon: Users 
  },
  { 
    name: 'Events', 
    path: '/admin/events', 
    icon: Calendar 
  },
  { 
    name: 'Messages', 
    path: '/admin/messages', 
    icon: Mail 
  },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Close sidebar on route change for mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={twMerge(
          "fixed inset-y-0 left-0 z-30 w-64 transform border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-800">KKMS Admin</h1>
        </div>

        <nav className="mt-5 px-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={twMerge(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-800"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 border-t border-gray-200 pt-4">
            <Link
              to="/admin/profile"
              className={twMerge(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === '/admin/profile'
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <UserCircle className="mr-3 h-5 w-5" />
              My Profile
            </Link>

            <button
              onClick={handleSignOut}
              className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="ml-auto flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative rounded-full p-1 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 z-10 mt-2 w-80 rounded-md border border-gray-200 bg-white shadow-lg">
                  <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
                    <h3 className="font-medium">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="px-4 py-2 text-sm text-gray-500">
                        No notifications
                      </p>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={twMerge(
                            "border-b border-gray-100 px-4 py-2 hover:bg-gray-50",
                            !notification.isRead && "bg-blue-50"
                          )}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <p className="text-sm font-medium">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <p className="text-sm font-medium">{profile?.fullName}</p>
                <p className="text-xs text-gray-500">{profile?.role}</p>
              </div>
              <Link to="/admin/profile">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                    {profile?.fullName.charAt(0)}
                  </div>
                )}
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;