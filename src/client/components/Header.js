import React from "react";
import "./Header.css";

const Header = ({ userScore = 0 }) => (
  <header className="Header">
    <a className="Header-title" href="/">
      Celebrity Movie Game
    </a>
    <p className="Header-score">Score:&nbsp;{userScore}</p>
  </header>
);

export default Header;
