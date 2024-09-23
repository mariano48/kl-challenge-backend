import express from "express";
import cors from "cors";
import { getMovies, getSuggestions } from "./modules/movies/controller";

const PORT = 9000;
const server = express();

server.use(cors());
server.use(express.json());
server.get("/movies", getMovies);
server.get("/suggestions", getSuggestions);

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

export default server;
