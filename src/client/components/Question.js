import React from "react";

const Question = ({
  movieTitle,
  actors,
  userMessage,
  onChangeActorCheckbox,
  onSubmitGuess
}) => {
  const makeActorCheckboxChangeHandler = actorId => e => {
    onChangeActorCheckbox({ actorId, isChecked: e.target.checked });
  };

  return (
    <form onSubmit={onSubmitGuess}>
      <fieldset>
        <legend>Which 3 appeared in {movieTitle}?</legend>
        {actors.map(actor => (
          <label key={actor.id}>
            <img src={actor.imageUrl} alt="" />
            {actor.name}
            <input
              type="checkbox"
              name="guessedActorIds"
              value={actor.id}
              checked={actor.isSelected}
              onChange={makeActorCheckboxChangeHandler(actor.id)}
            />
          </label>
        ))}
      </fieldset>
      {userMessage && <p>{userMessage}</p>}
      <button>Submit Guess</button>
    </form>
  );
};

export default Question;
