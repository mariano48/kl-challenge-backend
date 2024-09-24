import axios from "axios";
import { GoogleLocationResponse, Location } from "./types";

const API_KEY = process.env.GOOGLE_MAPS_API_KEYS;
const BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json";

export const getGeoLocations = async (
  location: string
): Promise<Location | string> => {
  try {
    if (!API_KEY) {
      throw new Error("Missing API key");
    }
    const {
      data: { results: geoLocations },
    } = await axios.get<GoogleLocationResponse>(
      `${BASE_URL}?address=${location}&key=${API_KEY}`
    );

    if (!geoLocations.length) {
      return "Could not find location";
    }

    return geoLocations[0].geometry.location;
  } catch (error) {
    throw new Error(error.message);
  }
};
