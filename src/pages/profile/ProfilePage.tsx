import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Save, Mail, Key, AlertCircle } from 'lucide-react';

const ProfilePage = () => {
  const { user, supabase } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    fullName: '',
    email: user?.email || '',
  });
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setProfile({
          ...profile,
          username: data.username || '',
          fullName: data.full_name || '',
        });
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword({ ...password, [name]: value });
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);
    
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          username: profile.username,
          full_name: profile.fullName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setProfileSuccess('Perfil atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setProfileError('Falha ao atualizar o perfil');      
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    
    // Validate passwords
    if (password.new !== password.confirm) {
      setPasswordError('As novas senhas não coincidem');
      return;
    }
    
    if (password.new.length < 6) {
      setPasswordError('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: password.new
      });
      
      if (error) throw error;
      
      // Clear password fields
      setPassword({
        current: '',
        new: '',
        confirm: '',
      });
      
      setPasswordSuccess('Senha atualizada com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      setPasswordError('Falha ao atualizar a senha');      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="flex items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <User className="mr-2 h-8 w-8 text-primary-600" />
            Perfil
          </h1>
          <p className="text-gray-600 mt-1">Edite as informções do seu perfil</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Informações do usuário</h2>
            </div>
            
            {profileError && (
              <div className="mx-6 mt-4 p-3 bg-error-50 text-error-800 rounded-md flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-error-500" />
                {profileError}
              </div>
            )}
            
            {profileSuccess && (
              <div className="mx-6 mt-4 p-3 bg-success-50 text-success-800 rounded-md">
                {profileSuccess}
              </div>
            )}
            
            <form onSubmit={updateProfile} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="username" className="label">Nome artístico</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="input"
                    value={profile.username}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="fullName" className="label">Nome completo</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="input"
                    value={profile.fullName}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="label">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="input pl-10"
                    value={profile.email}
                    disabled
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  O email é utilizado para login e não pode ser alterado
                </p>
              </div>
              
              <div>
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
                      Salvar alterações
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Change Senha */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Alteração de senha</h2>
            </div>
            
            {passwordError && (
              <div className="mx-6 mt-4 p-3 bg-error-50 text-error-800 rounded-md flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-error-500" />
                {passwordError}
              </div>
            )}
            
            {passwordSuccess && (
              <div className="mx-6 mt-4 p-3 bg-success-50 text-success-800 rounded-md">
                {passwordSuccess}
              </div>
            )}
            
            <form onSubmit={updatePassword} className="p-6">
              <div className="mb-4">
                <label htmlFor="current" className="label">Current Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="current"
                    name="current"
                    className="input pl-10"
                    value={password.current}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="new" className="label">Nova Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="new"
                    name="new"
                    className="input pl-10"
                    value={password.new}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Senha precisa ter pelo menos 6 caracteres
                </p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirm" className="label">Confirmar Nova Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="confirm"
                    name="confirm"
                    className="input pl-10"
                    value={password.confirm}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Atualizando...' : 'Atualizar senha'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div>
          {/* Account Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Informações da conta</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {profile.fullName || user.email || 'User'}
                  </h3>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Detalhes da conta</h4>
                <div className="space-y-2">

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Conta criada em:</span>
                    <span className="text-sm font-medium text-gray-900">10 de Março de 2021</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Ultímo Login</span>
                    <span className="text-sm font-medium text-gray-900">Hoje</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Atividade da conta</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Artistas</span>
                    <span className="text-sm font-medium text-gray-900">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Músicas</span>
                    <span className="text-sm font-medium text-gray-900">295</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Receita Total</span>
                    <span className="text-sm font-medium text-gray-900">R$ 821.253,53</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;