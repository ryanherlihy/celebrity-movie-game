import React from "react";
import cx from "classnames";

const Answer = ({
  actors,
  correctGuessCount,
  totalCorrectCount,
  onChooseNextMovieClick
}) => {
  return (
    <section>
      <h2>Results</h2>
      <p>
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
      <p>
        You guessed {correctGuessCount} out of {totalCorrectCount}
      </p>
      <ol>
        {actors.map(actor => (
          <li
            key={actor.id}
            className={cx("Answer-actor", {
              "is-guessed": actor.isGuessed,
              "is-correct": actor.isCorrect
            })}
          >
            <img src={actor.imageUrl} alt="" />
            {actor.name}
          </li>
        ))}
      </ol>
      <button type="button" onClick={onChooseNextMovieClick}>
        Choose Next Movie
      </button>
    </section>
  );
};

export default Answer;
