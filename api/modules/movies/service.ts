import axios from "axios";
import { IMovie, IMovieWithGeolocation } from "./types";
import { getGeoLocations } from "../geolocations/service";
import {
  DEFAULT_LIMIT_QUERY_FOR_LOCATIONS,
  DEFAULT_LIMIT_QUERY_FOR_SUGGESTIONS,
  SAN_FRANCISCO_LOCATION,
} from "./constants";

const BASE_URL = "https://data.sfgov.org/resource/yitu-d5am.json";

export const getMoviesWithGeolocations = async ({
  title = "",
}: {
  title: string;
}): Promise<IMovieWithGeolocation[]> => {
  try {
    const movies = await getMovieLocations(title);
    const moviesWithGeolocations = await appendGeolocations(movies);
    return moviesWithGeolocations;
  } catch (error) {
    throw new Error(error.message);
  }
};

/// Returns a list of movies based on the title of a movie
export const getMovieLocations = async (title: string): Promise<IMovie[]> => {
  const fixedTitle = title.replace(" ", "%20");
  const query = generateQueryForLocations(fixedTitle);
  try {
    const { data: movies } = await axios.get<IMovie[]>(`${BASE_URL}?${query}`);
    return movies;
  } catch (error) {
    throw new Error(error.message);
  }
};

/// Returns a list of suggestions based on the title of a movie
/// the response is an array of strings
export const getMoviesSuggestionsFromQuery = async ({
  title,
}: {
  title: string;
}): Promise<string[]> => {
  const generatedQuery = generateQueryForSuggestions(title);
  try {
    const { data } = await axios.get<{ movie: string }[]>(
      `${BASE_URL}?${generatedQuery}`
    );

    return filterRepeatedSuggestions(data);
  } catch (error) {
    throw new Error(error.message);
  }
};

/// Appends coordinates to a list of movies by calling Google Maps Geocoding API
const appendGeolocations = async (
  movies: IMovie[]
): Promise<IMovieWithGeolocation[]> => {
  const geolocationPromises = movies.map(async (movie) => {
    const geolocation = await getGeoLocations(
      `${movie.locations} ${SAN_FRANCISCO_LOCATION}`
    );
    return { ...movie, geolocation };
  });

  return Promise.all(geolocationPromises);
};

/// Generates query string to filter by title of a movie
/// based on the socrata docs (https://dev.socrata.com/docs/filtering.html)
const generateQueryForLocations = (title: string) => {
  if (title) {
    const fixedTitle = title.replace(" ", "%20");
    return `title=${fixedTitle}&${DEFAULT_LIMIT_QUERY_FOR_LOCATIONS}`;
  } else {
    return DEFAULT_LIMIT_QUERY_FOR_LOCATIONS;
  }
};

/// Generates query string to filter by title of a movie
/// based on the socrata docs (https://dev.socrata.com/docs/queries/)
const generateQueryForSuggestions = (title: string) => {
  if (title) {
    return `$query=SELECT title as movie SEARCH '${title}'`;
  } else {
    return DEFAULT_LIMIT_QUERY_FOR_SUGGESTIONS;
  }
};

/// Removes repeated suggestions to avoid duplicates in the frontend
const filterRepeatedSuggestions = (
  suggestions: { movie: string }[]
): string[] => {
  const movieTitles: string[] = [];
  for (const suggestion of suggestions) {
    if (!movieTitles.includes(suggestion.movie)) {
      movieTitles.push(suggestion.movie);
    }
  }
  return movieTitles;
};
