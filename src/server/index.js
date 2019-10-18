const express = require("express");
const https = require("https");

const PORT = 3000;

const TMDB_API_BASE_PATH = "https://api.themoviedb.org/3";
const TMDB_API_KEY = "07befa3ecc55734111b95a62335771fb";
const TMDB_IMAGE_BATH_PATH = "https://image.tmdb.org/t/p/w200/";

const tmdbApiGet = ({ endpoint, queryFields }) => {
  const query = Object.entries(queryFields)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return new Promise((resolve, reject) => {
    https
      .get(
        `${TMDB_API_BASE_PATH}${endpoint}?api_key=${TMDB_API_KEY}&${query}`,
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

const app = express();

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

/**
 * Endpoint to return list of movies for user to search from
 *
 * Input: search string
 * Output: list of movies with titles matching input
 */
app.get("/getMovies", (req, res) => {
  const search = req.query.search;

  if (search) {
    tmdbApiGet({
      endpoint: "/search/movie",
      queryFields: {
        query: search
      }
    })
      .then(({ results }) => {
        res.send(
          results.map(({ title, poster_path, release_date }) => ({
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
  }
});

/**
 * Endpoint to return list of actors for user to guess from
 *
 * Input: movie id
 * Output: list of actors
 */
app.get("/getActors", (req, res) => {});

/**
 * Endpoint for user to submit a guess
 *
 * Input: movie id, list of guessed actor ids, list of all actor ids
 * Output: movie id, list of all correct actor ids, user score
 */
app.post("/submitGuess", (req, res) => {});

app.listen(PORT, () => console.log(`App listening on port ${PORT}...`));
