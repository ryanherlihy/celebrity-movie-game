import React, { useState, useEffect } from "react";
import axios from "axios";
import Question from "./Question";
import Answer from "./Answer";

const NUM_GUESSES = 3;

const Game = ({ movie, onChangeMovieRequest, onGuessSubmitComplete }) => {
  const [isLoadingActors, setIsLoadingActors] = useState(false);
  const [actors, setActors] = useState([]);
  const [guessedActorIds, setGuessedActorIds] = useState([]);
  const [userMessage, setUserMessage] = useState("");

  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [correctGuessCount, setCorrectGuessCount] = useState(0);

  const [showQuestion, setShowQuestion] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showNoResultsMessage, setShowNoResultsMessage] = useState(false);

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

        if (res.data.length === 0) {
          setShowNoResultsMessage(true);
        } else {
          setShowQuestion(true);
        }
      })
      .catch(err => {
        console.log(err.message);
        setIsLoadingActors(false);
      });
  }, []);

  const handleChangeMovieClick = () => {
    onChangeMovieRequest();
  };

  const getQuestionActors = () =>
    actors.map(actor => ({
      ...actor,
      isSelected: guessedActorIds.includes(actor.id)
    }));

  const handleChangeActorCheckbox = ({ actorId, isChecked }) => {
    if (isChecked) {
      setGuessedActorIds([...guessedActorIds, actorId]);
    } else {
      setGuessedActorIds(guessedActorIds.filter(id => id !== actorId));
    }
    setUserMessage("");
  };

  const getAnswerActors = () =>
    actors
      .map(actor => ({
        ...actor,
        isGuessed: guessedActorIds.includes(actor.id),
        isCorrect: correctAnswers.includes(actor.id)
      }))
      .sort((a, b) => {
        if (a.isCorrect && !b.isCorrect) {
          return -1;
        } else if (!a.isCorrect && b.isCorrect) {
          return 1;
        }
        return 0;
      });

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
          onGuessSubmitComplete(res.data);
          setCorrectAnswers(res.data.answer);
          setCorrectGuessCount(res.data.correctGuessCount);
          setShowQuestion(false);
          setShowAnswer(true);
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  };

  const handleChooseNextMovie = () => {
    onChangeMovieRequest();
  };

  return (
    <section>
      <header>
        <img src={movie.imageUrl} alt="" />
        <h2>{movie.title}</h2>
        <button type="button" onClick={handleChangeMovieClick}>
          Change Movie
        </button>
      </header>
      {isLoadingActors && <p>Loading...</p>}
      {showNoResultsMessage && "No results."}
      {showQuestion && (
        <Question
          movieTitle={movie.title}
          actors={getQuestionActors()}
          userMessage={userMessage}
          onChangeActorCheckbox={handleChangeActorCheckbox}
          onSubmitGuess={handleSubmitGuess}
        />
      )}
      {showAnswer && (
        <Answer
          actors={getAnswerActors()}
          correctGuessCount={correctGuessCount}
          totalCorrectCount={correctAnswers.length}
          onChooseNextMovieClick={handleChooseNextMovie}
        />
      )}
    </section>
  );
};

export default Game;
