import axios from "axios";
import { GoogleLocationResponse, Location } from "./types";

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json";

export const getGeoLocations = async (
  location: string
): Promise<Location | string> => {
  try {
    if (!API_KEY) {
      throw new Error("API key not found");
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
    console.log(error.message);
    throw new Error(error.message);
  }
};
