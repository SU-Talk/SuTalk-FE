import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons"; // 꽉 찬 하트
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons"; // 테두리 하트
import "./BottomBar.css";

const BottomBar = ({ postId, price }) => {
  const [isFavorite, setIsFavorite] = useState(false); // 관심 상태 관리

  // 로컬 스토리지에서 관심 내역 초기화
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(favorites.includes(postId));
  }, [postId]);

  // 관심 버튼 클릭 핸들러
  const handleFavoriteClick = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (isFavorite) {
      // 이미 관심 목록에 있다면 제거
      const updatedFavorites = favorites.filter((id) => id !== postId);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } else {
      // 관심 목록에 추가
      favorites.push(postId);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  return (
    <div className="bottom-bar">
      {/* 왼쪽: 좋아요 아이콘과 가격 */}
      <div className="bottom-bar-left">
        <FontAwesomeIcon
          icon={isFavorite ? solidHeart : regularHeart} // 상태에 따라 아이콘 변경
          className={`heart-icon ${isFavorite ? "favorite" : ""}`}
          onClick={handleFavoriteClick} // 클릭 이벤트 핸들러
        />
        <span className="price">{price}</span>
      </div>

      {/* 오른쪽: 채팅하기 버튼 */}
      <button className="chat-button">채팅하기</button>
    </div>
  );
};

export default BottomBar;
