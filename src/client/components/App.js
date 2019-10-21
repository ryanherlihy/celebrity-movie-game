import React, { useState } from "react";
import Header from "./Header";
import MovieSearch from "./MovieSearch";
import Game from "./Game";
import Answer from "./Answer";

const App = () => {
  const [showMovieSearch, setShowMovieSearch] = useState(true);
  const [showGame, setShowGame] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [userScore, setUserScore] = useState(0);

  const handleSelectMovie = movie => {
    setSelectedMovie(movie);
    // show game page
    setShowMovieSearch(false);
    setShowGame(true);
    // get actors
    // show loading
    // set actors
  };

  const handleChangeMovieRequest = () => {
    setShowGame(false);
    setShowMovieSearch(true);
    setSelectedMovie(null);
  };

  const handleGuessSubmitComplete = ({ correctGuessCount }) => {
    setUserScore(userScore + correctGuessCount);
  };

  return (
    <>
      <Header userScore={userScore} />
      <div className="container">
        {showMovieSearch && <MovieSearch onSelectMovie={handleSelectMovie} />}
        {showGame && (
          <Game
            movie={selectedMovie}
            onChangeMovieRequest={handleChangeMovieRequest}
            onGuessSubmitComplete={handleGuessSubmitComplete}
          />
        )}
      </div>
    </>
  );
};

export default App;
