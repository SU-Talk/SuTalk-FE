import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Search.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faClock } from "@fortawesome/free-solid-svg-icons";

const SearchTable = () => {
  const [history, setHistory] = useState([]); // 검색 기록 상태
  const [searchInput, setSearchInput] = useState(""); // 검색 입력 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅

  // 검색 기록 초기화 (더미 데이터 가져오기)
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/public/historyDummyData.json");
        if (!response.ok) {
          throw new Error("데이터를 가져오는데 실패했습니다.");
        }
        const data = await response.json();
        setHistory(data); // 초기 검색 기록 설정
      } catch (error) {
        console.error("검색 기록을 가져오는 중 오류 발생:", error);
        setHistory([]);
      }
    };

    fetchHistory();
  }, []);

  // 검색 실행 핸들러
  const handleSearch = () => {
    if (!searchInput.trim()) return; // 빈 입력 방지

    // 새로운 검색 기록 추가
    const newHistory = {
      id: Date.now(), // 고유 ID 생성
      query: searchInput.trim(),
    };
    setHistory((prevHistory) => [...prevHistory, newHistory]);

    // Home 페이지로 이동하며 검색어 전달
    navigate(`/home?q=${encodeURIComponent(searchInput.trim())}`);

    // 입력 필드 초기화
    setSearchInput("");
  };

  // 특정 검색 기록 삭제
  const handleDelete = (id) => {
    setHistory((prevHistory) => prevHistory.filter((item) => item.id !== id));
  };

  // 모든 검색 기록 삭제
  const handleDeleteAll = () => {
    setHistory([]);
  };

  return (
    <div className="search-container">
      {/* 상단 헤더 */}
      <div className="header">
        <Link to="/home">
          <button className="search-back-button">
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="search-back-image"
            />
          </button>
        </Link>
        <input
          type="text"
          className="search-input"
          placeholder="원하는 물건을 검색"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)} // 입력값 업데이트
          onKeyPress={(e) => e.key === "Enter" && handleSearch()} // 엔터 키로 검색 실행
        />
        <button className="search-btn" onClick={handleSearch}></button>
      </div>

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
                <FontAwesomeIcon
                  icon={faClock}
                  className="search-marker-image"
                />
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
