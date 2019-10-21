import React, { useState } from "react";
import Header from "./Header";
import MovieSearch from "./MovieSearch";
import Game from "./Game";

const App = () => {
  const [showMovieSearch, setShowMovieSearch] = useState(true);
  const [showGame, setShowGame] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleSelectMovie = movie => {
    setSelectedMovie(movie);
    // show game page
    setShowMovieSearch(false);
    setShowGame(true);
    // get actors
    // show loading
    // set actors
  };

  return (
    <>
      <Header />
      <div className="container">
        {showMovieSearch && <MovieSearch onSelectMovie={handleSelectMovie} />}
        {showGame && <Game movie={selectedMovie} />}
      </div>
    </>
  );
};

export default App;
