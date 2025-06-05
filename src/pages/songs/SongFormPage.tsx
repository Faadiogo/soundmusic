import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Music, ArrowLeft, Save, Trash2, Plus, Clock,
  Calendar, AlertCircle, Users, Pencil
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { GiCompactDisc } from 'react-icons/gi';

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

const genreOptions = ['Funk', 'Trap', 'Sertanejo', 'MPB', 'Pagode', 'Samba', 'Forró',
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
  const [, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

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

  // Calcula o percentual restante disponível para novo participante
  const getMaxRoyaltyForNew = () => {
    const used = collaborators.reduce((sum, c) => sum + c.royaltypercentage, 0) + distributorroyalty;
    return Math.max(1, 100 - used);
  };

  // Para edição de participantes
  const [editingCollaboratorId, setEditingCollaboratorId] = useState<string | null>(null);
  const [editingRoyalty, setEditingRoyalty] = useState<number>(0);

  const handleEditCollaborator = (collaborator: Collaborator) => {
    setEditingCollaboratorId(collaborator.id);
    setEditingRoyalty(collaborator.royaltypercentage);
  };

  const handleSaveEditCollaborator = (id: string) => {
    setCollaborators(collaborators.map(c =>
      c.id === id ? { ...c, royaltypercentage: editingRoyalty } : c
    ));
    setEditingCollaboratorId(null);
  };

  const handleRoyaltyInputChange = (value: number, max: number, setValueFn: (v: number) => void) => {
    if (value < 1) setValueFn(1);
    else if (value > max) setValueFn(max);
    else setValueFn(value);
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

  // Atualiza duração automaticamente ao carregar arquivo de áudio
  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'audio/wav') {
      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
      // Ler duração do arquivo
      const audio = document.createElement('audio');
      audio.src = URL.createObjectURL(file);
      audio.addEventListener('loadedmetadata', () => {
        if (!isNaN(audio.duration)) {
          setValue('duration', Math.floor(audio.duration));
        }
      });
    } else {
      setAudioFile(null);
      setAudioUrl(null);
      setValue('duration', 0);
      // Você pode exibir um erro se quiser
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="flex items-center mb-6">
        <Link to="/songs" className="mr-4">
          <ArrowLeft className="h-5 w-5 text-gray-500 hover:text-gray-700" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Music className="mr-2 h-8 w-8 text-yellow-500" />
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Informações da Música e Distribuição de Royalties */}
              <div className="md:col-span-2 flex flex-col gap-6">
                {/* Song Information */}
                <div>
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
                  </div>
                  <div className="form-group mt-4">
                    <label htmlFor="audiofile" className="label">Arquivo de Áudio (Apenas arquivos .WAV são suportados)</label>
                    {/* Nome do arquivo selecionado */}
                    {audioUrl && (
                      <div className="mb-1 text-sm text-gray-800 font-medium truncate max-w-full text-center w-full">{audioUrl && (typeof audioUrl === 'string' ? (audioUrl.startsWith('blob:') ? (document.getElementById('audiofile') as HTMLInputElement)?.files?.[0]?.name : audioUrl.split('/').pop()) : '')}</div>
                    )}
                    <div className="w-full flex flex-col items-center gap-2">
                      {/* Player de áudio */}
                      <div className="w-full md:w-4/5">
                        {audioUrl && (
                          <div className="rounded-lg shadow w-full border border-gray-200 bg-yellow-500 p-2">
                            <audio controls src={audioUrl} className="w-full bg-transparent">
                              Seu navegador não suporta o elemento de áudio.
                            </audio>
                          </div>
                        )}
                      </div>
                      {/* Botões de arquivo e duração */}
                      <div className="flex flex-row justify-center gap-4 w-full md:w-4/5 mt-2 items-center">
                        <label htmlFor="audiofile" className={`flex-1 block text-center px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-2
                          ${audioUrl ? 'border-2 border-blue-500 text-blue-600 bg-white hover:bg-blue-50' : 'border-2 border-blue-500 text-blue-600 bg-white hover:bg-blue-50'}
                          shadow`}>
                          <Pencil className="h-5 w-5" />
                          <span>{audioUrl ? 'Alterar arquivo' : 'Escolher arquivo'}</span>
                          <input
                            id="audiofile"
                            type="file"
                            accept=".wav,audio/wav"
                            className="hidden"
                            onChange={handleAudioFileChange}
                          />
                        </label>
                        {audioUrl && (
                          <button
                            type="button"
                            className="flex-1 px-4 py-2 rounded-lg border-2 border-red-400 text-red-600 bg-white hover:bg-red-50 flex items-center justify-center gap-2"
                            onClick={() => {
                              setAudioFile(null);
                              setAudioUrl(null);
                              setValue('duration', 0);
                              const input = document.getElementById('audiofile') as HTMLInputElement;
                              if (input) input.value = '';
                            }}
                          >
                            <Trash2 className="h-5 w-5" />
                            <span>Remover arquivo</span>
                          </button>
                        )}
                        {/* Campo de duração só aparece se houver arquivo */}
                        {audioUrl && (
                          <div className="flex-1 flex flex-col items-center">
                            <Controller
                              name="duration"
                              control={control}
                              rules={{ required: true }}
                              render={({ field: { onChange, value } }) => (
                                <div className="relative w-full">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Clock className="h-5 w-5 text-yellow-500" />
                                  </span>
                                  <input
                                    id="duration"
                                    type="text"
                                    className={`input pl-10 text-center ${errors.duration ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
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
                                </div>
                              )}
                            />
                            {errors.duration && <p className="mt-1 text-xs text-error-600">Duração é obrigatória (MM:SS format)</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Royalty Distribution */}
                <div className="flex flex-col gap-2">
                  <div className="border rounded-lg overflow-hidden mb-4">
                    <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-gray-900">Distribuição de Royalties</h2>
                      <button
                        type="button"
                        onClick={() => setShowAddCollaboratorModal(true)}
                        className={`py-1 px-2 text-sm flex items-center rounded font-semibold transition-colors
                          ${totalRoyalty >= 100
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'btn-primary'}
                        `}
                        disabled={totalRoyalty >= 100}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar Participante
                      </button>
                    </div>
                    <div className="divide-y divide-gray-200">
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="px-4 py-2 font-semibold text-gray-700">Participante</th>
                              <th className="px-4 py-2 font-semibold text-gray-700">Função</th>
                              <th className="px-4 py-2 font-semibold text-gray-700 text-center">Participação</th>
                              <th className="px-4 py-2 font-semibold text-gray-700 text-center">Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Linha fixa da distribuidora */}
                            <tr className="border-b">
                              <td className="px-4 py-2 flex items-center gap-2">
                                <GiCompactDisc className="h-5 w-5 text-yellow-500" />
                                <span className="font-medium text-gray-900">Distribuidora</span>
                              </td>
                              <td className="px-4 py-2 text-gray-600">Distribuidora</td>
                              <td className="px-4 py-2 text-center">
                                <span className="text-sm font-medium">{distributorroyalty}%</span>
                              </td>
                              <td className="px-4 py-2 text-center text-gray-400">—</td>
                            </tr>
                            {collaborators.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="p-4 text-center text-gray-500 italic">Nenhum participante adicionado ainda.</td>
                              </tr>
                            ) : (
                              collaborators.map((collaborator) => (
                                <tr key={collaborator.id} className="border-b last:border-b-0">
                                  <td className="px-4 py-2 flex items-center gap-2">
                                    <Users className="h-5 w-5 text-yellow-500" />
                                    <span className="font-medium text-gray-900">{collaborator.artistName}</span>
                                  </td>
                                  <td className="px-4 py-2 text-gray-600">{collaborator.role}</td>
                                  <td className="px-4 py-2 text-center">
                                    {editingCollaboratorId === collaborator.id ? (
                                      <div className="flex items-center gap-2 justify-center">
                                        <input
                                          type="range"
                                          min={1}
                                          max={
                                            Math.max(1, 100 - distributorroyalty - collaborators.filter(c => c.id !== collaborator.id).reduce((sum, c) => sum + c.royaltypercentage, 0))
                                          }
                                          step={1}
                                          value={editingRoyalty}
                                          onChange={e => setEditingRoyalty(Number(e.target.value))}
                                        />
                                        <input
                                          type="number"
                                          min={1}
                                          max={
                                            Math.max(1, 100 - distributorroyalty - collaborators.filter(c => c.id !== collaborator.id).reduce((sum, c) => sum + c.royaltypercentage, 0))
                                          }
                                          className="input w-16 text-center"
                                          value={editingRoyalty}
                                          onChange={e => handleRoyaltyInputChange(Number(e.target.value), Math.max(1, 100 - distributorroyalty - collaborators.filter(c => c.id !== collaborator.id).reduce((sum, c) => sum + c.royaltypercentage, 0)), setEditingRoyalty)}
                                        />
                                        <button
                                          type="button"
                                          className="btn-primary px-2 py-1 text-xs"
                                          onClick={() => handleSaveEditCollaborator(collaborator.id)}
                                        >Salvar</button>
                                        <button
                                          type="button"
                                          className="btn-outline px-2 py-1 text-xs"
                                          onClick={() => setEditingCollaboratorId(null)}
                                        >Cancelar</button>
                                      </div>
                                    ) : (
                                      <span className="text-sm font-medium">{collaborator.royaltypercentage}%</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-2 text-center">
                                    {editingCollaboratorId !== collaborator.id && (
                                      <div className="flex items-center justify-center gap-2">
                                        <button
                                          type="button"
                                          className="p-1 text-yellow-500 hover:bg-yellow-50 rounded-full"
                                          title="Editar"
                                          onClick={() => handleEditCollaborator(collaborator)}
                                        >
                                          <Pencil className="h-5 w-5" />
                                        </button>
                                        <button
                                          type="button"
                                          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                                          title="Excluir"
                                          onClick={() => handleRemoveCollaborator(collaborator.id)}
                                        >
                                          <Trash2 className="h-5 w-5" />
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan={4} className="px-4 py-3 bg-gray-50 text-center">
                                <span className="font-extrabold text-black">Total distribuído: </span>
                                <span className={`text-lg font-extrabold ${totalRoyalty === 100 ? 'text-green-600' : 'text-red-600'}`}>{totalRoyalty}%</span>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Letra na terceira coluna */}
              <div className="form-group md:col-span-1">
                <div className="form-group">
                  <label htmlFor="releasedate" className="label required-field">Data de criação</label>
                  <div className="flex items-center">
                    <div className="absolute pl-3 pointer-events-none">
                      <Calendar className="h-5 w-5 text-yellow-500" />
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
                <label htmlFor="lyrics" className="label">Letra</label>
                <textarea
                  id="lyrics"
                  rows={19}
                  className="input"
                  placeholder="Digite a letra completa da música aquí..."
                  {...register('lyrics')}
                ></textarea>
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
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Users className="h-6 w-6 text-yellow-500" />
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
                          onChange={(e) => setNewCollaborator({ ...newCollaborator, artistid: e.target.value })}
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
                          onChange={(e) => setNewCollaborator({ ...newCollaborator, role: e.target.value })}
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
                        </div>
                        <div className="grid grid-cols-5 gap-2 items-center">
                          <div className="col-span-4 relative">
                            <input
                              type="range"
                              id="royaltypercentage"
                              min="1"
                              max={getMaxRoyaltyForNew()}
                              step="1"
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-0 focus:border-0"
                              style={{
                                background: `linear-gradient(to right, #facc15 0%, #facc15 ${(newCollaborator.royaltypercentage - 1) / (getMaxRoyaltyForNew() - 1) * 100}%, #e5e7eb ${(newCollaborator.royaltypercentage - 1) / (getMaxRoyaltyForNew() - 1) * 100}%, #e5e7eb 100%)`
                              }}
                              value={newCollaborator.royaltypercentage}
                              onChange={(e) => setNewCollaborator({
                                ...newCollaborator,
                                royaltypercentage: parseInt(e.target.value)
                              })}
                            />
                            <style>{`
                              input[type='range']::-webkit-slider-thumb {
                                background: #facc15;
                                border: 2px solid #facc15;
                                height: 20px;
                                width: 20px;
                                border-radius: 50%;
                                box-shadow: 0 0 2px #888;
                                cursor: pointer;
                                -webkit-appearance: none;
                                appearance: none;
                              }
                              input[type='range']::-moz-range-thumb {
                                background: #facc15;
                                border: 2px solid #facc15;
                                height: 20px;
                                width: 20px;
                                border-radius: 50%;
                                box-shadow: 0 0 2px #888;
                                cursor: pointer;
                              }
                              input[type='range']::-ms-thumb {
                                background: #facc15;
                                border: 2px solid #facc15;
                                height: 20px;
                                width: 20px;
                                border-radius: 50%;
                                box-shadow: 0 0 2px #888;
                                cursor: pointer;
                              }
                              input[type='range']:focus::-webkit-slider-thumb {
                                outline: none;
                                box-shadow: 0 0 0 3px #fde68a;
                              }
                              input[type='range']:focus::-moz-range-thumb {
                                outline: none;
                                box-shadow: 0 0 0 3px #fde68a;
                              }
                              input[type='range']:focus::-ms-thumb {
                                outline: none;
                                box-shadow: 0 0 0 3px #fde68a;
                              }
                            `}</style>
                            <div className="flex justify-between text-xs text-gray-500 mt-1 w-full absolute left-0 -bottom-5">
                              <span>1%</span>
                              <span>{getMaxRoyaltyForNew()}%</span>
                            </div>
                          </div>
                          <div className="col-span-1 flex items-center relative">
                            <input
                              type="number"
                              min={1}
                              max={getMaxRoyaltyForNew()}
                              className="input w-full text-center pr-4"
                              value={newCollaborator.royaltypercentage}
                              onChange={e => handleRoyaltyInputChange(Number(e.target.value), getMaxRoyaltyForNew(), (v) => setNewCollaborator({ ...newCollaborator, royaltypercentage: v }))}
                            />
                            <span className="absolute right-3 text-gray-600 select-none pointer-events-none">%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-500 text-base font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddCollaborator}
                  disabled={!newCollaborator.artistid || newCollaborator.royaltypercentage <= 0}
                >
                  Adicionar
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-black hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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