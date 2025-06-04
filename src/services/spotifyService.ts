
interface SpotifyArtist {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  followers: {
    total: number;
  };
  genres: string[];
  external_urls: {
    spotify: string;
  };
}

interface SpotifySearchResponse {
  artists: {
    items: SpotifyArtist[];
  };
}

class SpotifyService {
  private clientId: string = '';
  private clientSecret: string = '';
  private accessToken: string = '';
  private tokenExpiry: number = 0;

  constructor() {
    // These will need to be set by the user
    this.clientId = localStorage.getItem('spotify_client_id') || '';
    this.clientSecret = localStorage.getItem('spotify_client_secret') || '';
  }

  setCredentials(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    localStorage.setItem('spotify_client_id', clientId);
    localStorage.setItem('spotify_client_secret', clientSecret);
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    if (!this.clientId || !this.clientSecret) {
      throw new Error('Spotify credentials not configured');
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.clientSecret)
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error('Failed to get Spotify access token');
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // 1 minute buffer

    return this.accessToken;
  }

  async searchArtist(artistName: string): Promise<SpotifyArtist | null> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to search Spotify');
      }

      const data: SpotifySearchResponse = await response.json();
      return data.artists.items[0] || null;
    } catch (error) {
      console.error('Spotify search error:', error);
      return null;
    }
  }

  async getArtistImage(artistName: string): Promise<string | null> {
    const artist = await this.searchArtist(artistName);
    if (artist && artist.images.length > 0) {
      // Return the smallest image (usually the last one)
      return artist.images[artist.images.length - 1].url;
    }
    return null;
  }

  hasCredentials(): boolean {
    return !!(this.clientId && this.clientSecret);
  }
}

export const spotifyService = new SpotifyService();
export type { SpotifyArtist };
