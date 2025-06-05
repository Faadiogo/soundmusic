import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Music, Plus, Search, Calendar, Clock, Pencil, 
  Trash2, AlertCircle, ArrowDown, ArrowUp
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';

// Types
interface Song {
  id: string;
  title: string;
  genre: string;
  releasedate: string;
  duration: number;
  streams: number;
  revenue: number;
}

interface SongWithCollaborators extends Song {
  collaborators: string[];
}

const SongsPage = () => {
  const { supabase } = useAuth();
  const [songs, setSongs] = useState<SongWithCollaborators[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [songToDelete, setSongToDelete] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('releasedate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchSongs();
  }, [sortBy, sortDirection]);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      
      // Fetch songs
      const { data: songsData, error: songsError } = await supabase
        .from('songs')
        .select('*')
        .order(sortBy, { ascending: sortDirection === 'asc' });
        
      if (songsError) throw songsError;
      
      if (songsData) {
        // For each song, fetch its collaborators
        const songsWithCollaborators: SongWithCollaborators[] = [];
        
        for (const song of songsData) {
          const { data: collaboratorsData, error: collaboratorsError } = await supabase
            .from('song_collaborators')
            .select(`
              artistid,
              artists:artistid (
                artisticname
              )
            `)
            .eq('songid', song.id);
            
          if (collaboratorsError) throw collaboratorsError;
          
          const collaboratorNames = collaboratorsData?.map(
            (item: any) => item.artists.artisticname
          ) || [];
          
          songsWithCollaborators.push({
            ...song,
            collaborators: collaboratorNames
          });
        }
        
        setSongs(songsWithCollaborators);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (songId: string) => {
    setSongToDelete(songId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!songToDelete) return;
    
    try {
      setDeleteError(null);
      
      // Delete the song (cascades to song_collaborators)
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', songToDelete);
        
      if (error) throw error;
      
      // Update the UI
      setSongs(songs.filter(song => song.id !== songToDelete));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting song:', error);
      setDeleteError('An error occurred while deleting the song.');
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    song.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displaySongs = filteredSongs;
  
  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Music className="mr-2 h-8 w-8 text-yellow-500" />
            Músicas
          </h1>
        </div>
        <Link to="/songs/new" className="btn-primary mt-4 sm:mt-0 flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Nova Música
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar músicas por título ou gênero..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Songs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('title')}>
                  <div className="flex items-center">
                    Título
                    {sortBy === 'title' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="ml-1 h-3 w-3" /> : 
                        <ArrowDown className="ml-1 h-3 w-3" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('genre')}>
                  <div className="flex items-center">
                    Gênero
                    {sortBy === 'genre' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="ml-1 h-3 w-3" /> : 
                        <ArrowDown className="ml-1 h-3 w-3" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3">Feat</th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('releasedate')}>
                  <div className="flex items-center">
                    Lançamento
                    {sortBy === 'releasedate' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="ml-1 h-3 w-3" /> : 
                        <ArrowDown className="ml-1 h-3 w-3" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('duration')}>
                  <div className="flex items-center">
                    Duração
                    {sortBy === 'duration' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="ml-1 h-3 w-3" /> : 
                        <ArrowDown className="ml-1 h-3 w-3" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('streams')}>
                  <div className="flex items-center">
                    Streams
                    {sortBy === 'streams' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="ml-1 h-3 w-3" /> : 
                        <ArrowDown className="ml-1 h-3 w-3" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('revenue')}>
                  <div className="flex items-center">
                    Receita
                    {sortBy === 'revenue' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="ml-1 h-3 w-3" /> : 
                        <ArrowDown className="ml-1 h-3 w-3" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displaySongs.map((song) => (
                <tr key={song.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/songs/${song.id}`} className="text-yellow-500 hover:text-yellow-600 font-medium">
                      {song.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {song.genre}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {song.collaborators.map((collaborator, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"
                        >
                          {collaborator}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4 text-yellow-500" />
                      {format(new Date(song.releasedate), 'dd/MM/yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-yellow-500" />
                      {formatDuration(song.duration)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {song.streams.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    R$ {song.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link 
                        to={`/songs/${song.id}`} 
                        className="text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button 
                        onClick={() => handleDeleteClick(song.id)}
                        className="text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-error-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-error-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Excluir Música</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                      Tem certeza de que deseja deletar esta música? Essa ação não pode ser desfeita.
                      </p>
                      {deleteError && (
                        <div className="mt-2 p-2 text-sm text-error-800 bg-error-50 rounded-md">
                          {deleteError}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-error-600 text-base font-medium text-white hover:bg-error-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Excluir
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongsPage;