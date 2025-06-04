
import { ToggleLeft, ToggleRight } from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';

const MockDataToggle = () => {
  const { useMockData: shouldUseMockData, toggleMockData } = useMockData();

  return (
    <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
      <span className="text-sm text-gray-600">Dados de exemplo</span>
      <button
        onClick={toggleMockData}
        className={`flex items-center transition-colors ${
          shouldUseMockData 
            ? 'text-primary-600 hover:text-primary-700' 
            : 'text-gray-400 hover:text-gray-500'
        }`}
        title={shouldUseMockData ? 'Usar dados reais' : 'Usar dados de exemplo'}
      >
        {shouldUseMockData ? (
          <ToggleRight className="h-6 w-6" />
        ) : (
          <ToggleLeft className="h-6 w-6" />
        )}
      </button>
      <span className="text-xs text-gray-500">
        {shouldUseMockData ? 'Ativo' : 'Inativo'}
      </span>
    </div>
  );
};

export default MockDataToggle;
