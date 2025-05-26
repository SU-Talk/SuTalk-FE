import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../Nav/Nav";
import { MoonLoader } from "react-spinners";
import "./Chat.css";
import "../Loader/Loader.css";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const senderId = localStorage.getItem("senderId");

  const fetchChats = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const res = await fetch(`/api/chat-rooms?userId=${senderId}`);
      if (!res.ok) throw new Error("채팅 목록 조회 실패");
      const data = await res.json();
      console.log("📦 chats:", data);
      setChats(data);
    } catch (err) {
      console.error("❌ 채팅 목록 오류:", err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    if (!senderId) return;
    fetchChats(true);
    const intervalId = setInterval(() => fetchChats(false), 10000);
    return () => clearInterval(intervalId);
  }, [senderId]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "오후" : "오전";
    const hour12 = hours % 12 || 12;
    return `${ampm} ${hour12}:${minutes}`;
  };

  const getThumbnailPath = (itemImages) => {
    if (!itemImages || itemImages.length === 0) {
      return "/assets/default-image.png";
    }
    const filename = itemImages[0].split("/").pop();
    return `/uploads/thumbnails/thumb_${filename}`;
  };

  return (
    <>
      {loading && (
        <div className="loader-overlay">
          <MoonLoader color="#2670ff" size={40} />
        </div>
      )}

      <div className="chat-list-container">
        <header className="chat-header">
          <h3>채팅</h3>
        </header>

        <div className="chat-items" style={{ minHeight: 200 }}>
          {!loading && chats.length === 0 && (
            <p style={{ padding: "1rem" }}>채팅방이 없습니다</p>
          )}

          {!loading &&
            chats.map((chat, idx) => (
              <Link
                key={chat.chatroomId || idx}
                to={`/chat/${chat.chatroomId}`}
                state={{
                  itemId: chat.itemId,
                  sellerId: chat.sellerUserid || chat.sellerId,
                }}
                className="chat-item"
              >
                <img
                  src={getThumbnailPath(chat.itemImages)}
                  alt="thumbnail"
                  className="chat-thumbnail"
                />
                <div className="chat-info">
                  <h3>{chat.sellerUserid || chat.sellerId}</h3>
                  <p>{chat.meetLocation}</p>
                  <p>{chat.itemTitle}</p>
                </div>
                <span className="chat-time">{formatTime(chat.createdAt)}</span>
              </Link>
            ))}
        </div>

        <Nav />
      </div>
    </>
  );
};

export default ChatList;
