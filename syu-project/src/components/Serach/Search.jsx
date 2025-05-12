import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Search.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faClock } from "@fortawesome/free-solid-svg-icons";

const SearchTable = () => {
  const [history, setHistory] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]); // 연관 검색어 상태
  const navigate = useNavigate();

  // 검색 기록 불러오기
  useEffect(() => {
    const storedHistory = localStorage.getItem("searchHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  // 검색어 입력 시 연관 검색어 필터링
  useEffect(() => {
    if (!searchInput.trim()) {
      setSuggestions([]);
      return;
    }

    const lowerInput = searchInput.toLowerCase();
    const filtered = history
      .map((item) => item.query)
      .filter((query, index, self) =>
        query.toLowerCase().includes(lowerInput) && self.indexOf(query) === index
      );
    setSuggestions(filtered);
  }, [searchInput, history]);

  // ✅ 검색 실행
  const handleSearch = () => {
    if (!searchInput.trim()) return;

    const newHistory = {
      id: Date.now(),
      query: searchInput.trim(),
    };
    const updatedHistory = [...history, newHistory];
    setHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));

    navigate(`/home?q=${encodeURIComponent(searchInput.trim())}`);
    setSearchInput("");
    setSuggestions([]);
  };

  // 특정 검색 기록 삭제
  const handleDelete = (id) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  // 모든 기록 삭제
  const handleDeleteAll = () => {
    setHistory([]);
    localStorage.removeItem("searchHistory");
  };

  return (
    <div className="search-container">
      {/* 상단 헤더 */}
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
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="search-btn" onClick={handleSearch}></button>
      </div>

      {/* 연관 검색어 */}
      {suggestions.length > 0 && (
        <div className="suggestions-container">
          <ul>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="suggestion-item"
                onClick={() => {
                  setSearchInput(suggestion);
                  navigate(`/home?q=${encodeURIComponent(suggestion)}`);
                }}>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 검색 기록 */}
      <div className="history-container">
        <div className="history-header">
          <h3>검색 기록</h3>
          {history.length > 0 && (
            <button className="delete-all-button" onClick={handleDeleteAll}>
              전체 삭제
            </button>
          )}
        </div>
        <ul>
          {history.length > 0 ? (
            history.map((item) => (
              <li key={item.id} className="history-item">
                <FontAwesomeIcon icon={faClock} className="search-marker-image" />
                <span
                  className="history-query"
                  onClick={() =>
                    navigate(`/home?q=${encodeURIComponent(item.query)}`)
                  }>
                  {item.query}
                </span>
                <button
                  className="Sdelete-button"
                  onClick={() => handleDelete(item.id)}>
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
