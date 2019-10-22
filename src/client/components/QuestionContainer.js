import React from "react";
import Question from "./Question";

const QuestionContainer = ({ movieId, movieTitle, actors }) => {
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

  return (
    <Question
      movieTitle={movie.title}
      actors={getQuestionActors()}
      userMessage={userMessage}
      onChangeActorCheckbox={handleChangeActorCheckbox}
      onSubmitGuess={handleSubmitGuess}
    />
  );
};

export default QuestionContainer;
