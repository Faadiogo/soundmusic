
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Music, ArrowLeft, Save, Trash2, Plus, X, Clock, 
  Calendar, AlertCircle, DollarSign, Users
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

// Types
interface Artist {
  id: string;
  name: string;
  artisticname: string;
}

interface Collaborator {
  id: string;
  artistid: string;
  artistName: string;
  role: string;
  royaltypercentage: number;
}

interface SongForm {
  title: string;
  genre: string;
  lyrics: string;
  duration: number;
  audiourl: string;
  releasedate: string;
  distributorroyalty: number;
}

const collaboratorRoles = [
  'Vocalista', 'Produtor', 'Compositor de Letras', 'Compositor Musical',
  'Instrumentista', 'Artista Convidado', 'Mixador', 'Engenheiro de Som'
];

const genreOptions = [ 'Funk', 'Trap', 'Sertanejo', 'MPB', 'Pagode', 'Samba', 'Forró',
  'Pop', 'Hip Hop', 'R&B', 'Eletrônica', 'Rock', 'Country',
  'Jazz', 'Clássica', 'Folk', 'Reggae', 'Latina', 'Metal', 'Outro'
];


const SongFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { supabase, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddCollaboratorModal, setShowAddCollaboratorModal] = useState(false);
  const [newCollaborator, setNewCollaborator] = useState({
    artistid: '',
    role: 'Vocalista',
    royaltypercentage: 0
  });
  const [totalRoyalty, setTotalRoyalty] = useState(0);
  
  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm<SongForm>({
    defaultValues: {
      distributorroyalty: 40,
    }
  });

  const distributorroyalty = 40;

  useEffect(() => {
    fetchArtists();
    if (isEditMode) {
      fetchSong();
    }
  }, [id]);

  useEffect(() => {
    // Calculate total royalty percentage
    const artistsTotal = collaborators.reduce((sum, c) => sum + c.royaltypercentage, 0);
    setTotalRoyalty(artistsTotal + distributorroyalty);
  }, [collaborators, distributorroyalty]);

  const fetchArtists = async () => {
    try {
      const { data, error } = await supabase
        .from('artists')
        .select('id, name, artisticname')
        .order('artisticname');
        
      if (error) throw error;
      
      if (data) {
        setArtists(data);
      }
    } catch (error) {
      console.error('Erro ao buscar artistas:', error);
    }
  };

  const fetchSong = async () => {
    try {
      setLoading(true);
      
      // Fetch song details
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setValue('title', data.title);
        setValue('genre', data.genre);
        setValue('lyrics', data.lyrics || '');
        setValue('duration', data.duration);
        setValue('audiourl', data.audiourl || '');
        setValue('releasedate', formatDateForInput(data.releasedate));
        setValue('distributorroyalty', data.distributorroyalty);
        
        // Fetch collaborators
        const { data: collaboratorsData, error: collaboratorsError } = await supabase
          .from('song_collaborators')
          .select(`
            id,
            artistid,
            role,
            royaltypercentage,
            artists:artistid (
              artisticname
            )
          `)
          .eq('songid', id);
          
        if (collaboratorsError) throw collaboratorsError;
        
        if (collaboratorsData) {
          const formattedCollaborators = collaboratorsData.map((item: any) => ({
            id: item.id,
            artistid: item.artistid,
            artistName: item.artists.artisticname,
            role: item.role,
            royaltypercentage: item.royaltypercentage
          }));
          
          setCollaborators(formattedCollaborators);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar música:', error);
      setError('Não foi possível carregar os dados da música');
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const convertTimeToSeconds = (timeString: string): number => {
    const [minutes, seconds] = timeString.split(':').map(part => parseInt(part, 10));
    return (minutes * 60) + seconds;
  };

  const formatTimeFromSeconds = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAddCollaborator = () => {
    if (!newCollaborator.artistid) {
      return;
    }

    // Find the artist name
    const artist = artists.find(a => a.id === newCollaborator.artistid);
    if (!artist) return;

    // Check if the artist is already added
    if (collaborators.some(c => c.artistid === newCollaborator.artistid)) {
      setError('Este artista já é um participante');
      return;
    }

    const newCollaboratorEntry: Collaborator = {
      id: `temp-${Date.now()}`,
      artistid: newCollaborator.artistid,
      artistName: artist.artisticname,
      role: newCollaborator.role,
      royaltypercentage: newCollaborator.royaltypercentage
    };

    setCollaborators([...collaborators, newCollaboratorEntry]);
    
    // Reset the form
    setNewCollaborator({
      artistid: '',
      role: 'Vocalist',
      royaltypercentage: 0
    });
    
    setShowAddCollaboratorModal(false);
  };

  const handleRemoveCollaborator = (id: string) => {
    setCollaborators(collaborators.filter(c => c.id !== id));
  };

  const onSubmit: SubmitHandler<SongForm> = async (data) => {
    try {
      setLoading(true);
      setError(null);

      // Validate royalty percentages
      if (totalRoyalty !== 100) {
        setError(`O total de royalties deve ser igual a 100%. Total atual: ${totalRoyalty}%`);
        setLoading(false);
        return;
      }      

      if (collaborators.length === 0) {
        setError('Você deve adicionar pelo menos um participante');
        setLoading(false);
        return;
      }
      
      const songData = {
        ...data,
        userid: user?.id,
        streams: 0,
        revenue: 0,
        audiourl: data.audiourl || null,
      };
      
      let songId;
      
      if (isEditMode) {
        // Update existing song
        const { error } = await supabase
          .from('songs')
          .update(songData)
          .eq('id', id);
          
        if (error) throw error;
        songId = id;
        
        // Delete existing collaborators
        const { error: deleteError } = await supabase
          .from('song_collaborators')
          .delete()
          .eq('songid', id);
          
        if (deleteError) throw deleteError;
      } else {
        // Create new song
        const { data: newSong, error } = await supabase
          .from('songs')
          .insert([songData])
          .select();
          
        if (error) throw error;
        songId = newSong?.[0].id;
      }
      
      // Add collaborators
      if (songId) {
        const collaboratorRecords = collaborators.map(c => ({
          songid: songId,
          artistid: c.artistid,
          role: c.role,
          royaltypercentage: c.royaltypercentage
        }));
        
        const { error: collaboratorError } = await supabase
          .from('song_collaborators')
          .insert(collaboratorRecords);
          
        if (collaboratorError) throw collaboratorError;
      }
      
      navigate('/songs');
    } catch (error) {
      console.error('Erro ao salvar a música:', error);
      setError('Não foi possível salvar os dados da música');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      
      // Delete the song (cascade will handle collaborators)
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      navigate('/songs');
    } catch (error) {
      console.error('Erro ao deletar a música:', error);
      setError('Não foi possível excluir a música');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="flex items-center mb-6">
        <Link to="/songs" className="mr-4">
          <ArrowLeft className="h-5 w-5 text-gray-500 hover:text-gray-700" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Music className="mr-2 h-8 w-8 text-primary-600" />
          {isEditMode ? 'Editar informações da música' : 'Lançar nova música'}
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-md bg-error-50 text-error-800 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-error-500" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Song Information */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações da Música</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="title" className="label required-field">Título</label>
                    <input
                      id="title"
                      type="text"
                      className={`input ${errors.title ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                      placeholder="Nome da música"
                      {...register('title', { required: true })}
                    />
                    {errors.title && <p className="mt-1 text-sm text-error-600">Título é obrigatório</p>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="genre" className="label required-field">Gênero</label>
                    <select
                      id="genre"
                      className={`input ${errors.genre ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                      {...register('genre', { required: true })}
                    >
                      <option value="">Selecione um gênero</option>
                      {genreOptions.map((genre) => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                    {errors.genre && <p className="mt-1 text-sm text-error-600">Gênero é obrigatório</p>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="duration" className="label required-field">Duração (MM:SS)</label>
                    <div className="flex items-center">
                      <div className="absolute pl-3 pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Controller
                        name="duration"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                          <input
                            id="duration"
                            type="text"
                            className={`input pl-10 ${errors.duration ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                            placeholder="3:30"
                            value={value ? formatTimeFromSeconds(value) : ''}
                            onChange={(e) => {
                              const timePattern = /^(\d+):([0-5]\d)$/;
                              if (timePattern.test(e.target.value) || e.target.value === '') {
                                if (e.target.value === '') {
                                  onChange(0);
                                } else {
                                  onChange(convertTimeToSeconds(e.target.value));
                                }
                              }
                            }}
                          />
                        )}
                      />
                    </div>
                    {errors.duration && <p className="mt-1 text-sm text-error-600">Duration é obrigatório (MM:SS format)</p>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="releasedate" className="label required-field">Data de criação</label>
                    <div className="flex items-center">
                      <div className="absolute pl-3 pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="releasedate"
                        type="date"
                        className={`input pl-10 ${errors.releasedate ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                        {...register('releasedate', { required: true })}
                      />
                    </div>
                    {errors.releasedate && <p className="mt-1 text-sm text-error-600">Data de criação é obrigatório</p>}
                  </div>
                </div>
                
                <div className="form-group mt-4">
                  <label htmlFor="audiourl" className="label">URL do Áudio</label>
                  <input
                    id="audiourl"
                    type="url"
                    className="input"
                    placeholder="https://exemplo.com/audio.mp3"
                    {...register('audiourl')}
                  />
                  <p className="mt-1 text-sm text-gray-500">Cole o link do seu arquivo de áudio</p>
                </div>

                
                <div className="form-group mt-4">
                  <label htmlFor="lyrics" className="label">Letra</label>
                  <textarea
                    id="lyrics"
                    rows={6}
                    className="input"
                    placeholder="Digite a letra completa da música aquí..."
                    {...register('lyrics')}
                  ></textarea>
                </div>
              </div>
              
              {/* Royalty Distribution */}
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Distribuição de Royalties</h2>
                  <div className="flex items-center space-x-1 text-sm">
                    <span className="font-medium">Total:</span>
                    <span className={totalRoyalty === 100 ? 'text-success-600' : 'text-error-600'}>
                      {totalRoyalty}%
                    </span>
                    <span className="text-gray-500">(O total da distribuição precisa ser igual a 100%)</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="distributorroyalty" className="label">
                      <div className="flex items-center">
                        <DollarSign className="h-6 w-6 mr-1 text-gray-500" />
                        Distribuição (%)
                      </div>
                    </label>
                    <span className="text-lg font-medium">40%</span>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden mb-4">
                  <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-700">Participantes</h3>
                    <button
                      type="button"
                      onClick={() => setShowAddCollaboratorModal(true)}
                      className="btn-primary py-1 px-2 text-sm flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar Participante
                    </button>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {collaborators.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 italic">
                        Nenhum participante adicionado ainda.
                      </div>
                    ) : (
                      collaborators.map((collaborator) => (
                        <div key={collaborator.id} className="p-4 flex items-center justify-between">
                          <div>
                            <div className="flex items-center">
                              <Users className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="font-medium text-gray-900">{collaborator.artistName}</span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              Função: {collaborator.role}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium">
                              {collaborator.royaltypercentage}%
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCollaborator(collaborator.id)}
                              className="text-gray-400 hover:text-error-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
            <div>
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="btn border border-error-300 bg-white text-error-700 hover:bg-error-50 flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir Música
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <Link
                to="/songs"
                className="btn-outline"
              >
                Cancelar
              </Link>
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
                    {isEditMode ? 'Salvar Música' : 'Salvar Música'}
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Add Collaborator Modal */}
      {showAddCollaboratorModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Adicionar participante</h3>
                    <div className="mt-4">
                      <div className="mb-4">
                        <label htmlFor="artistid" className="label required-field">Selecione o artísta</label>
                        <select
                          id="artistid"
                          className="input"
                          value={newCollaborator.artistid}
                          onChange={(e) => setNewCollaborator({...newCollaborator, artistid: e.target.value})}
                          required
                        >
                          <option value="">Listar Parceiros</option>
                          {artists.map((artist) => (
                            <option key={artist.id} value={artist.id}>
                              {artist.artisticname} ({artist.name})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="role" className="label required-field">Função</label>
                        <select
                          id="role"
                          className="input"
                          value={newCollaborator.role}
                          onChange={(e) => setNewCollaborator({...newCollaborator, role: e.target.value})}
                          required
                        >
                          {collaboratorRoles.map((role) => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <label htmlFor="royaltypercentage" className="label required-field">Percentual de participação</label>
                          <span className="text-sm font-medium">{newCollaborator.royaltypercentage}%</span>
                        </div>
                        <input
                          type="range"
                          id="royaltypercentage"
                          min="1"
                          max="60"
                          step="1"
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          value={newCollaborator.royaltypercentage}
                          onChange={(e) => setNewCollaborator({
                            ...newCollaborator, 
                            royaltypercentage: parseInt(e.target.value)
                          })}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>1%</span>
                          <span>60%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddCollaborator}
                  disabled={!newCollaborator.artistid || newCollaborator.royaltypercentage <= 0}
                >
                  Adicionar
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowAddCollaboratorModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-error-600 text-base font-medium text-white hover:bg-error-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
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

export default SongFormPage;
