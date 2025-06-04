
import { useState } from 'react';
import { Bell, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useMockData } from '../../contexts/MockDataContext';

const NotificationsConfigPage = () => {
  const { supabase } = useAuth();
  const { useMockData: shouldUseMockData } = useMockData();
  const [config, setConfig] = useState({
    newArtistNotification: true,
    newSongNotification: true,
    releaseDateReminder: true,
    streamMilestones: true,
    milestoneThresholds: [1000, 10000, 100000, 500000, 1000000],
    reminderDays: 7,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (shouldUseMockData) {
      // Simulate save for mock data
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }, 1000);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Save configuration to Supabase
      const { error } = await supabase
        .from('notification_config')
        .upsert({
          id: 'global',
          settings: config,
        });

      if (error) throw error;

      setSuccess(true);
    } catch (err) {
      console.error('Error saving notification config:', err);
      setError('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Bell className="mr-2 h-8 w-8 text-primary-600" />
          Configurações de Notificações
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-md bg-error-50 text-error-800 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-error-500" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-md bg-success-50 text-success-800">
          Configurações salvas com sucesso!
        </div>
      )}

      {shouldUseMockData && (
        <div className="mb-6 p-4 rounded-md bg-blue-50 text-blue-800">
          Modo de dados de exemplo ativo - as configurações não serão salvas no banco de dados.
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Notificações Automáticas
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="newArtistNotification"
                      checked={config.newArtistNotification}
                      onChange={(e) => setConfig({
                        ...config,
                        newArtistNotification: e.target.checked
                      })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="newArtistNotification" className="ml-2 block text-sm text-gray-900">
                      Notificar quando um novo artista for cadastrado
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="newSongNotification"
                      checked={config.newSongNotification}
                      onChange={(e) => setConfig({
                        ...config,
                        newSongNotification: e.target.checked
                      })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="newSongNotification" className="ml-2 block text-sm text-gray-900">
                      Notificar quando uma nova música for cadastrada
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="releaseDateReminder"
                      checked={config.releaseDateReminder}
                      onChange={(e) => setConfig({
                        ...config,
                        releaseDateReminder: e.target.checked
                      })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="releaseDateReminder" className="ml-2 block text-sm text-gray-900">
                      Lembrete de data de lançamento
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="streamMilestones"
                      checked={config.streamMilestones}
                      onChange={(e) => setConfig({
                        ...config,
                        streamMilestones: e.target.checked
                      })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="streamMilestones" className="ml-2 block text-sm text-gray-900">
                      Notificar marcos de reproduções
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Configurações Avançadas
                </h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="reminderDays" className="block text-sm font-medium text-gray-700">
                      Dias de antecedência para lembrete de lançamento
                    </label>
                    <input
                      type="number"
                      id="reminderDays"
                      min="1"
                      max="30"
                      value={config.reminderDays}
                      onChange={(e) => setConfig({
                        ...config,
                        reminderDays: parseInt(e.target.value)
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Marcos de Reproduções (streams)
                    </label>
                    <div className="mt-2 space-y-2">
                      {config.milestoneThresholds.map((threshold, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={threshold}
                            onChange={(e) => {
                              const newThresholds = [...config.milestoneThresholds];
                              newThresholds[index] = parseInt(e.target.value);
                              setConfig({
                                ...config,
                                milestoneThresholds: newThresholds
                              });
                            }}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          />
                          <span className="text-sm text-gray-500">reproduções</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Configurações
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationsConfigPage;
