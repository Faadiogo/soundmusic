import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Music, Users, User, Menu, X, LayoutDashboard, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const logo = "/logo_bco.png";


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = user ? [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Músicas', path: '/songs', icon: <Music size={20} /> },
    { name: 'Parceiros', path: '/artists', icon: <Users size={20} /> },
    { name: 'Perfil', path: '/profile', icon: <User size={20} /> },
    ...(user.role === 'admin' ? [
      { name: 'Admin', path: '/admin', icon: <LayoutDashboard size={20} /> },
      { name: 'Lançamentos', path: '/admin/releases', icon: <Calendar size={20} /> },
    ] : []),
  ] : [];

  return (
    <nav className="bg-yellow-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="SOUNDMUSIC Logo" className="h-44 w-auto" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? 'bg-gray-400 bg-opacity-85 text-white'
                        : 'text-white hover:bg-gray-400 hover:text-white'
                    }`}
                  >
                    {link.icon}
                    <span className="ml-2">{link.name}</span>
                  </Link>
                ))}
                <button
                  onClick={() => signOut()}
                  className="ml-4 px-4 py-2 rounded-md text-sm font-medium hover:bg-amber-800 transition-colors flex items-center"
                >
                  <LogOut size={18} className="mr-2" />
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-amber-950 hover:bg-gray-400 text-white transition-colors"
                >
                  Cadastre-se
                </Link>
              </>
              
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-primary-900">
            {user ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                      isActive(link.path)
                        ? 'bg-primary-800 text-white'
                        : 'text-primary-100 hover:bg-primary-800 hover:text-white'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon}
                    <span className="ml-2">{link.name}</span>
                  </Link>
                ))}
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="w-full mt-2 flex items-center px-3 py-2 rounded-md text-base font-medium bg-primary-700 hover:bg-primary-600 text-white"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary-800"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-accent-600 hover:bg-accent-500 text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Cadastre-se
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;