import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import "./BottomBar.css";

const BottomBar = ({ postId, price }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const navigate = useNavigate();
  const senderId = localStorage.getItem("senderId");

  // 👉 좋아요 상태 & 수 초기 로딩
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const [isLikedRes, countRes] = await Promise.all([
          fetch(`/api/likes/${postId}/is-liked?userId=${senderId}`),
          fetch(`/api/likes/${postId}/count`)
        ]);

        if (isLikedRes.ok) {
          const liked = await isLikedRes.json();
          setIsFavorite(liked);
        }

        if (countRes.ok) {
          const count = await countRes.json();
          setLikeCount(count);
        }
      } catch (err) {
        console.error("❌ 좋아요 정보 불러오기 실패:", err);
      }
    };

    fetchLikeStatus();
  }, [postId, senderId]);

  // 👉 하트 토글 핸들러
  const handleFavoriteClick = async () => {
    try {
      if (isFavorite) {
        await fetch(`/api/likes/${postId}?userId=${senderId}`, { method: "DELETE" });
        setIsFavorite(false);
        setLikeCount((prev) => prev - 1);
      } else {
        await fetch(`/api/likes/${postId}?userId=${senderId}`, { method: "POST" });
        setIsFavorite(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("❌ 좋아요 토글 실패:", err);
    }
  };

  const handleChatClick = () => {
    navigate(`/chat/${postId}`);
  };

  return (
    <div className="bottom-bar">
      <div className="bottom-bar-left">
        <FontAwesomeIcon
          icon={isFavorite ? solidHeart : regularHeart}
          className={`heart-icon ${isFavorite ? "favorite" : ""}`}
          onClick={handleFavoriteClick}
        />
        <span className="like-count">{likeCount}</span>
        <span className="price">{price.toLocaleString()}원</span>
      </div>
      <button className="chat-button" onClick={handleChatClick}>
        채팅하기
      </button>
    </div>
  );
};

export default BottomBar;
