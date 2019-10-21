import React, { useState, useEffect } from "react";
import axios from "axios";

const NUM_GUESSES = 3;

const Game = ({ movie, on }) => {
  const [isLoadingActors, setIsLoadingActors] = useState(false);
  const [actors, setActors] = useState([]);
  const [guessedActorIds, setGuessedActorIds] = useState([]);
  const [userMessage, setUserMessage] = useState("");

  useEffect(() => {
    setIsLoadingActors(true);
    axios
      .get("/getActors", {
        params: {
          movieId: movie.id
        }
      })
      .then(res => {
        setActors(res.data);
        setIsLoadingActors(false);
      })
      .catch(err => {
        console.log(err.message);
        setIsLoadingActors(false);
      });
  }, []);

  const makeActorCheckboxChangeHandler = actorId => e => {
    console.log(actorId, e.target.checked);
    if (e.target.checked) {
      setGuessedActorIds([...guessedActorIds, actorId]);
    } else {
      setGuessedActorIds(guessedActorIds.filter(id => id !== actorId));
    }
    setUserMessage("");
  };

  const handleSubmitGuess = e => {
    e.preventDefault();

    if (guessedActorIds.length < NUM_GUESSES) {
      const numRemainingGuesses = NUM_GUESSES - guessedActorIds.length;
      setUserMessage(
        `Select ${numRemainingGuesses} more before submitting your guess!`
      );
    }

    if (guessedActorIds.length > NUM_GUESSES) {
      setUserMessage(`Select only ${NUM_GUESSES}!`);
    }

    if (guessedActorIds.length === NUM_GUESSES) {
      axios
        .post("/submitGuess", {
          movieId: movie.id,
          guessedActorIds,
          allActorIds: actors.map(({ id }) => id)
        })
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  };

  const showActors = !isLoadingActors && actors.length > 0;

  return (
    <section>
      <header>
        <img src={movie.imageUrl} alt="" />
        <h2>{movie.title}</h2>
      </header>
      {isLoadingActors && <p>Loading...</p>}
      {showActors && (
        <form onSubmit={handleSubmitGuess}>
          <fieldset>
            <legend>Which 3 appeared in {movie.title}?</legend>
            {actors.map(
              actor =>
                console.log(guessedActorIds.includes(actor.id)) || (
                  <label>
                    <img src={actor.imageUrl} alt="" />
                    {actor.name}
                    <input
                      type="checkbox"
                      name="guessedActorIds"
                      value={actor.id}
                      checked={guessedActorIds.includes(actor.id)}
                      onChange={makeActorCheckboxChangeHandler(actor.id)}
                    />
                  </label>
                )
            )}
          </fieldset>
          {userMessage && <p>{userMessage}</p>}
          <button>Submit Guess</button>
        </form>
      )}
    </section>
  );
};

export default Game;
