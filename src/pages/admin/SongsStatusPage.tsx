
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Music, Search, Edit2, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import { SongStatus } from '../../types/schema';

type SongWithUser = {
  id: string;
  title: string;
  genre: string;
  releaseDate: string;
  status: SongStatus;
  status_notes: string | null;
  status_updated_at: string;
  userId: string;
  user_name: string | null;
  user_email: string;
};

const statusOptions = [
  { value: 'submitted', label: 'Enviado', color: 'bg-blue-100 text-blue-800', icon: Clock },
  { value: 'under_review', label: 'Em Análise', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  { value: 'approved', label: 'Aprovado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  { value: 'in_production', label: 'Em Produção', color: 'bg-purple-100 text-purple-800', icon: Music },
  { value: 'mastering', label: 'Masterização', color: 'bg-indigo-100 text-indigo-800', icon: Music },
  { value: 'distribution_pending', label: 'Aguardando Distribuição', color: 'bg-orange-100 text-orange-800', icon: Clock },
  { value: 'published', label: 'Publicado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  { value: 'rejected', label: 'Rejeitado', color: 'bg-red-100 text-red-800', icon: XCircle },
];

const SongsStatusPage: React.FC = () => {
  const { supabase, user } = useAuth();
  const [songs, setSongs] = useState<SongWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [editingStatus, setEditingStatus] = useState<{songId: string; status: SongStatus; notes: string} | null>(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const { data: songsData, error: songsError } = await supabase
        .from('songs')
        .select('*')
        .order('status_updated_at', { ascending: false });

      if (songsError) throw songsError;

      // Get user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, username');

      if (profilesError) throw profilesError;

      // Get user emails
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) throw authError;

      const songsWithUsers = songsData?.map(song => {
        const profile = profiles?.find(p => p.id === song.userId);
        const authUser = authUsers.users.find(u => u.id === song.userId);
        return {
          ...song,
          user_name: profile?.full_name || profile?.username,
          user_email: authUser?.email || ''
        };
      }) || [];

      setSongs(songsWithUsers);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSongStatus = async (songId: string, newStatus: SongStatus, notes: string) => {
    try {
      const { error } = await supabase
        .from('songs')
        .update({ 
          status: newStatus, 
          status_notes: notes,
          status_updated_by: user?.id,
          status_updated_at: new Date().toISOString()
        })
        .eq('id', songId);

      if (error) throw error;
      
      setEditingStatus(null);
      await fetchSongs(); // Refresh the list
    } catch (error) {
      console.error('Error updating song status:', error);
    }
  };

  const filteredSongs = songs.filter(song => {
    const matchesSearch = 
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.user_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || song.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusInfo = (status: SongStatus) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciamento de Status das Músicas</h1>
        <p className="text-gray-600">Gerencie o status de progresso de todas as músicas</p>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por música, artista ou email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Todos os status</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Música
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Artista
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Observações
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSongs.map((song) => {
                const statusInfo = getStatusInfo(song.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <tr key={song.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <Music className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{song.title}</div>
                          <div className="text-sm text-gray-500">{song.genre}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{song.user_name || 'Nome não informado'}</div>
                      <div className="text-sm text-gray-500">{song.user_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {song.status_notes || 'Nenhuma observação'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setEditingStatus({
                          songId: song.id,
                          status: song.status,
                          notes: song.status_notes || ''
                        })}
                        className="text-primary-600 hover:text-primary-900 flex items-center"
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Editar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Status Modal */}
      {editingStatus && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Atualizar Status da Música</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={editingStatus.status}
                  onChange={(e) => setEditingStatus({
                    ...editingStatus,
                    status: e.target.value as SongStatus
                  })}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows={3}
                  value={editingStatus.notes}
                  onChange={(e) => setEditingStatus({
                    ...editingStatus,
                    notes: e.target.value
                  })}
                  placeholder="Adicione observações sobre o status..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setEditingStatus(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => updateSongStatus(editingStatus.songId, editingStatus.status, editingStatus.notes)}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongsStatusPage;
