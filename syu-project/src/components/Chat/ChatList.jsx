import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../Nav/Nav";
import { MoonLoader } from "react-spinners";
import "./Chat.css"; // 필요시

import "../Loader/Loader.css";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const senderId = localStorage.getItem("senderId");

  const fetchChats = async () => {
    if (!senderId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/chat-rooms?userId=${senderId}`);
      if (!res.ok) throw new Error("채팅 목록 조회 실패");
      const data = await res.json();
      setChats(data);
    } catch (err) {
      console.error("❌ 채팅 목록 오류:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChats();
    const intervalId = setInterval(fetchChats, 10000);
    return () => clearInterval(intervalId);
  }, [senderId]);

  return (
    <div className="chat-list-container">
      {/* 로딩 오버레이 */}
      {loading && (
        <div className="loader-overlay">
          <MoonLoader color="#2670ff" size={40} />
        </div>
      )}

      <header className="chat-header">
        <h3>채팅</h3>
      </header>

      <div className="chat-items" style={{ minHeight: 200 }}>
        {chats.length === 0 ? (
          <p style={{ padding: "1rem" }}></p>
        ) : (
          chats.map((chat, idx) => (
            <Link
              key={chat.chatroomId || idx}
              to={`/chat/${chat.chatroomId}`}
              state={{
                itemId: chat.itemId,
                sellerId: chat.sellerId,
              }}
              className="chat-item">
              <div className="chat-info">
                <h3>{chat.sellerUsername}</h3>
                <p className="chat-last-message">
                  {chat.lastMessage || "메시지 없음"}
                </p>
              </div>
              <span className="chat-time">
                {new Date(chat.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </Link>
          ))
        )}
      </div>

      <Nav />
    </div>
  );
};

export default ChatList;
