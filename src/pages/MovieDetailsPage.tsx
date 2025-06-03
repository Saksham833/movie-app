import { useEffect, useState } from 'react';

// Define interfaces for our data types
interface Movie {
  id: string;
  title: string;
  year: string;
  runtime: string;
  rating: string;
  imdbRating: number;
  genres: string[];
  director: string;
  cast: string[];
  plot: string;
poster: string | null;
  awards: string;
  language: string;
  country: string;
  boxOffice: string;
  production: string;
  metascore: string;
}

interface TrendingMovie {
  id: string;
  title: string;
  year: string;
  poster: string | null;
}
import { 
  Star, 
  Film,
  Globe,
  Award,
  DollarSign,
  Users,
  Sparkles,
  TrendingUp,
  Eye,
  Loader2,
  
} from 'lucide-react';

// API Configuration
const API_KEY = '395dbd88';
const BASE_URL = 'https://www.omdbapi.com/';

// API Functions
const fetchMovieDetails = async (id: string): Promise<Movie> => {
  const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${id.startsWith('tt') ? id : `tt${id}`}&plot=full`);
  const data = await response.json();
  
  if (data.Response === 'False') {
    throw new Error(data.Error || 'Movie not found');
  }
  
  return {
    id: data.imdbID,
    title: data.Title,
    year: data.Year,
    runtime: data.Runtime,
    rating: data.Rated,
    imdbRating: parseFloat(data.imdbRating) || 0,
    genres: data.Genre ? data.Genre.split(', ') : [],
    director: data.Director,
    cast: data.Actors ? data.Actors.split(', ') : [],
    plot: data.Plot,
    poster: data.Poster !== 'N/A' ? data.Poster : null,
    awards: data.Awards,
    language: data.Language,
    country: data.Country,
    boxOffice: data.BoxOffice,
    production: data.Production,
    metascore: data.Metascore
  };
};

const fetchTrendingMovies = async (): Promise<TrendingMovie[]> => {
  const searches = ['avengers', 'batman', 'spider', 'star wars', 'marvel', 'fast'];
  const allMovies: any[] = [];
  
  for (const term of searches.slice(0, 3)) {
    try {
      const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${term}&type=movie&y=2023`);
      const data = await response.json();
      
      if (data.Response === 'True' && data.Search) {
        allMovies.push(...data.Search.slice(0, 2));
      }
    } catch (error) {
      console.error(`Error fetching movies for ${term}:`, error);
    }
  }
  
  return allMovies.map(movie => ({
    id: movie.imdbID,
    title: movie.Title,
    year: movie.Year,
    poster: movie.Poster !== 'N/A' ? movie.Poster : null
  })) as TrendingMovie[];
};

interface MovieDetailsPageProps {
  movieId?: string;
}

const MovieDetailsPage = ({ movieId = 'tt4633694' }: MovieDetailsPageProps) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<TrendingMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    console.log(movie);
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [movieData, trendingData] = await Promise.all([
          fetchMovieDetails(movieId),
          fetchTrendingMovies()
        ]);
        
        setMovie(movieData);
        setTrendingMovies(trendingData);
      } catch (err: any) {
        setError(err.message);
        console.error('Error loading movie data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [movieId]);


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center p-12 rounded-3xl bg-black/30 backdrop-blur-xl border border-purple-500/20 shadow-2xl">
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full blur-2xl bg-purple-600/40 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-6 rounded-full">
              <Loader2 className="w-12 h-12 animate-spin text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-white">Loading cinematic experience...</p>
            <p className="text-purple-200/70">Fetching movie details</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center">
        <div className="text-center p-12 rounded-3xl bg-black/30 backdrop-blur-xl border border-red-500/20 shadow-2xl max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-red-500/25">
            <span className="text-4xl text-white font-bold">!</span>
          </div>
          <p className="text-xl font-semibold text-white mb-2">Something went wrong</p>
          <p className="text-red-300/80 mb-8">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-2xl font-semibold text-white transition-all duration-300 shadow-lg shadow-red-900/25 hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center">
        <div className="text-center p-12 rounded-3xl bg-black/30 backdrop-blur-xl border border-gray-700/30 shadow-2xl">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-8">
            <Film className="w-10 h-10 text-gray-300" />
          </div>
          <p className="text-2xl font-bold text-white mb-2">Movie not found</p>
          <p className="text-gray-400">The requested movie could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie?.poster || "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1200&h=600&fit=crop"})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black/90"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-pink-600/20"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 py-20">
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
    
    {/* Movie Poster */}
    <div className="lg:col-span-4">
      <div className="relative group max-w-sm mx-auto">
        {/* Glow Background */}
        <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-pink-500 opacity-30 rounded-3xl blur-2xl group-hover:opacity-60 transition duration-500" />
        
        {/* Poster */}
        <div className="relative overflow-hidden rounded-2xl shadow-lg">
          <img 
            src={movie.poster || "https://via.placeholder.com/400x600?text=No+Poster"} 
            alt={movie.title}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Top Right Rating */}
          <div className="absolute top-3 right-3 bg-black/60 text-purple-300 text-sm font-semibold px-3 py-1 rounded-lg backdrop-blur-sm">
            {movie.rating}
          </div>

          {/* Hover Info */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3 flex justify-between items-center rounded-b-2xl opacity-0 group-hover:opacity-100 transition duration-300">
            <div className="flex items-center gap-2 text-sm">
              <Eye className="w-4 h-4 text-purple-400" />
              Preview
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              {movie.imdbRating}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Movie Info */}
    <div className="lg:col-span-8 space-y-8">
      
      {/* Title + Badge */}
      <div>
        <span className="inline-flex items-center gap-2 bg-purple-700/20 text-purple-200 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          Featured Film
        </span>
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">{movie.title}</h1>

      </div>

      {/* Ratings */}
      <div className="flex flex-wrap gap-4 justify-evenly items-center space-y-4">
        <div className="flex items-center gap-4 bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl" style={{width: '15%',margin: '4px'}}>
          <Star className="w-6 h-6 text-yellow-400 fill-current" />
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <div className="text-white font-bold text-xl">{movie.imdbRating || 'N/A'}<span className="text-yellow-300 text-sm"> /10</span></div>
            <div className="text-yellow-200 text-xs uppercase">IMDb Rating</div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</div>

      </div>

      {/* Content Section */}
      <div className="relative z-10 container mx-auto px-6 py-20 space-y-16">
        {/* Plot */}
        <div className="max-w-4xl">
          <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
            Synopsis
          </h3>
          <p className="text-xl leading-relaxed text-gray-300 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl">
            {movie.plot}
          </p>
        </div>

        {/* Movie Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-xl font-semibold text-white">Director</h4>
            </div>
            <p className="text-gray-300 text-lg">{movie.director || 'N/A'}</p>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-pink-500/20 rounded-xl">
                <Users className="w-6 h-6 text-pink-400" />
              </div>
              <h4 className="text-xl font-semibold text-white">Top Cast</h4>
            </div>
            <div className="space-y-2">
              {movie.cast.slice(0, 3).map((actor, index) => (
                <p key={index} className="text-gray-300 text-lg">{actor}</p>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Globe className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-xl font-semibold text-white">Country</h4>
            </div>
            <p className="text-gray-300 text-lg">{movie.country || 'N/A'}</p>
          </div>
        </div>

        {/* Additional Info */}
        {(movie.awards || movie.boxOffice) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {movie.awards && movie.awards !== 'N/A' && (
              <div className="bg-gradient-to-br from-yellow-600/10 to-orange-600/10 border border-yellow-500/20 rounded-3xl p-8 backdrop-blur-xl shadow-xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-yellow-500/20 rounded-xl">
                    <Award className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-yellow-300">Awards & Recognition</h4>
                </div>
                <p className="text-yellow-100 text-lg leading-relaxed">{movie.awards}</p>
              </div>
            )}
            {movie.boxOffice && movie.boxOffice !== 'N/A' && (
              <div className="bg-gradient-to-br from-emerald-600/10 to-green-600/10 border border-emerald-500/20 rounded-3xl p-8 backdrop-blur-xl shadow-xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-emerald-500/20 rounded-xl">
                    <DollarSign className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-emerald-300">Box Office</h4>
                </div>
                <p className="text-emerald-100 text-2xl font-bold">{movie.boxOffice}</p>
              </div>
            )}
          </div>
        )}

        {/* Trending Section */}
        <div>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-2 h-10 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Trending Now</h2>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
            <button className="px-6 py-3 text-sm font-medium text-purple-300 hover:text-white bg-white/10 hover:bg-purple-600/30 border border-purple-500/30 rounded-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105">
              Explore More
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {trendingMovies.length > 0 ? (
              trendingMovies.map((trendingMovie, index) => (
                <div key={trendingMovie.id || index} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl mb-4">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/50 to-pink-600/50 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative">
                      <img 
                        src={trendingMovie.poster || "https://via.placeholder.com/200x300?text=No+Poster"} 
                        alt={trendingMovie.title}
                        className="w-full aspect-[2/3] object-cover rounded-2xl shadow-lg group-hover:shadow-purple-600/25 transition-all duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl">
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-black/60 backdrop-blur-xl px-4 py-3 rounded-xl border border-white/10">
                            <h3 className="font-semibold text-sm text-white mb-2 line-clamp-2">
                              {trendingMovie.title}
                            </h3>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full">{trendingMovie.year}</span>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-yellow-300 font-medium">8.4</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm text-gray-300 group-hover:text-purple-300 transition-colors line-clamp-2 mb-1">
                    {trendingMovie.title}
                  </h3>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{trendingMovie.year}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="inline-flex items-center px-6 py-4 bg-purple-600/20 border border-purple-500/30 rounded-2xl backdrop-blur-xl">
                  <Loader2 className="w-5 h-5 animate-spin mr-3 text-purple-400" />
                  <p className="text-purple-300 font-medium">Loading trending movies...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;