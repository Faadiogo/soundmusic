import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, Pencil, Trash2, Search, Music, Instagram, Youtube, AlignJustify as Spotify, ExternalLink, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { FaSpotify, FaTiktok } from "react-icons/fa";

// Types
interface Artist {
  id: string;
  name: string;
  artisticName: string;
  soundOnEmail: string | null;
  onerpmEmail: string | null;
  spotifyLink: string | null;
  youtubeLink: string | null;
  tiktokLink: string | null;
  instagramLink: string | null;
}

const ArtistsPage = () => {
  const { supabase } = useAuth();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [songsCount, setSongsCount] = useState<{[key: string]: number}>({});

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      if (data) {
        setArtists(data);
        // Fetch song counts for each artist
        const counts: {[key: string]: number} = {};
        for (const artist of data) {
          const { count, error: countError } = await supabase
            .from('song_collaborators')
            .select('*', { count: 'exact', head: true })
            .eq('artistId', artist.id);
            
          if (!countError) {
            counts[artist.id] = count || 0;
          }
        }
        setSongsCount(counts);
      }
    } catch (error) {
      console.error('Error fetching artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (artistId: string) => {
    setArtistToDelete(artistId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!artistToDelete) return;
    
    try {
      setDeleteError(null);
      
      // Check if artist has songs
      const { count, error: countError } = await supabase
        .from('song_collaborators')
        .select('*', { count: 'exact', head: true })
        .eq('artistId', artistToDelete);
        
      if (countError) throw countError;
      
      if (count && count > 0) {
        setDeleteError(`Cannot delete artist because they are associated with ${count} songs. Remove the artist from all songs first.`);
        return;
      }
      
      // Delete the artist
      const { error } = await supabase
        .from('artists')
        .delete()
        .eq('id', artistToDelete);
        
      if (error) throw error;
      
      // Update the UI
      setArtists(artists.filter(artist => artist.id !== artistToDelete));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting artist:', error);
      setDeleteError('An error occurred while deleting the artist.');
    }
  };

  const filteredArtists = artists.filter(artist => 
    artist.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    artist.artisticName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mock data for development
  const mockArtists: Artist[] = [
    {
      id: '1',
      name: 'Beltrano de Souza',
      artisticName: 'MC Pogba',
      soundOnEmail: 'pogba@soundon.com',
      onerpmEmail: 'pogba@onerpm.com',
      spotifyLink: 'https://spotify.com/artist/mcpogba',
      youtubeLink: 'https://youtube.com/mcpogba',
      tiktokLink: 'https://tiktok.com/@mcpogba',
      instagramLink: 'https://instagram.com/mcpogba'
    },
    {
      id: '2',
      name: 'Fulano de Tal',
      artisticName: 'MC D\'Lara',
      soundOnEmail: 'dlara@soundon.com',
      onerpmEmail: 'dlara@onerpm.com',
      spotifyLink: 'https://spotify.com/artist/mcdlara',
      youtubeLink: 'https://youtube.com/mcdlara',
      tiktokLink: 'https://tiktok.com/@mcdlara',
      instagramLink: 'https://instagram.com/mcdlara'
    },
    {
      id: '3',
      name: 'Ciclano de Tal',
      artisticName: 'DJ Tchouzen',
      soundOnEmail: 'tchouzen@soundon.com',
      onerpmEmail: null,
      spotifyLink: 'https://spotify.com/artist/djtchouzen',
      youtubeLink: 'https://youtube.com/djtchouzen',
      tiktokLink: null,
      instagramLink: 'https://instagram.com/djtchouzen'
    },
    {
      id: '4',
      name: 'Beltrano de Tal',
      artisticName: 'DJ Vitinho',
      soundOnEmail: 'vitinho@soundon.com',
      onerpmEmail: 'vitinho@onerpm.com',
      spotifyLink: 'https://spotify.com/artist/djvitinho',
      youtubeLink: null,
      tiktokLink: 'https://tiktok.com/@djvitinho',
      instagramLink: 'https://instagram.com/djvitinho'
    },
    {
      id: '5',
      name: 'Rodrigo Martins',
      artisticName: 'DJ RM',
      soundOnEmail: 'rm@soundon.com',
      onerpmEmail: 'rm@onerpm.com',
      spotifyLink: 'https://spotify.com/artist/djrm',
      youtubeLink: 'https://youtube.com/djrm',
      tiktokLink: null,
      instagramLink: 'https://instagram.com/djrm'
    },
    {
      id: '6',
      name: 'Leonardo Silva',
      artisticName: 'DJ Leo Beat',
      soundOnEmail: null,
      onerpmEmail: 'leobeat@onerpm.com',
      spotifyLink: 'https://spotify.com/artist/djleobeat',
      youtubeLink: 'https://youtube.com/djleobeat',
      tiktokLink: 'https://tiktok.com/@djleobeat',
      instagramLink: 'https://instagram.com/djleobeat'
    },
    {
      id: '7',
      name: 'Diego Costa',
      artisticName: 'DJ Diego DC',
      soundOnEmail: 'diegodc@soundon.com',
      onerpmEmail: null,
      spotifyLink: 'https://spotify.com/artist/djdiegodc',
      youtubeLink: null,
      tiktokLink: 'https://tiktok.com/@djdiegodc',
      instagramLink: 'https://instagram.com/djdiegodc'
    },
    {
      id: '8',
      name: 'Bruno Henrique',
      artisticName: 'MC Beiço MR',
      soundOnEmail: 'beicomr@soundon.com',
      onerpmEmail: 'beicomr@onerpm.com',
      spotifyLink: 'https://spotify.com/artist/mcbeicomr',
      youtubeLink: 'https://youtube.com/mcbeicomr',
      tiktokLink: 'https://tiktok.com/@mcbeicomr',
      instagramLink: 'https://instagram.com/mcbeicomr'
    }
  ];


  const displayArtists = loading || artists.length === 0 ? mockArtists : filteredArtists;
  const mockSongCounts = {
    '1': 10, 
    '2': 7,
    '3': 6,
    '4': 8,
    '5': 4,
    '6': 5,
    '7': 3,
    '8': 9    
  };
  
  
  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="mr-2 h-8 w-8 text-primary-600" />
            Parceiros
          </h1>
          <p className="text-gray-600 mt-1">Cadastre artístas parceiros</p>
        </div>
        <Link to="/artists/new" className="btn-primary mt-4 sm:mt-0 flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Cadastrar novo artista
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar artistas..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Artists grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayArtists.map((artist) => (
          <div key={artist.id} className="card overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{artist.artisticName}</h3>
                  <p className="text-gray-600">{artist.name}</p>
                </div>
                <div className="flex space-x-2">
                  <Link 
                    to={`/artists/${artist.id}`} 
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded-full"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button 
                    onClick={() => handleDeleteClick(artist.id)}
                    className="p-2 text-gray-400 hover:text-error-600 hover:bg-gray-100 rounded-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center text-gray-600 mt-4">
                <Music className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  Participação em {songsCount[artist.id] !== undefined ? songsCount[artist.id] : mockSongCounts[artist.id as keyof typeof mockSongCounts] || 0} músicas
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {artist.spotifyLink && (
                    <a 
                      href={artist.spotifyLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-[#1DB954] text-white rounded-full hover:bg-opacity-90"
                      title="Spotify"
                    >
                      <FaSpotify />
                    </a>
                  )}
                  {artist.youtubeLink && (
                    <a 
                      href={artist.youtubeLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-[#FF0000] text-white rounded-full hover:bg-opacity-90"
                      title="YouTube"
                    >
                      <Youtube className="h-4 w-4" />
                    </a>
                  )}
                  {artist.instagramLink && (
                    <a 
                      href={artist.instagramLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-[#E1306C] text-white rounded-full hover:bg-opacity-90"
                      title="Instagram"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                  )}
                  {artist.tiktokLink && (
                    <a 
                      href={artist.tiktokLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-[#000000] text-white rounded-full hover:bg-opacity-90"
                      title="TikTok"
                    >
                      <FaTiktok />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {artist.soundOnEmail && <div>SoundOn: {artist.soundOnEmail}</div>}
                  {artist.onerpmEmail && <div>OneRPM: {artist.onerpmEmail}</div>}
                </div>
                <Link 
                  to={`/artists/${artist.id}`} 
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                >
                  Detalhes <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Excluir Artísta</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Tem certeza que deseja excluir este artista? Esta ação não pode ser desfeita.
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

export default ArtistsPage;