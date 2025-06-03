import axios from 'axios';
import type { 
  OmdbSearchResponse, 
  OmdbMovieDetailed,
  MovieListResponse,
  Movie,
  MovieDetails
} from '../types/omdb.types';

const API_KEY = '395dbd88'; // Your provided API key
const BASE_URL = 'https://www.omdbapi.com/';

export const omdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    apikey: API_KEY,
  },
});

export interface OmdbSearchParams {
  page?: number;
  query?: string;
  year?: string;
  type?: 'movie' | 'series';
}

// Helper function to transform OmdbMovieBasic to Movie (compatible with existing app)
const transformToMovie = (omdbMovie: any): Movie => {
  return {
    id: parseInt(omdbMovie.imdbID.replace('tt', '')) || 0,
    title: omdbMovie.Title,
    poster_path: omdbMovie.Poster !== 'N/A' ? omdbMovie.Poster : null,
    release_date: omdbMovie.Year,
    vote_average: parseFloat(omdbMovie.imdbRating || '0') / 2, // Convert to 5-star scale
    overview: omdbMovie.Plot || '',
    backdrop_path: null,
    imdbID: omdbMovie.imdbID,
    year: omdbMovie.Year
  };
};

// Helper function to transform OmdbMovieDetailed to MovieDetails
const transformToMovieDetails = (omdbMovie: OmdbMovieDetailed): MovieDetails => {
  // Extract imdbRating and convert to number on a 5-point scale
  let voteAverage = 0;
  if (omdbMovie.imdbRating && omdbMovie.imdbRating !== 'N/A') {
    voteAverage = parseFloat(omdbMovie.imdbRating) / 2; // Convert from 10-point to 5-point scale
  }

  // Parse runtime to number (removing 'min' suffix)
  let runtimeMinutes = 0;
  if (omdbMovie.Runtime && omdbMovie.Runtime !== 'N/A') {
    runtimeMinutes = parseInt(omdbMovie.Runtime.replace(' min', ''));
  }

  // Create genres array from comma-separated string
  const genres = omdbMovie.Genre && omdbMovie.Genre !== 'N/A' 
    ? omdbMovie.Genre.split(', ').map((name, index) => ({ id: index + 1, name }))
    : [];

  // Extract numeric ID from imdbID
  const numericId = omdbMovie.imdbID ? 
    parseInt(omdbMovie.imdbID.replace('tt', '')) || 0 : 0;

  return {
    id: numericId,
    title: omdbMovie.Title || '',
    poster_path: omdbMovie.Poster !== 'N/A' ? omdbMovie.Poster : null,
    release_date: omdbMovie.Released || omdbMovie.Year || '',
    vote_average: voteAverage,
    overview: omdbMovie.Plot || '',
    backdrop_path: null,  // OMDb doesn't provide backdrop images
    genres: genres,
    runtime: runtimeMinutes,
    tagline: '', // OMDb doesn't provide taglines
    status: 'Released',
    imdb_id: omdbMovie.imdbID,
    director: omdbMovie.Director !== 'N/A' ? omdbMovie.Director : undefined,
    actors: omdbMovie.Actors !== 'N/A' ? omdbMovie.Actors : undefined,
    writer: omdbMovie.Writer !== 'N/A' ? omdbMovie.Writer : undefined,
    awards: omdbMovie.Awards !== 'N/A' ? omdbMovie.Awards : undefined,
    rated: omdbMovie.Rated !== 'N/A' ? omdbMovie.Rated : undefined,
    language: omdbMovie.Language !== 'N/A' ? omdbMovie.Language : undefined,
    country: omdbMovie.Country !== 'N/A' ? omdbMovie.Country : undefined,
    year: omdbMovie.Year || '',
    // Additional fields from OMDb that might be useful
    production: omdbMovie.Production !== 'N/A' ? omdbMovie.Production : undefined,
    boxOffice: omdbMovie.BoxOffice !== 'N/A' ? omdbMovie.BoxOffice : undefined,
    metascore: omdbMovie.Metascore !== 'N/A' ? omdbMovie.Metascore : undefined
  };
};

export const movieApi = {
  getPopular: async (params: OmdbSearchParams = {}) => {
    // OMDb doesn't have a "popular" endpoint, so we'll search for a common term
    const { data } = await omdbApi.get<OmdbSearchResponse>('', {
      params: {
        s: params.query || 'movie',
        page: params.page || 1,
        y: params.year,
        type: params.type || 'movie'
      },
    });
    
    if (data.Response === 'False') {
      return {
        page: params.page || 1,
        results: [],
        total_pages: 0,
        total_results: 0
      } as MovieListResponse;
    }
    
    const totalResults = parseInt(data.totalResults);
    return {
      page: params.page || 1,
      results: data.Search.map(transformToMovie),
      total_pages: Math.ceil(totalResults / 10),
      total_results: totalResults
    } as MovieListResponse;
  },

  searchMovies: async (params: OmdbSearchParams = {}) => {
    if (!params.query) {
      return movieApi.getPopular(params);
    }
    
    const { data } = await omdbApi.get<OmdbSearchResponse>('', {
      params: {
        s: params.query,
        page: params.page || 1,
        y: params.year,
        type: params.type || 'movie'
      },
    });
    
    if (data.Response === 'False') {
      return {
        page: params.page || 1,
        results: [],
        total_pages: 0,
        total_results: 0
      } as MovieListResponse;
    }
    
    const totalResults = parseInt(data.totalResults);
    return {
      page: params.page || 1,
      results: data.Search.map(transformToMovie),
      total_pages: Math.ceil(totalResults / 10),
      total_results: totalResults
    } as MovieListResponse;
  },

  getMovieDetails: async (id: string) => {
    const { data } = await omdbApi.get<OmdbMovieDetailed>('', {
      params: {
        i: id.startsWith('tt') ? id : `tt${id}`,
        plot: 'full'
      },
    });
    
    if (data.Response === 'False') {
      throw new Error(data.Error || 'Movie not found');
    }
    
    return transformToMovieDetails(data);
  },

  getGenres: async () => {
    // OMDb doesn't have a genres endpoint, so we'll return some common genres
    return [
      { id: 1, name: 'Action' },
      { id: 2, name: 'Comedy' },
      { id: 3, name: 'Drama' },
      { id: 4, name: 'Sci-Fi' },
      { id: 5, name: 'Thriller' },
      { id: 6, name: 'Horror' },
      { id: 7, name: 'Romance' },
      { id: 8, name: 'Adventure' },
      { id: 9, name: 'Fantasy' },
      { id: 10, name: 'Mystery' }
    ];
  }
};

export default omdbApi;
