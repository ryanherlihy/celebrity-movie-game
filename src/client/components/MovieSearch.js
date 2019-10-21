import React, { useState } from "react";
import axios from "axios";

const MovieSearch = ({ onSelectMovie }) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const handleInputChange = e => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = e => {
    e.preventDefault();

    if (!searchValue) {
      return;
    }

    axios
      .get("/getMovies", {
        params: {
          search: searchValue
        }
      })
      .then(res => {
        setSearchResults(res.data);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const makeResultClickHandler = movieId => () => {
    onSelectMovie(movieId);
  };

  const showSearchResults = searchResults && searchResults.length > 0;
  const showEmptyResultsMessage = searchResults && searchResults.length === 0;

  return (
    <div>
      <h1>Search for a movie...</h1>
      <form onSubmit={handleSearchSubmit}>
        <label>
          Movie Search
          <input
            type="search"
            placeholder="Search"
            value={searchValue}
            onChange={handleInputChange}
          />
        </label>
        <button>Search</button>
      </form>
      {showSearchResults && (
        <ol>
          {searchResults.map(movie => (
            <li key={movie.id}>
              <button onClick={makeResultClickHandler(movie.id)}>
                <img src={movie.imageUrl} alt="" />
                {movie.title}
              </button>
            </li>
          ))}
        </ol>
      )}
      {showEmptyResultsMessage && <p>No results found for your search.</p>}
    </div>
  );
};

export default MovieSearch;
