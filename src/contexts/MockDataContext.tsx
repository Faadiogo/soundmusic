
import { createContext, useContext, useState, ReactNode } from 'react';

interface MockDataContextType {
  useMockData: boolean;
  toggleMockData: () => void;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
};

interface MockDataProviderProps {
  children: ReactNode;
}

export const MockDataProvider = ({ children }: MockDataProviderProps) => {
  const [useMockData, setUseMockData] = useState(false);

  const toggleMockData = () => {
    setUseMockData(prev => !prev);
  };

  return (
    <MockDataContext.Provider value={{ useMockData, toggleMockData }}>
      {children}
    </MockDataContext.Provider>
  );
};
