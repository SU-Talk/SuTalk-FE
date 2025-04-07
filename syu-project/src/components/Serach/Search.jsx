import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Search.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faClock } from "@fortawesome/free-solid-svg-icons";

const SearchTable = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/historydummyData.json");
        if (!response.ok) {
          throw new Error("데이터를 가져오는데 실패했습니다.");
        }
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error("검색 기록을 가져오는 중 오류 발생:", error);
        setHistory([]);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = (id) => {
    setHistory((prevHistory) => prevHistory.filter((item) => item.id !== id));
  };

  const handleDeleteAll = () => {
    setHistory([]);
  };

  return (
    <div className="search-container">
      <div className="header">
        <Link to="/home">
          <button className="search-back-button">
            <FontAwesomeIcon icon={faChevronLeft} className="search-back-image" />
          </button>
        </Link>
        <input
          type="text"
          className="search-input"
          placeholder="원하는 물건을 검색"
        />
        <button className="search-btn" />
      </div>
      <div className="history-container">
        <div className="history-header">
          <h3>검색 기록</h3>
          {history.length >= 0 && (
            <button className="delete-all-button" onClick={handleDeleteAll}>
              전체 삭제
            </button>
          )}
        </div>
        <ul>
          {history.length > 0 ? (
            history.map((item) => (
              <li key={item.id}>
                <FontAwesomeIcon icon={faClock} className="search-marker-image" />
                {item.query}
                <button
                  className="Sdelete-button"
                  onClick={() => handleDelete(item.id)}
                >
                  ×
                </button>
              </li>
            ))
          ) : (
            <li>검색 기록이 없습니다.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SearchTable;