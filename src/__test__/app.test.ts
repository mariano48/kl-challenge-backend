import request from "supertest";
import server from "../index";

describe("Movie locations API", () => {
  describe("GET /", () => {
    it("should return OK", async () => {
      return request(server).get("/").expect(200).expect("OK");
    });

    describe("GET /movies", () => {
      it("should return an array of movies", async () => {
        return request(server)
          .get("/movies")
          .expect(200)
          .then((response) => {
            expect(response.body).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  title: expect.any(String),
                  release_year: expect.any(String),
                  locations: expect.any(String),
                  production_company: expect.any(String),
                  distributor: expect.any(String),
                  director: expect.any(String),
                  writer: expect.any(String),
                  actor_1: expect.any(String),
                  actor_2: expect.any(String),
                  actor_3: expect.any(String),
                }),
              ])
            );
          });
      });
    });

    describe("GET /suggestions", () => {
      it("should return an array of suggestions", async () => {
        return request(server)
          .get("/suggestions?title=Experiment")
          .expect(200)
          .then((response) => {
            expect(response.body).toEqual(["Experiment in Terror"]);
          });
      });
    });
  });
});
