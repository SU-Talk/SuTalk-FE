import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "@/axiosInstance";
import "./Search.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faClock, faSearch } from "@fortawesome/free-solid-svg-icons";

const Search = () => {
  const [history, setHistory] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("senderId");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await axios.get(`/search-history`, {
          params: { userId },
        });
        const formatted = data.map((item, idx) => ({
          id: idx + 1,
          query: item,
        }));
        setHistory(formatted);
      } catch (error) {
        console.error("❌ 검색 기록 오류:", error);
        setHistory([]);
      }
    };
    if (userId) fetchHistory();
  }, [userId]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchInput.trim()) return;
      try {
        const { data } = await axios.get(`/items/suggest`, {
          params: { keyword: searchInput },
        });
        setSuggestions(data);
      } catch (error) {
        console.error("❌ 추천어 요청 실패:", error);
      }
    };
    const delay = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delay);
  }, [searchInput]);

  const handleSearch = async (keyword) => {
    const query = keyword || searchInput.trim();
    if (!query) return;

    try {
      await axios.post(`/search-history`, {
        keyword: query,
        userId,
      });
    } catch (error) {
      console.error("❌ 검색어 저장 실패:", error);
    }

    navigate(`/home?q=${encodeURIComponent(query)}`);
    setSearchInput("");
    setSuggestions([]);
  };

  const handleDelete = async (keyword) => {
    try {
      await axios.delete(`/search-history/${encodeURIComponent(keyword)}`, {
        params: { userId },
      });
      setHistory((prev) => prev.filter((item) => item.query !== keyword));
    } catch (error) {
      console.error("❌ 삭제 실패:", error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await axios.delete(`/search-history`, {
        params: { userId },
      });
      setHistory([]);
    } catch (error) {
      console.error("❌ 전체 삭제 실패:", error);
    }
  };

  return (
    <div className="search-container">
      <div className="header">
        <Link to="/home">
          <button className="search-back-button">
            <FontAwesomeIcon icon={faChevronLeft} className="search-back-image" />
          </button>
        </Link>
        <div className="search-bar-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="원하는 물건을 검색"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-btn" onClick={() => handleSearch()}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>

      {suggestions.length > 0 && (
        <ul className="suggestion-list">
          {suggestions.map((item) => (
            <li
              key={item.itemId}
              className="suggestion-item with-image"
              onClick={() => navigate(`/post/${item.itemId}`)}
            >
              {item.thumbnail ? (
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}${item.thumbnail}`}
                  alt="썸네일"
                  className="suggestion-thumb"
                />
              ) : (
                <div className="suggestion-thumb placeholder" />
              )}
              <span className="suggestion-title">{item.title}</span>
            </li>
          ))}
        </ul>
      )}

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
                  onClick={() => handleSearch(item.query)}
                >
                  {item.query}
                </span>
                <button
                  className="Sdelete-button"
                  onClick={() => handleDelete(item.query)}
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

export default Search;
