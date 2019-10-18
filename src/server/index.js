const express = require("express");

const PORT = 3000;

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
app.get("/getMovies", (req, res) => {});

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
