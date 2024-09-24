import { NextFunction, Request, Response } from "express";
import {
  getMoviesSuggestionsFromQuery,
  getMoviesWithGeolocations,
} from "./service";

export interface MoviesQueryParams {
  query: {
    title?: string;
  };
}

export const getMovies = async (
  req: Request<MoviesQueryParams>,
  res: Response,
  next: NextFunction
) => {
  const { title } = req.query;

  try {
    res.json(
      await getMoviesWithGeolocations({
        title: title as string,
      })
    );
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getSuggestions = async (req: Request, res: Response) => {
  try {
    const { title } = req.query;
    res.json(await getMoviesSuggestionsFromQuery({ title: title as string }));
  } catch (error) {
    res.send(error.message);
  }
};
