
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Music, Users, TrendingUp, DollarSign, 
  Plus
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

// Types
interface Artist {
  id: string;
  name: string;
  artisticname: string;
  songsCount: number;
  listeners: number;
}

interface Song {
  id: string;
  title: string;
  genre: string;
  releasedate: string;
  streams: number;
  revenue: number;
  
}

interface SongRevenue {
  name: string;
  value: number;
}

const Dashboard = () => {
  const { supabase, user } = useAuth();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  // Sample data for charts (to be replaced with real data from Supabase)
  const revenueData = [
    { month: 'Jan', revenue: 4200 },
    { month: 'Fev', revenue: 9300 },
    { month: 'Mar', revenue: 2800 },
    { month: 'Abr', revenue: 9800 },
    { month: 'Mai', revenue: 8200 },
    { month: 'Jun', revenue: 15300 },
  ];

  const songRevenueData: SongRevenue[] = [
    { name: 'Rabetão..', value: 15000 },
    { name: 'Cada vez mais..', value: 5800 },
    { name: 'Deixa eu mandar..', value: 7200 },
    { name: 'Outras', value: 21700 },
  ];

  const streamsData = [
    { month: 'Jan', streams: 15000 },
    { month: 'Fev', streams: 23000 },
    { month: 'Mar', streams: 18000 },
    { month: 'Abr', streams: 28000 },
    { month: 'Mai', streams: 32000 },
    { month: 'Jun', streams: 25000 },
  ];

  const COLORS = ['#5D3FD3', '#FF007F', '#20B2AA', '#FFA500', '#6C757D'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch artists
        const { data: artistsData, error: artistsError } = await supabase
          .from('artists')
          .select('*')
          .eq('userid', user?.id);
          
        if (artistsError) throw artistsError;
        
        // Fetch songs
        const { data: songsData, error: songsError } = await supabase
          .from('songs')
          .select('*')
          .eq('userid', user?.id)
          .order('releasedate', { ascending: false });
          
        if (songsError) throw songsError;
        
        // Transform and set data
        setArtists(artistsData || []);
        setSongs(songsData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, user]);

  // We'll use this mock data until we connect to Supabase
  const mockArtists: Artist[] = [
    { id: '1', name: 'MC Pogba', artisticname:'MC Pogba', listeners: 18200, songsCount: 38 },
    { id: '2', name: 'MC D\'lara', artisticname:'MC D\'lara', listeners: 1900, songsCount: 15 },
    { id: '3', name: 'DJ Tchouzen', artisticname:'DJ Tchouzen', listeners: 5600, songsCount: 12 },
    { id: '4', name: 'MC Fulano', artisticname:'MC Fulano', listeners: 8780, songsCount: 18 },
    { id: '5', name: 'DJ Beltrano', artisticname:'DJ Beeltrano', listeners: 4250, songsCount: 25 },
    { id: '6', name: 'Ciclano SP', artisticname:'Ciclano SP', listeners: 12560, songsCount: 45 },
  ];

  const sortedArtists = [...mockArtists].sort((a, b) => b.listeners - a.listeners);

  const mockSongs: Song[] = [
    { id: '1', title: 'Summer Vibes', genre: 'Pop', releasedate: '2025-01-15', streams: 125000, revenue: 2500 },
    { id: '2', title: 'Midnight Glow', genre: 'R&B', releasedate: '2025-02-28', streams: 98000, revenue: 1800 },
    { id: '3', title: 'Echoes', genre: 'Electronic', releasedate: '2025-03-10', streams: 76000, revenue: 1200 },
    { id: '4', title: 'Forever', genre: 'Hip Hop', releasedate: '2025-04-05', streams: 54000, revenue: 800 },
  ];

  return (
    <div className="page-container">
      <div className="flex flex-col lg:flex-row justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <div className="mt-4 lg:mt-0 flex space-x-3">
          <Link to="/artists/new" className="btn-primary flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Novo Artista
          </Link>
          <Link to="/songs/new" className="btn-secondary flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Nova Música
          </Link>
        </div>
      </div>


      {/* Quick stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

        <div className="card p-5">
          <div className="flex items-center mb-1">
            <div className="rounded-full p-2 bg-secondary-100 mr-3">
              <Users className="w-5 h-5 text-secondary-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Artistas Cadastrados</span>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-gray-900">{loading ? '-' : artists.length || mockArtists.length}</p>
            <span className="text-lg font-medium text-success-600 bg-success-50 py-1 px-2 rounded-full">+1 este mês</span>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center mb-1">
            <div className="rounded-full p-2 bg-accent-100 mr-3">
              <TrendingUp className="w-5 h-5 text-accent-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Reproduções Mês atual</span>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-gray-900">25.498</p>
            <span className="text-lg font-medium text-success-600 bg-success-50 py-1 px-2 rounded-full">+12% vs último mês</span>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center mb-1">
            <div className="rounded-full p-2 bg-accent-100 mr-3">
              <TrendingUp className="w-5 h-5 text-accent-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Total de Reproduções</span>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-gray-900">1.825.498</p>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center mb-1">
            <div className="rounded-full p-2 bg-primary-100 mr-3">
              <Music className="w-5 h-5 text-primary-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Total de Músicas</span>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-gray-900">{loading ? '-' : songs.length || mockSongs.length}</p>
            <span className="text-lg font-medium text-success-600 bg-success-50 py-1 px-2 rounded-full">+2 este mês</span>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center mb-1">
            <div className="rounded-full p-2 bg-success-100 mr-3">
              <DollarSign className="w-5 h-5 text-success-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Receita Mês atual</span>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-gray-900">R$ 29.253,73</p>
            <span className="text-lg font-medium text-success-600 bg-success-50 py-1 px-2 rounded-full">+8% vs último mês</span>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center mb-1">
            <div className="rounded-full p-2 bg-success-100 mr-3">
              <DollarSign className="w-5 h-5 text-success-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Receita Total</span>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-gray-900">R$ 1.629.248,14</p>
          </div>
        </div>

      </div>

      {/* Seção de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-8">
        {/* Gráfico de Pizza: Receita por Música */}
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Receita por Música</h3>
          </div>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={songRevenueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {songRevenueData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`R$ ${value}`, 'Receita']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Gráfico de Linha: Receita Mensal */}
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Receita Mensal</h3>
            <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
              <option>Último mês</option>
              <option>Últimos 6 meses</option>              
              <option>Último ano</option>
              <option>Todo o período</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value}`, 'Receita']} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#5D3FD3" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Linha: OUVINTES Mensal */}
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Ouvintes Mensais</h3>
            <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
              <option>Último mês</option>
              <option>Últimos 6 meses</option>              
              <option>Último ano</option>
              <option>Todo o período</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={streamsData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}`, 'Ouvintes']} />
                <Line 
                  type="monotone" 
                  dataKey="streams" 
                  stroke="#5D3FD3" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Gráfico de Linha: Receita Mensal */}
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Artista Mais Ouvido</h3>
            <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
              <option>Último mês</option>
              <option>Últimos 6 meses</option>              
              <option>Último ano</option>
              <option>Todo o período</option>
            </select>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sortedArtists} margin={{ top: 5, right: 5, left: 22, bottom: 5 }}>
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip formatter={(value) => [`${value}`, 'Ouvintes']} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
