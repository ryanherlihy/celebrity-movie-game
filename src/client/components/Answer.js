import React from "react";
import cx from "classnames";
import "./Answer.css";

const Answer = ({
  actors,
  correctGuessCount,
  totalCorrectCount,
  onChooseNextMovieClick
}) => {
  return (
    <section>
      <h3>Results</h3>
      <p className="Answer-reaction">
        {(() => {
          const scoreRatio = correctGuessCount / totalCorrectCount;
          if (scoreRatio === 1) {
            return "Perfect!";
          } else if (scoreRatio > 0.6) {
            return "Not Bad!";
          } else if (scoreRatio > 0.3) {
            return "Better luck next time...";
          }
          return "Uh oh...";
        })()}
      </p>
      <p className="Answer-results">
        You guessed {correctGuessCount} out of {totalCorrectCount}
      </p>
      <ol className="Answer-actorsList">
        {actors.map(actor => (
          <li
            key={actor.id}
            className={cx("Answer-actor", {
              "is-guessed": actor.isGuessed,
              "is-correct": actor.isCorrect
            })}
          >
            <img src={actor.imageUrl} alt="" />
            <span className="Answer-actorName">{actor.name}</span>
          </li>
        ))}
      </ol>
      <button
        className="Answer-nextMovieBtn"
        type="button"
        onClick={onChooseNextMovieClick}
      >
        Choose Next Movie
      </button>
    </section>
  );
};

export default Answer;
