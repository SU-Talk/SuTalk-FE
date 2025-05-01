import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 navigate 추가
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import "./BottomBar.css";

const BottomBar = ({ postId, price }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(favorites.includes(postId));
  }, [postId]);

  // 즐겨찾기 클릭 핸들러
  const handleFavoriteClick = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (isFavorite) {
      const updatedFavorites = favorites.filter((id) => id !== postId);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } else {
      favorites.push(postId);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  // 채팅하기 버튼 클릭 핸들러
  const handleChatClick = () => {
    navigate(`/chat/${postId}`); // 해당 게시글의 채팅룸으로 이동
  };

  return (
    <div className="bottom-bar">
      <div className="bottom-bar-left">
        <FontAwesomeIcon
          icon={isFavorite ? solidHeart : regularHeart}
          className={`heart-icon ${isFavorite ? "favorite" : ""}`}
          onClick={handleFavoriteClick}
        />
        <span className="price">{price}</span>
      </div>
      <button className="chat-button" onClick={handleChatClick}>
        채팅하기
      </button>
    </div>
  );
};

export default BottomBar;
