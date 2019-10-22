const path = require("path");
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const PORT = 3000;

const TMDB_API_BASE_PATH = "https://api.themoviedb.org/3";
const TMDB_API_KEY = "07befa3ecc55734111b95a62335771fb";
const TMDB_IMAGE_BATH_PATH = "https://image.tmdb.org/t/p/w200/";

// Borrowed from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
const shuffleArray = array => {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const tmdbApiGet = ({ endpoint, queryFields = {} }) => {
  const query = Object.entries(queryFields)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return new Promise((resolve, reject) => {
    https
      .get(
        `${TMDB_API_BASE_PATH}${endpoint}?api_key=${TMDB_API_KEY}${
          query ? "&" + query : ""
        }`,
        apiRes => {
          let data = "";

          apiRes.on("data", chunk => {
            data += chunk;
          });

          apiRes.on("end", () => {
            resolve(JSON.parse(data));
          });
        }
      )
      .on("error", err => {
        reject(err);
      });
  });
};

const getPopularPeople = () =>
  tmdbApiGet({ endpoint: "/person/popular" })
    .then(({ results }) => results)
    .catch(err => console.log(err.message));

const app = express();

app.use(express.static("dist"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * Endpoint to return list of movies for user to search from
 *
 * Input: search string
 * Output: list of movies with titles matching input
 */
app.get("/getMovies", (req, res) => {
  const { search } = req.query;

  if (!search) {
    res.status(400).send("No search specified");
  }

  tmdbApiGet({
    endpoint: "/search/movie",
    queryFields: {
      query: search
    }
  })
    .then(({ results }) => {
      res.send(
        results.map(({ id, title, poster_path, release_date }) => ({
          id,
          title,
          imageUrl: `${TMDB_IMAGE_BATH_PATH}${poster_path}`,
          releaseYear: new Date(release_date).getFullYear()
        }))
      );
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("There was a problem retrieving search results.");
    });
});

/**
 * Endpoint to return list of actors for user to guess from
 *
 * Input: movie id
 * Output: list of actors
 */
app.get("/getActors", (req, res) => {
  const { movieId } = req.query;

  if (!movieId) {
    res.send("A movie ID must be specified.");
  }

  tmdbApiGet({
    endpoint: `/movie/${movieId}/credits`
  })
    .then(({ cast }) => {
      // TODO: shuffle list of actors

      const castIds = cast.map(({ id }) => id);

      const actorsInMovie = cast
        .slice(0, 3)
        .map(({ id, name, profile_path }) => ({
          id,
          name,
          imageUrl: `${TMDB_IMAGE_BATH_PATH}${profile_path}`
        }));

      return {
        castIds,
        actorsInMovie
      };
    })
    .then(({ castIds, actorsInMovie }) => {
      const actorsNotInMovie = [];
      let index = 0;

      getPopularPeople().then(people => {
        const shuffledPeople = shuffleArray(people);
        while (actorsNotInMovie.length < 2) {
          const { id, name, profile_path } = shuffledPeople[index];
          if (!castIds.includes(id)) {
            actorsNotInMovie.push({
              id,
              name,
              imageUrl: `${TMDB_IMAGE_BATH_PATH}${profile_path}`
            });
          }
          index++;
        }

        const actorsToGuessFrom = shuffleArray([
          ...actorsInMovie,
          ...actorsNotInMovie
        ]);
        res.send(actorsToGuessFrom);
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err.message);
    });
});

/**
 * Endpoint for user to submit a guess
 *
 * Input: movie id, list of guessed actor ids, list of all actor ids
 * Output: movie id, list of all correct actor ids, user score
 */
app.post("/submitGuess", (req, res) => {
  const { movieId, guessedActorIds, allActorIds } = req.body;

  if (!movieId) {
    res.send("A movie ID must be specified.");
  }

  tmdbApiGet({
    endpoint: `/movie/${movieId}/credits`
  })
    .then(({ cast }) => {
      const castIds = cast.map(({ id }) => id);

      const guessIds = Array.isArray(guessedActorIds)
        ? guessedActorIds
        : [guessedActorIds];

      const correctGuessCount = guessIds.reduce((count, actorId) => {
        if (castIds.includes(parseInt(actorId, 10))) {
          count++;
        }
        return count;
      }, 0);

      // The array of ids of the given actors who were cast members
      const answer = allActorIds.filter(actorId =>
        castIds.includes(parseInt(actorId, 10))
      );

      // TODO: save users score

      res.send({
        movieId,
        answer,
        correctGuessCount
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err.message);
    });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}...`));
