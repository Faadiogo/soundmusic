
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MockDataProvider } from './contexts/MockDataContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Dashboard from './pages/dashboard/Dashboard';
import ArtistsPage from './pages/artists/ArtistsPage';
import ArtistFormPage from './pages/artists/ArtistFormPage';
import SongsPage from './pages/songs/SongsPage';
import SongFormPage from './pages/songs/SongFormPage';
import ProfilePage from './pages/profile/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MockDataProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/artists" element={<ArtistsPage />} />
              <Route path="/artists/new" element={<ArtistFormPage />} />
              <Route path="/artists/:id" element={<ArtistFormPage />} />
              <Route path="/songs" element={<SongsPage />} />
              <Route path="/songs/new" element={<SongFormPage />} />
              <Route path="/songs/:id" element={<SongFormPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            
            {/* Admin routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
            
            {/* Fallback routes */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </MockDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
