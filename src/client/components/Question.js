import React from "react";
import cx from "classnames";
import "./Question.css";

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
    <form className="Question" onSubmit={onSubmitGuess}>
      <fieldset className="Question-fieldset">
        <legend className="Question-legend">
          Which 3 appeared in {movieTitle}?
        </legend>
        <div className="Question-choices">
          {actors.map(actor => (
            <label className="Question-actorLabel" key={actor.id}>
              <input
                className="Question-actorCheckbox"
                type="checkbox"
                name="guessedActorIds"
                value={actor.id}
                checked={actor.isSelected}
                onChange={makeActorCheckboxChangeHandler(actor.id)}
              />
              <span
                className={cx("Question-actor", {
                  "is-selected": actor.isSelected
                })}
              >
                <img
                  className="Question-actorImg"
                  src={actor.imageUrl}
                  alt=""
                />
                <span className="Question-actorName">{actor.name}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      {userMessage && <p className="Question-message">{userMessage}</p>}
      <button className="Question-submitBtn">Submit Guess</button>
    </form>
  );
};

export default Question;
