import { Link } from 'react-router-dom';
import { Music, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-8">
          <Music className="h-20 w-20 text-primary-600" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Página não encontrada</h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
          Desculpe, não conseguimos encontrar a página que você está procurando. Ela pode ter sido removida, renomeada ou estar temporariamente indisponível.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Home className="w-5 h-5 mr-2" />
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
