import React, { useState } from "react";
import Header from "./Header";
import MovieSearch from "./MovieSearch";
import Game from "./Game";
import Answer from "./Answer";
import "./App.css";

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
    <div className="App">
      <Header userScore={userScore} />
      <div className="App-content">
        {showMovieSearch && <MovieSearch onSelectMovie={handleSelectMovie} />}
        {showGame && (
          <Game
            movie={selectedMovie}
            onChangeMovieRequest={handleChangeMovieRequest}
            onGuessSubmitComplete={handleGuessSubmitComplete}
          />
        )}
      </div>
    </div>
  );
};

export default App;
