import React from "react";
import Header from "./Header";
import MovieSearch from "./MovieSearch";

const App = () => (
  <>
    <Header />
    <div className="container">
      <MovieSearch />
    </div>
  </>
);

export default App;
