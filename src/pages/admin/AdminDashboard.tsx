import { useState, useEffect } from 'react';
import { 
  Users, Music, Bell, ChevronRight, 
  Disc, Calendar, TrendingUp, DollarSign
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

// Types
interface Artist {
  id: string;
  name: string;
  artisticName: string;
  created_at: string;
}

interface Song {
  id: string;
  title: string;
  genre: string;
  releaseDate: string;
  streams: number;
  revenue: number;
}

interface Notification {
  id: string;
  type: 'new_artist' | 'new_song' | 'custom';
  title: string;
  content: string;
  date: string;
  read: boolean;
}

const AdminDashboard = () => {
  const { supabase } = useAuth();
  const [loading, setLoading] = useState(true);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [customMessage, setCustomMessage] = useState('');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [sendingNotification, setSendingNotification] = useState(false);

  // Sample data for charts (to be replaced with real data from Supabase)
  const revenueData = [
    { month: 'Jan', revenue: 3500 },
    { month: 'Feb', revenue: 4700 },
    { month: 'Mar', revenue: 3900 },
    { month: 'Apr', revenue: 5800 },
    { month: 'May', revenue: 7200 },
    { month: 'Jun', revenue: 6500 },
  ];

  const genreData = [
    { name: 'Pop', value: 35 },
    { name: 'Hip Hop', value: 25 },
    { name: 'R&B', value: 20 },
    { name: 'Electronic', value: 15 },
    { name: 'Other', value: 5 },
  ];

  const upcomingReleases = [
    { id: '1', title: 'New Horizons', artistName: 'JD Beats', releaseDate: '2025-07-15', progress: 75 },
    { id: '2', title: 'Midnight Dream', artistName: 'Marina', releaseDate: '2025-08-01', progress: 60 },
    { id: '3', title: 'Electric Waves', artistName: 'A.Smith', releaseDate: '2025-08-23', progress: 40 },
  ];

  const COLORS = ['#5D3FD3', '#FF007F', '#20B2AA', '#FFA500', '#6C757D'];

  // Mock notifications for development
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'new_artist',
      title: 'New Artist Registered',
      content: 'Maria Garcia (Marina) has registered as an artist.',
      date: '2025-06-05T14:32:00Z',
      read: false,
    },
    {
      id: '2',
      type: 'new_song',
      title: 'New Song Added',
      content: 'JD Beats uploaded a new song: "Summer Vibes".',
      date: '2025-06-02T09:15:00Z',
      read: true,
    },
    {
      id: '3',
      type: 'custom',
      title: 'Scheduled Maintenance',
      content: 'The platform will be under maintenance on June 10th from 2-4 AM UTC.',
      date: '2025-06-01T18:45:00Z',
      read: true,
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch artists
      const { data: artistsData, error: artistsError } = await supabase
        .from('artists')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (artistsError) throw artistsError;
      
      // Fetch songs
      const { data: songsData, error: songsError } = await supabase
        .from('songs')
        .select('*')
        .order('releaseDate', { ascending: false })
        .limit(5);
        
      if (songsError) throw songsError;
      
      // Fetch notifications (in a real app, this would be from a notifications table)
      // For now, we'll use mock data
      
      setArtists(artistsData || []);
      setSongs(songsData || []);
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!customMessage.trim()) return;
    
    try {
      setSendingNotification(true);
      
      // In a real app, this would insert into a notifications table
      // and potentially trigger a real-time event
      
      // Mock implementation
      const newNotification: Notification = {
        id: `temp-${Date.now()}`,
        type: 'custom',
        title: 'Admin Notification',
        content: customMessage,
        date: new Date().toISOString(),
        read: false,
      };
      
      setNotifications([newNotification, ...notifications]);
      setCustomMessage('');
      setShowNotificationModal(false);
    } catch (error) {
      console.error('Error sending notification:', error);
    } finally {
      setSendingNotification(false);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  return (
    <div className="page-container">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform overview and management</p>
        </div>
        <button 
          onClick={() => setShowNotificationModal(true)}
          className="btn-secondary"
        >
          <Bell className="w-4 h-4 mr-2" />
          Send Notification
        </button>
      </div>

      {/* Quick stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-5">
          <div className="flex items-center mb-1">
            <div className="rounded-full p-2 bg-primary-100 mr-3">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Total Artists</span>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-gray-900">{loading ? '-' : artists.length || 12}</p>
            <span className="text-xs font-medium text-success-600 bg-success-50 py-1 px-2 rounded-full">+3 this month</span>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center mb-1">
            <div className="rounded-full p-2 bg-secondary-100 mr-3">
              <Music className="w-5 h-5 text-secondary-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Total Songs</span>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-gray-900">{loading ? '-' : songs.length || 48}</p>
            <span className="text-xs font-medium text-success-600 bg-success-50 py-1 px-2 rounded-full">+15 this month</span>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center mb-1">
            <div className="rounded-full p-2 bg-accent-100 mr-3">
              <TrendingUp className="w-5 h-5 text-accent-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Total Streams</span>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-gray-900">985.4K</p>
            <span className="text-xs font-medium text-success-600 bg-success-50 py-1 px-2 rounded-full">+22% vs last month</span>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center mb-1">
            <div className="rounded-full p-2 bg-success-100 mr-3">
              <DollarSign className="w-5 h-5 text-success-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Total Revenue</span>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-gray-900">$12,356</p>
            <span className="text-xs font-medium text-success-600 bg-success-50 py-1 px-2 rounded-full">+18% vs last month</span>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Global Revenue Trends</h3>
            <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
              <option>Last 6 months</option>
              <option>Last year</option>
              <option>All time</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
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

        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Songs by Genre</h3>
          </div>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {genreData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent activity and notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="p-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Latest Notifications</h3>
          </div>
          <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-primary-50' : ''}`}
              >
                <div className="flex items-start">
                  <div className={`rounded-full p-2 mr-3 ${
                    notification.type === 'new_artist' ? 'bg-primary-100' : 
                    notification.type === 'new_song' ? 'bg-secondary-100' : 'bg-gray-100'
                  }`}>
                    {notification.type === 'new_artist' ? (
                      <Users className={`w-5 h-5 ${
                        notification.type === 'new_artist' ? 'text-primary-600' : 
                        notification.type === 'new_song' ? 'text-secondary-600' : 'text-gray-600'
                      }`} />
                    ) : notification.type === 'new_song' ? (
                      <Music className="w-5 h-5 text-secondary-600" />
                    ) : (
                      <Bell className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                      <span className="text-xs text-gray-500">
                        {format(new Date(notification.date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                    {!notification.read && (
                      <button 
                        onClick={() => markNotificationAsRead(notification.id)}
                        className="mt-2 text-xs font-medium text-primary-600 hover:text-primary-700"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="p-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Releases</h3>
          </div>
          <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
            {upcomingReleases.map((release) => (
              <div key={release.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-md bg-primary-100 flex items-center justify-center mr-3">
                    <Disc className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{release.title}</h4>
                        <p className="text-xs text-gray-500">by {release.artistName}</p>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">
                          {format(new Date(release.releaseDate), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full" 
                            style={{ width: `${release.progress}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs text-gray-500">{release.progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Artists and Songs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="p-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Recent Artists</h3>
            <a href="/admin/artists" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          <div className="divide-y divide-gray-200">
            {(loading ? [1, 2, 3, 4, 5] : artists.length ? artists : [1, 2, 3, 4, 5]).map((artist, index) => (
              <div key={typeof artist === 'number' ? index : artist.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    {typeof artist === 'number' ? (
                      <>
                        <h4 className="text-sm font-medium text-gray-900">Artist {index + 1}</h4>
                        <p className="text-xs text-gray-500">Registered on Jun {index + 1}, 2025</p>
                      </>
                    ) : (
                      <>
                        <h4 className="text-sm font-medium text-gray-900">{artist.artisticName}</h4>
                        <p className="text-xs text-gray-500">
                          {artist.name} - Registered on {format(new Date(artist.created_at), 'MMM d, yyyy')}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="p-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Recent Songs</h3>
            <a href="/admin/songs" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          <div className="divide-y divide-gray-200">
            {(loading ? [1, 2, 3, 4, 5] : songs.length ? songs : [1, 2, 3, 4, 5]).map((song, index) => (
              <div key={typeof song === 'number' ? index : song.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-md bg-secondary-100 flex items-center justify-center mr-3">
                    <Music className="h-5 w-5 text-secondary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      {typeof song === 'number' ? (
                        <>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Song Title {index + 1}</h4>
                            <p className="text-xs text-gray-500">
                              Genre: Pop - Release: Jun {10 + index}, 2025
                            </p>
                          </div>
                          <div className="text-xs font-medium text-gray-500">
                            ${(1000 + index * 200).toLocaleString()}
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{song.title}</h4>
                            <p className="text-xs text-gray-500">
                              Genre: {song.genre} - Release: {format(new Date(song.releaseDate), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <div className="text-xs font-medium text-gray-500">
                            ${song.revenue.toLocaleString()}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Send notification modal */}
      {showNotificationModal && (
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
                    <Bell className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Send Notification</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-4">
                        This notification will be sent to all users.
                      </p>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        rows={4}
                        placeholder="Enter your message here..."
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleSendNotification}
                  disabled={!customMessage.trim() || sendingNotification}
                >
                  {sendingNotification ? 'Sending...' : 'Send'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowNotificationModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
