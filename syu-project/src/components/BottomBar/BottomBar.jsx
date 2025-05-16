import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import "./BottomBar.css";

const BottomBar = ({ postId, price, sellerId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const navigate = useNavigate();
  const senderId = localStorage.getItem("senderId");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;


  // 👉 좋아요 초기화
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const [isLikedRes, countRes] = await Promise.all([
          fetch(`${baseUrl}/api/likes/${postId}/is-liked?userId=${senderId}`),
          fetch(`${baseUrl}/api/likes/${postId}/count`)
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
        console.error("❌ 좋아요 상태 불러오기 실패:", err);
      }
    };

    fetchLikeStatus();
  }, [postId, senderId]);

  // 👉 좋아요 토글
    const handleFavoriteClick = async () => {
      try {
        if (isFavorite) {
          await fetch(`${baseUrl}/api/likes/${postId}?userId=${senderId}`, {
            method: "DELETE",
          });
          setIsFavorite(false);
          setLikeCount((prev) => prev - 1);
        } else {
          await fetch(`${baseUrl}/api/likes/${postId}?userId=${senderId}`, {
            method: "POST",
          });
          setIsFavorite(true);
          setLikeCount((prev) => prev + 1);
        }
      } catch (err) {
        console.error("❌ 좋아요 토글 실패:", err);
      }
    };


  // 👉 채팅 시작 로직 통일
  const handleChatClick = async () => {
    if (!senderId || !sellerId) {
      alert("로그인 또는 판매자 정보가 필요합니다.");
      return;
    }

    try {
      const transactionRes = await fetch(`${baseUrl}/api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId: senderId,
          sellerId,
          itemId: postId
        })
      });

      if (!transactionRes.ok) throw new Error("거래 생성 실패");
      const transactionData = await transactionRes.json();
      const transactionId = transactionData.transactionid;

      const chatRoomRes = await fetch(`${baseUrl}/api/chat-rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemTransactionId: transactionId,
          buyerId: senderId,
          sellerId
        })
      });

      if (!chatRoomRes.ok) throw new Error("채팅방 생성 실패");

      const chatRoomData = await chatRoomRes.json();
      const chatRoomId =
        chatRoomData.chatroomId ||
        chatRoomData.chatRoomId ||
        chatRoomData.chatroomid;

      if (!chatRoomId) throw new Error("chatRoomId 없음");

      navigate(`/chat/${chatRoomId}`);
    } catch (error) {
      console.error("❌ 채팅 시작 실패:", error);
      alert("채팅 시작 중 오류 발생");
    }
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
      <button className="bottom-chat-button" onClick={handleChatClick}>
        💬 채팅하기
      </button>
    </div>
  );
};

export default BottomBar;
