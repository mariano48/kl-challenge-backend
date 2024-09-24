import axios from "axios";
import { IMovie, IMovieWithGeolocation } from "./types";
import { getGeoLocations } from "../geolocations/service";

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

const appendGeolocations = async (
  movies: IMovie[]
): Promise<IMovieWithGeolocation[]> => {
  const geolocationPromises = movies.map(async (movie) => {
    const geolocation = await getGeoLocations(
      movie.locations + " san francisco, ca"
    );
    return { ...movie, geolocation };
  });

  return Promise.all(geolocationPromises);
};

const generateQueryForLocations = (title: string) => {
  let query: string = "";
  if (title) {
    const fixedTitle = title.replace(" ", "%20");
    query = `title=${fixedTitle}`;
  } else {
    query = `$limit=30`;
  }
  return query;
};

const generateQueryForSuggestions = (title: string) => {
  if (title) {
    return `$query=SELECT title as movie SEARCH '${title}'`;
  } else {
    return `$limit=10`;
  }
};

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
