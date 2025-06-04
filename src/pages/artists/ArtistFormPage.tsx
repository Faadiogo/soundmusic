import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Users, ArrowLeft, Save, Trash2, Instagram, Youtube, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm, SubmitHandler } from 'react-hook-form';
import InputMask from 'react-input-mask';
import { FaSpotify, FaTiktok } from "react-icons/fa";

// Form types
interface ArtistForm {
  name: string;
  artisticname: string;
  birthdate: string;
  cpf: string;
  soundonemail: string;
  onerpmemail: string;
  spotifylink: string;
  youtubelink: string;
  tiktoklink: string;
  instagramlink: string;
}

const ArtistFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { supabase, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ArtistForm>();

  useEffect(() => {
    if (isEditMode) {
      fetchArtist();
    }
  }, [id]);

  const fetchArtist = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setValue('name', data.name);
        setValue('artisticname', data.artisticname);
        setValue('birthdate', formatDateForInput(data.birthdate));
        setValue('cpf', data.cpf);
        setValue('soundonemail', data.soundonemail || '');
        setValue('onerpmemail', data.onerpmemail || '');
        setValue('spotifylink', data.spotifylink || '');
        setValue('youtubelink', data.youtubelink || '');
        setValue('tiktoklink', data.tiktoklink || '');
        setValue('instagramlink', data.instagramlink || '');
      }
    } catch (error) {
      console.error('Erro ao buscar artista:', error);
      setError('Falha ao carregar os dados do artista');;
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const onSubmit: SubmitHandler<ArtistForm> = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const artistData = {
        ...data,
        userid: user?.id,
        soundonemail: data.soundonemail || null,
        onerpmemail: data.onerpmemail || null,
        spotifylink: data.spotifylink || null,
        youtubelink: data.youtubelink || null,
        tiktoklink: data.tiktoklink || null,
        instagramlink: data.instagramlink || null
      };
      
      if (isEditMode) {
        // Update existing artist
        const { error } = await supabase
          .from('artists')
          .update(artistData)
          .eq('id', id);
          
        if (error) throw error;
      } else {
        // Create new artist
        const { error } = await supabase
          .from('artists')
          .insert([artistData]);
          
        if (error) throw error;
      }
      
      navigate('/artists');
    } catch (error) {
      console.error('Erro ao salvar artista:', error);
      setError('Falha ao salvar os dados do artista');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      
      // Check if artist has songs
      const { count, error: countError } = await supabase
        .from('song_collaborators')
        .select('*', { count: 'exact', head: true })
        .eq('artistId', id);
        
      if (countError) throw countError;
      
      if (count && count > 0) {
        setError(`Não é possível excluir o artista pois ele está associado a ${count} música(s). Remova o artista de todas as músicas antes.`);      
        setShowDeleteModal(false);
        return;
      }
      
      // Delete the artist
      const { error } = await supabase
        .from('artists')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      navigate('/artists');
    } catch (error) {
      console.error('Erro ao excluir artista:', error);
      setError('Falha ao excluir o artista');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="flex items-center mb-6">
        <Link to="/artists" className="mr-4">
          <ArrowLeft className="h-5 w-5 text-gray-500 hover:text-gray-700" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Users className="mr-2 h-8 w-8 text-primary-600" />
          {isEditMode ? 'Editar Artista' : 'Cadastrar novo artista'}
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
              {/* Personal Information */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="name" className="label required-field">Nome completo</label>
                    <input
                      id="name"
                      type="text"
                      className={`input ${errors.name ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                      placeholder="Fulano da Silva Souza"
                      {...register('name', { required: true })}
                    />
                    {errors.name && <p className="mt-1 text-sm text-error-600">Nome completo é um campo obrigatório</p>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="artisticname" className="label required-field">Nome artístico</label>
                    <input
                      id="artisticname"
                      type="text"
                      className={`input ${errors.artisticname ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                      placeholder="MC Fulano"
                      {...register('artisticname', { required: true })}
                    />
                    {errors.artisticname && <p className="mt-1 text-sm text-error-600">Nome artístico é um campo obrigatório</p>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="birthdate" className="label required-field">Data de Nascimento</label>
                    <input
                      id="birthdate"
                      type="date"
                      className={`input ${errors.birthdate ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                      {...register('birthdate', { required: true })}
                    />
                    {errors.birthdate && <p className="mt-1 text-sm text-error-600">Data de Nascimento é um campo obrigatório</p>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cpf" className="label required-field">CPF</label>
                    <InputMask
                      mask="999.999.999-99"
                      alwaysShowMask
                      maskChar={null}
                      {...register('cpf', {
                        required: true,
                        pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
                      })}
                    >
                      <input
                        id="cpf"
                        type="text"
                        className={`input ${errors.cpf ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                        placeholder="CPF"
                      />
                    </InputMask>
                    {errors.cpf?.type === 'required' && <p className="mt-1 text-sm text-error-600">CPF é um campo obrigatório</p>}                    
                  </div>
                </div>
              </div>
              
              {/* Distribution Information */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Outras informações</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="soundonemail" className="label">SoundOn Email</label>
                    <input
                      id="soundonemail"
                      type="email"
                      className="input"
                      placeholder="mc.fulano@soundon.com"
                      {...register('soundonemail')}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="onerpmemail" className="label">OneRPM Email</label>
                    <input
                      id="onerpmemail"
                      type="email"
                      className="input"
                      placeholder="mc.fulano@onerpm.com"
                      {...register('onerpmemail')}
                    />
                  </div>
                </div>
              </div>
              
              {/* Social Media */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Mídias Sociais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="spotifylink" className="label flex items-center">
                      <FaSpotify className="h-4 w-4 mr-1 text-[#1DB954]" />
                      Link da conta do Spotify
                    </label>
                    <input
                      id="spotifylink"
                      type="url"
                      className="input"
                      placeholder="https://spotify.com/artista/..."
                      {...register('spotifylink')}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="youtubelink" className="label flex items-center">
                      <Youtube className="h-4 w-4 mr-1 text-[#FF0000]" />
                      Link da conta do YouTube
                    </label>
                    <input
                      id="youtubelink"
                      type="url"
                      className="input"
                      placeholder="https://youtube.com/..."
                      {...register('youtubelink')}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="tiktoklink" className="label flex items-center">
                      <FaTiktok className="h-4 w-4 mr-1 text-[#000000]" />
                      Link da conta do TikTok
                    </label>
                    <input
                      id="tiktoklink"
                      type="url"
                      className="input"
                      placeholder="https://tiktok.com/@..."
                      {...register('tiktoklink')}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="instagramlink" className="label flex items-center">
                      <Instagram className="h-4 w-4 mr-1 text-[#E1306C]" />
                      Link da conta do Instagram
                    </label>
                    <input
                      id="instagramlink"
                      type="url"
                      className="input"
                      placeholder="https://instagram.com/..."
                      {...register('instagramlink')}
                    />
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
                  Excluir Artista
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <Link
                to="/artists"
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
                    {isEditMode ? 'Atualizar Artista' : 'Salvar Artista'}
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Excluir Artista</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this artist? This action cannot be undone.
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
                  Delete
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

export default ArtistFormPage;
