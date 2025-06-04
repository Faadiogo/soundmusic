
import { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar></Navbar>

      {/* Conteúdo principal */}
      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 animate-fade-in">
        {children}
      </main>

      {/* Rodapé */}
      <Footer></Footer>
    </div>
  );
};

export default Layout;
