
import { useState } from 'react';
import { Settings, Eye, EyeOff } from 'lucide-react';
import { spotifyService } from '../services/spotifyService';

interface SpotifyConfigProps {
  onConfigured?: () => void;
}

const SpotifyConfig = ({ onConfigured }: SpotifyConfigProps) => {
  const [clientId, setClientId] = useState(localStorage.getItem('spotify_client_id') || '');
  const [clientSecret, setClientSecret] = useState(localStorage.getItem('spotify_client_secret') || '');
  const [showSecret, setShowSecret] = useState(false);
  const [isConfigured, setIsConfigured] = useState(spotifyService.hasCredentials());

  const handleSave = () => {
    if (clientId && clientSecret) {
      spotifyService.setCredentials(clientId, clientSecret);
      setIsConfigured(true);
      onConfigured?.();
    }
  };

  const handleClear = () => {
    localStorage.removeItem('spotify_client_id');
    localStorage.removeItem('spotify_client_secret');
    setClientId('');
    setClientSecret('');
    setIsConfigured(false);
  };

  if (isConfigured) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">Spotify API configurada</span>
          </div>
          <button
            onClick={handleClear}
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            Reconfigurar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <Settings className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="font-medium text-blue-900">Configurar Spotify API</h3>
      </div>
      
      <p className="text-blue-700 text-sm mb-4">
        Para carregar imagens dos artistas automaticamente, configure suas credenciais do Spotify.
        <a 
          href="https://developer.spotify.com/documentation/web-api" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline ml-1"
        >
          Obtenha suas credenciais aqui
        </a>
      </p>

      <div className="space-y-3">
        <div>
          <label htmlFor="clientId" className="block text-sm font-medium text-blue-900 mb-1">
            Client ID
          </label>
          <input
            id="clientId"
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="input"
            placeholder="Seu Spotify Client ID"
          />
        </div>

        <div>
          <label htmlFor="clientSecret" className="block text-sm font-medium text-blue-900 mb-1">
            Client Secret
          </label>
          <div className="relative">
            <input
              id="clientSecret"
              type={showSecret ? 'text' : 'password'}
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              className="input pr-10"
              placeholder="Seu Spotify Client Secret"
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showSecret ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!clientId || !clientSecret}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Salvar Configuração
        </button>
      </div>
    </div>
  );
};

export default SpotifyConfig;
