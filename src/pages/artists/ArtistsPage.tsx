import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, Pencil, Trash2, Search, Music, Instagram, Youtube, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { useMockData } from '../../contexts/MockDataContext';

// Define Artist type locally since it's not exported from schema
interface Artist {
  id: string;
  name: string;
  email: string;
  phone?: string;
  stagename?: string;
  artisticgenres?: string[];
  spotifyurl?: string;
  instagramurl?: string;
  youtubeurl?: string;
  userid: string;
}

// Mock data
const mockArtists: Artist[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '(11) 99999-9999',
    stagename: 'J.Silva',
    artisticgenres: ['Pop', 'Rock'],
    spotifyurl: 'https://open.spotify.com/artist/123',
    instagramurl: 'https://instagram.com/jsilva',
    youtubeurl: 'https://youtube.com/jsilva',
    userid: 'user1'
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria@example.com',
    phone: '(21) 98888-8888',
    stagename: 'M.Oliveira',
    artisticgenres: ['MPB', 'Samba'],
    spotifyurl: 'https://open.spotify.com/artist/456',
    instagramurl: 'https://instagram.com/moliveira',
    youtubeurl: 'https://youtube.com/moliveira',
    userid: 'user2'
  },
  {
    id: '3',
    name: 'Carlos Pereira',
    email: 'carlos@example.com',
    phone: '(31) 97777-7777',
    stagename: 'C.Pereira',
    artisticgenres: ['Hip Hop', 'Rap'],
    spotifyurl: 'https://open.spotify.com/artist/789',
    instagramurl: 'https://instagram.com/cpereira',
    youtubeurl: 'https://youtube.com/cpereira',
    userid: 'user3'
  },
];

const ArtistsPage = () => {
  const { supabase } = useAuth();
  const { useMockData: shouldUseMockData } = useMockData();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (shouldUseMockData) {
      setArtists(mockArtists);
      setLoading(false);
    } else {
      fetchArtists();
    }
  }, [shouldUseMockData]);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .order('name');

      if (error) throw error;
      setArtists(data || []);
    } catch (error) {
      console.error('Error fetching artists:', error);
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (artistId: string) => {
    setArtistToDelete(artistId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!artistToDelete) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('artists')
        .delete()
        .eq('id', artistToDelete);

      if (error) throw error;
      
      fetchArtists();
      setShowDeleteModal(false);
      setArtistToDelete(null);
    } catch (error) {
      console.error('Error deleting artist:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.stagename?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="page-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="flex items-center mb-4 sm:mb-0">
            <Users className="h-8 w-8 text-primary-600 mr-3" />
            <h1 className="section-title mb-0">Parceiros Musicais</h1>
          </div>
          <Link 
            to="/artists/new" 
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Parceiro
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por nome ou nome artístico..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Artists Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : filteredArtists.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">
              {searchTerm ? 'Nenhum parceiro encontrado' : 'Nenhum parceiro cadastrado'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm ? 'Tente buscar com outros termos' : 'Comece adicionando seu primeiro parceiro musical'}
            </p>
            {!searchTerm && (
              <Link to="/artists/new" className="btn-primary">
                <Plus className="h-5 w-5 mr-2" />
                Adicionar Primeiro Parceiro
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtists.map((artist) => (
              <div key={artist.id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {artist.name}
                    </h3>
                    {artist.stagename && (
                      <p className="text-primary-600 font-medium mb-2">
                        {artist.stagename}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm">{artist.email}</p>
                    {artist.phone && (
                      <p className="text-gray-600 text-sm">{artist.phone}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/artists/${artist.id}`}
                      className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(artist.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Genres */}
                {artist.artisticgenres && artist.artisticgenres.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {artist.artisticgenres.map((genre: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          <Music className="h-3 w-3 mr-1" />
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                <div className="flex space-x-2">
                  {artist.instagramurl && (
                    <a
                      href={artist.instagramurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-pink-600 transition-colors"
                      title="Instagram"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                  )}
                  {artist.youtubeurl && (
                    <a
                      href={artist.youtubeurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="YouTube"
                    >
                      <Youtube className="h-4 w-4" />
                    </a>
                  )}
                  {artist.spotifyurl && (
                    <a
                      href={artist.spotifyurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Spotify"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmar Exclusão
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja excluir este parceiro? Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="btn-outline"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="btn bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ArtistsPage;
