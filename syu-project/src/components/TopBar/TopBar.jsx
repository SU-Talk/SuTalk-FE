import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"; // Search icon
import "./TopBar.css";

const TopBar = () => {
  return (
    <div className="topbar-container">
      <Link to="/home">
        <h1>
         SYU
         </h1>
         </Link>
      <div className="topbar-search">
      <Link to="/search">
        <button className="search-button">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
        </Link>
      </div>
    </div>
  );
};

export default TopBar;