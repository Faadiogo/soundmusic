import React, { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Music, Users, Home, User, LogOut, Menu, X, Bell,
  ChevronDown, BarChart2, Settings, FileText, MessageSquare
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigation = [
    { name: 'Overview', href: '/admin', icon: BarChart2 },
    { name: 'Artists', href: '/admin/artists', icon: Users },
    { name: 'Songs', href: '/admin/songs', icon: Music },
    { name: 'Releases', href: '/admin/releases', icon: FileText },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:hidden fixed inset-0 z-50 bg-gray-900 bg-opacity-50`}>
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
            <Link to="/" className="flex items-center">
              <Music className="h-8 w-8 text-secondary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ADMIN</span>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)}>
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          <nav className="mt-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium ${
                    isActive
                      ? 'text-secondary-600 bg-secondary-50'
                      : 'text-gray-700 hover:text-secondary-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
            <Link
              to="/dashboard"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-secondary-600 hover:bg-gray-50"
            >
              <Home className="mr-3 h-5 w-5" />
              User Dashboard
            </Link>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 lg:w-64 lg:bg-gray-900">
        <div className="flex items-center h-16 px-6 border-b border-gray-800">
          <Link to="/admin" className="flex items-center">
            <Music className="h-8 w-8 text-secondary-500" />
            <span className="ml-2 text-xl font-bold text-white">ADMIN</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium ${
                  isActive
                    ? 'text-secondary-400 bg-gray-800 border-l-4 border-secondary-500'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
          <div className="pt-4 mt-4 border-t border-gray-800">
            <Link
              to="/dashboard"
              className="flex items-center px-6 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <Home className="mr-3 h-5 w-5" />
              User Dashboard
            </Link>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top navbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center lg:hidden">
              <button onClick={() => setMobileMenuOpen(true)}>
                <Menu className="h-6 w-6 text-gray-500" />
              </button>
              <span className="ml-2 text-lg font-semibold text-gray-900 lg:hidden">ADMIN</span>
            </div>
            <div className="flex items-center">
              <button className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none">
                <Bell className="h-6 w-6" />
              </button>
              <div className="relative ml-4">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  <span className="mr-1">Admin</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleSignOut();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6 animate-fade-in">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-center text-gray-500">
              &copy; {new Date().getFullYear()} SOUNDMUSIC Admin Panel. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;