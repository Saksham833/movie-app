export interface OmdbMovieBasic {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface OmdbSearchResponse {
  Search: OmdbMovieBasic[];
  totalResults: string;
  Response: string;
  Error?: string;
}

export interface OmdbMovieDetailed {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: {
    Source: string;
    Value: string;
  }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Response: string;
  Error?: string;
}

// Mapping types to maintain compatibility with existing app
export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  backdrop_path?: string | null;
  imdbID?: string;
  year?: string;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  tagline: string;
  status: string;
  imdb_id: string;
  director?: string;
  actors?: string;
  writer?: string;
  awards?: string;
  rated?: string;
  language?: string;
  country?: string;
  // Additional fields from OMDb API
  production?: string;
  boxOffice?: string;
  metascore?: string;
}

export interface MovieFilters {
  query: string;
  year: string;
  type: string;
}
