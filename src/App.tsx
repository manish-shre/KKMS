import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import { AuthProvider } from './contexts/AuthContext';

// Public Pages
import HomePage from './pages/public/HomePage';
import MembersPage from './pages/public/MembersPage';
import EventsPage from './pages/public/EventsPage';
import ContactPage from './pages/public/ContactPage';
import NotFoundPage from './pages/public/NotFoundPage';
import PublicLayout from './layouts/PublicLayout';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import AdminMembersPage from './pages/admin/MembersPage';
import AdminEventsPage from './pages/admin/EventsPage';
import AdminProfilePage from './pages/admin/ProfilePage';
import AdminMessagesPage from './pages/admin/MessagesPage';
import LoginPage from './pages/auth/LoginPage';

// Authentication guard
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingScreen from './components/ui/LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkUserSession = async () => {
      try {
        await supabase.auth.getSession();
      } catch (error) {
        console.error('Error checking auth session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="members" element={<AdminMembersPage />} />
            <Route path="events" element={<AdminEventsPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="messages" element={<AdminMessagesPage />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;