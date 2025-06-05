import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, Pencil, Trash2, Search, Music, Instagram, Youtube, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { FaSpotify, FaTiktok } from "react-icons/fa";
import { spotifyService } from '../../services/spotifyService';

// Types
interface Artist {
  id: string;
  name: string;
  artisticname: string;
  soundonemail: string | null;
  onerpmemail: string | null;
  spotifylink: string | null;
  youtubelink: string | null;
  tiktoklink: string | null;
  instagramink: string | null;
}

interface SongCollabInfo {
  id: string;
  title: string;
  streams: number;
  revenue: number;
}

// Função utilitária para extrair o ID do Spotify do link
function getSpotifyArtistId(spotifyUrl: string): string | null {
  const match = spotifyUrl?.match(/artist\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

// Componente para exibir a popularidade como borda circular
function PopularityCircle({ value, size = 120, stroke = 7 }: { value: number, size?: number, stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);

  return (
    <svg width={size} height={size} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none" style={{ display: 'block' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e5e7eb" // gray-200
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#22c55e" // green-500
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s' }}
      />
    </svg>
  );
}

const ArtistsPage = () => {
  const { supabase, user } = useAuth();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [songsCount, setSongsCount] = useState<{[key: string]: number}>({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [artistSongs, setArtistSongs] = useState<SongCollabInfo[]>([]);
  const [loadingSongs, setLoadingSongs] = useState(false);
  const [artistImages, setArtistImages] = useState<{[artistId: string]: string}>({});
  const [artistSpotifyData, setArtistSpotifyData] = useState<{[artistId: string]: {followers: number, popularity: number}}>({});
  const [loadingImages, setLoadingImages] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);


  useEffect(() => {
    if (user && user.id) {
      fetchArtists();
    }
  }, [user]);

  useEffect(() => {
    const cached = localStorage.getItem('artistImages');
    if (cached) {
      setArtistImages(JSON.parse(cached));
      setImagesLoaded(true);
    }
    const cachedSpotifyData = localStorage.getItem('artistSpotifyData');
    if (cachedSpotifyData) {
      setArtistSpotifyData(JSON.parse(cachedSpotifyData));
    }
  }, []);

  useEffect(() => {
    if (artists.length > 0) {
      setLoadingImages(true);
      (async () => {
        try {
          const images: {[artistId: string]: string} = {};
          const spotifyData: {[artistId: string]: {followers: number, popularity: number}} = {};
          for (const artist of artists) {
            let artistData = null;
            let spotifyId = artist.spotifylink ? getSpotifyArtistId(artist.spotifylink) : null;
            if (spotifyId) {
              artistData = await spotifyService.getArtistById(spotifyId);
            } else if (artist.artisticname) {
              artistData = await spotifyService.getArtistData(artist.artisticname);
            }
            if (artistData) {
              images[artist.id] = artistData.images[0]?.url || '/user_default.png';
              spotifyData[artist.id] = {
                followers: artistData.followers.total,
                popularity: artistData.popularity
              };
            } else {
              images[artist.id] = '/user_default.png';
            }
          }
          setArtistImages(images);
          setArtistSpotifyData(spotifyData);
          localStorage.setItem('artistImages', JSON.stringify(images));
          localStorage.setItem('artistSpotifyData', JSON.stringify(spotifyData));
          setImagesLoaded(true);
        } catch (err) {
          console.error('Erro geral ao buscar dados dos artistas:', err);
        }
        setLoadingImages(false);
      })();
    }
  }, [artists]);

  // Função para limpar cache de um artista específico (chame ao editar o link do Spotify)
  // function clearArtistCache(artistId: string) {
  //   const cachedImages = localStorage.getItem('artistImages');
  //   const cachedSpotifyData = localStorage.getItem('artistSpotifyData');
  //   if (cachedImages) {
  //     const images = JSON.parse(cachedImages);
  //     delete images[artistId];
  //     localStorage.setItem('artistImages', JSON.stringify(images));
  //   }
  //   if (cachedSpotifyData) {
  //     const spotifyData = JSON.parse(cachedSpotifyData);
  //     delete spotifyData[artistId];
  //     localStorage.setItem('artistSpotifyData', JSON.stringify(spotifyData));
  //   }
  // }

  const fetchArtists = async () => {
    try {
      setLoading(true);
      if (!user || !user.id) {
        setArtists([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('userid', user.id);
      if (error) throw error;
      if (data) {
        setArtists(data);
        // Fetch song counts for each artist
        const counts: {[key: string]: number} = {};
        for (const artist of data) {
          const { count, error: countError } = await supabase
            .from('song_collaborators')
            .select('*', { count: 'exact', head: true })
            .eq('artistid', artist.id);
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
        .eq('artistid', artistToDelete);
        
      if (countError) throw countError;
      
      if (count && count > 0) {
        setDeleteError(`Não é possível excluir o artista porque ele está associado a ${count} músicas. Remova o artista de todas as músicas primeiro.`);
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

  const handleShowDetails = async (artist: Artist) => {
    setSelectedArtist(artist);
    setShowDetailsModal(true);
    setLoadingSongs(true);
    // Buscar músicas em colaboração
    const { data, error } = await supabase
      .from('song_collaborators')
      .select('songid, songs(title, streams, revenue)')
      .eq('artistid', artist.id);
    if (!error && data) {
      const songs: SongCollabInfo[] = data
        .filter((item: any) => item.songs)
        .map((item: any) => ({
          id: item.songid,
          title: item.songs.title,
          streams: item.songs.streams,
          revenue: item.songs.revenue,
        }));
      setArtistSongs(songs);
    } else {
      setArtistSongs([]);
    }
    setLoadingSongs(false);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedArtist(null);
    setArtistSongs([]);
  };

  const filteredArtists = artists.filter(artist => 
    artist.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    artist.artisticname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayArtists = filteredArtists;

  // Ordenar artistas por seguidores do Spotify (descrescente)
  const sortedArtists = [...displayArtists].sort((a, b) => {
    const followersA = artistSpotifyData[a.id]?.followers ?? -1;
    const followersB = artistSpotifyData[b.id]?.followers ?? -1;
    return followersB - followersA;
  });

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="mr-2 h-8 w-8 text-yellow-500" />
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[300px]">
        {(loading || (loadingImages && !imagesLoaded)) && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-60">
            <svg className="animate-spin h-12 w-12 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        {!loading && !loadingImages && displayArtists.length === 0 && (
          <div className="col-span-full text-center text-gray-500">Nenhum artista parceiro cadastrado.</div>
        )}
        {!loading && !loadingImages && sortedArtists.map((artist) => (
          <div key={artist.id} className="card overflow-hidden flex flex-col shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200 bg-gradient-to-b from-yellow-600 via-black to-gray-400 transform transition-transform duration-300 hover:-translate-y-4">
            <div className="p-6 flex flex-col items-center relative">
              {/* Imagem do artista com borda de popularidade */}
              <div className="relative flex items-center justify-center mb-3 mt-2" style={{ width: 112, height: 112 }}>
                {artistSpotifyData[artist.id] && (
                  <PopularityCircle value={artistSpotifyData[artist.id].popularity} size={112} stroke={7} />
                )}
                <img
                  src={artistImages[artist.id] || '/user_default.png'}
                  alt={artist.artisticname}
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow"
                  onError={e => { e.currentTarget.src = '/user_default.png'; }}
                />
              </div>
              <h3 className="text-2xl font-extrabold text-white text-center">{artist.artisticname}</h3>
              <p className="text-gray-300 text-center text-sm mb-2">{artist.name}</p>
              {artistSpotifyData[artist.id] && (
                <div className="flex flex-col items-center mb-2">
                  <span className="text-base font-extrabold text-yellow-500 tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {artistSpotifyData[artist.id].followers.toLocaleString()} seguidores
                  </span>
                </div>
              )}
              <div className="flex items-center justify-center text-gray-300 mt-2">
                <Music className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  Participação em {songsCount[artist.id] || 0} músicas
                </span>
              </div>
              <div className="mt-4 pt-4 w-full">
                <div className="flex flex-wrap gap-2 justify-center">
                  {artist.spotifylink && (
                    <a 
                      href={artist.spotifylink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-[#1DB954] text-white rounded-full hover:bg-opacity-90"
                      title="Spotify"
                    >
                      <FaSpotify />
                    </a>
                  )}
                  {artist.youtubelink && (
                    <a 
                      href={artist.youtubelink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-[#FF0000] text-white rounded-full hover:bg-opacity-50"
                      title="YouTube"
                    >
                      <Youtube className="h-4 w-4" />
                    </a>
                  )}
                  {artist.instagramink && (
                    <a 
                      href={artist.instagramink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-[#E1306C] text-white rounded-full hover:bg-opacity-50"
                      title="Instagram"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                  )}
                  {artist.tiktoklink && (
                    <a 
                      href={artist.tiktoklink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-[#000000] text-white rounded-full hover:bg-opacity-50"
                      title="TikTok"
                    >
                      <FaTiktok />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between">
              <div className="text-xs text-gray-500 flex flex-col">
                {artist.soundonemail && <div>SoundOn: {artist.soundonemail}</div>}
                {artist.onerpmemail && <div>OneRPM: {artist.onerpmemail}</div>}
              </div>
              <div className="flex space-x-2">
                <Link 
                  to={`/artists/${artist.id}`} 
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
                  title="Editar"
                >
                  <Pencil className="h-5 w-5" />
                </Link>
                <button 
                  onClick={() => handleDeleteClick(artist.id)}
                  className="p-2 text-gray-400 hover:text-error-600 hover:bg-gray-100 rounded-full transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleShowDetails(artist);
                  }}
                  className="p-2 text-yellow-600 hover:text-white hover:bg-yellow-600 bg-yellow-100 rounded-full transition-colors"
                  title="Ver músicas"
                >
                  <Music className="h-5 w-5" />
                </button>
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

      {/* Modal de detalhes do artista */}
      {showDetailsModal && selectedArtist && (
        <div className="fixed z-20 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Music className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Músicas em colaboração com {selectedArtist.artisticname}</h3>
                    {loadingSongs ? (
                      <div className="text-center text-gray-500">Carregando músicas...</div>
                    ) : artistSongs.length === 0 ? (
                      <div className="text-center text-gray-500">Nenhuma música encontrada.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Streams</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Receita</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {artistSongs.map((song) => (
                              <tr key={song.id}>
                                <td className="px-4 py-2">{song.title}</td>
                                <td className="px-4 py-2">{song.streams.toLocaleString()}</td>
                                <td className="px-4 py-2">R$ {song.revenue.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCloseDetails}
                >
                  Fechar
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