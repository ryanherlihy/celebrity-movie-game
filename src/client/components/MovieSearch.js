import React, { useState } from "react";
import axios from "axios";
import "./MovieSearch.css";

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

  const makeResultClickHandler = movie => () => {
    onSelectMovie(movie);
  };

  const showSearchResults = searchResults && searchResults.length > 0;
  const showEmptyResultsMessage = searchResults && searchResults.length === 0;

  return (
    <section className="MovieSearch">
      <h1>Search for a movie...</h1>
      <form className="MovieSearch-form" onSubmit={handleSearchSubmit}>
        <label className="MovieSearch-searchBox">
          <span className="visually-hidden">Movie Search</span>
          <input
            className="MovieSearch-searchBoxInput"
            type="search"
            placeholder="Search"
            value={searchValue}
            onChange={handleInputChange}
          />
        </label>
        <button className="MovieSearch-searchBoxButton">Search</button>
      </form>
      {showSearchResults && (
        <ol className="MovieSearch-resultList">
          {searchResults.map(movie => (
            <li key={movie.id} className="MovieSearch-resultListItem">
              <button
                className="MovieSearch-resultButton"
                onClick={makeResultClickHandler(movie)}
              >
                <img
                  className="MovieSearch-resultImg"
                  src={movie.imageUrl}
                  alt=""
                />
                <span className="MovieSearch-resultTitle">{movie.title}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
      {showEmptyResultsMessage && <p>No results found for your search.</p>}
    </section>
  );
};

export default MovieSearch;
