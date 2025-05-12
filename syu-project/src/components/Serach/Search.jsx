import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Search.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faClock } from "@fortawesome/free-solid-svg-icons";

const SearchTable = () => {
  const [history, setHistory] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  //DB에서 검색 기록 불러오기
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/search/history");
        const data = await res.json();
        setHistory(data.reverse()); // 최근 것이 위로 오도록 정렬
      } catch (error) {
        console.error("검색 기록 불러오기 실패:", error);
      }
    };
    fetchHistory();
  }, []);

  //연관 검색어 불러오기
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchInput.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(`/api/search/suggest?keyword=${encodeURIComponent(searchInput)}`);
        const data = await res.json();
        setSuggestions(data);
      } catch (error) {
        console.error("연관 검색어 불러오기 실패:", error);
      }
    };

    fetchSuggestions();
  }, [searchInput]);

  // 검색 실행
  const handleSearch = async () => {
    const trimmed = searchInput.trim();
    if (!trimmed) return;

    try {
      await fetch("/api/search/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: trimmed }),
      });
      setHistory((prev) => [{ query: trimmed }, ...prev]);
    } catch (error) {
      console.error("검색 기록 저장 실패:", error);
    }

    navigate(`/home?q=${encodeURIComponent(trimmed)}`);
    setSearchInput("");
    setSuggestions([]);
  };

  // 특정 검색 기록 삭제
  const handleDelete = async (keyword) => {
    try {
      await fetch(`/api/search/history/${encodeURIComponent(keyword)}`, { method: "DELETE" });
      setHistory((prev) => prev.filter((item) => item !== keyword && item.query !== keyword));
    } catch (error) {
      console.error("검색 기록 삭제 실패:", error);
    }
  };

  // 모든 검색 기록 삭제
  const handleDeleteAll = async () => {
    try {
      await fetch("/api/search/history", { method: "DELETE" });
      setHistory([]);
    } catch (error) {
      console.error("전체 검색 기록 삭제 실패:", error);
    }
  };

  return (
    <div className="search-container">
      {/* 상단 */}
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
            {suggestions.map((s, i) => (
              <li
                key={i}
                className="suggestion-item"
                onClick={() => {
                  setSearchInput(s);
                  navigate(`/home?q=${encodeURIComponent(s)}`);
                }}>
                {s}
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
            history.map((item, index) => {
              const keyword = typeof item === "string" ? item : item.query;
              return (
                <li key={index} className="history-item">
                  <FontAwesomeIcon icon={faClock} className="search-marker-image" />
                  <span
                    className="history-query"
                    onClick={() => navigate(`/home?q=${encodeURIComponent(keyword)}`)}
                  >
                    {keyword}
                  </span>
                  <button className="Sdelete-button" onClick={() => handleDelete(keyword)}>×</button>
                </li>
              );
            })
          ) : (
            <li>검색 기록이 없습니다.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SearchTable;
