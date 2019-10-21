import React from "react";

const Header = ({ userScore = 0 }) => (
  <header>
    <a href="/">Celebrity Movie Game</a>
    <p>Score:&nbsp;{userScore}</p>
  </header>
);

export default Header;
