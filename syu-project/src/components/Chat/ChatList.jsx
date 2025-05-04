import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Chat.css";
import Nav from "../Nav/Nav";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const senderId = localStorage.getItem("senderId");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(`/api/chat-rooms?userId=${senderId}`);
        if (!response.ok) {
          const text = await response.text();
          console.error("⚠️ 응답 상태:", response.status);
          console.error("⚠️ 응답 본문:", text);
          throw new Error("채팅 목록 불러오기 실패");
        }
        const data = await response.json();
        console.log("📦 채팅방 목록:", data);
        setChats(data);
      } catch (error) {
        console.error("❌ 채팅 목록 불러오기 실패:", error);
      }
    };

    if (senderId) fetchChats();
  }, [senderId]);

  return (
    <div className="chat-list-container">
      <header className="chat-header">
        <h3>채팅</h3>
      </header>
      <div className="chat-items">
        {chats.length === 0 ? (
          <p style={{ padding: "1rem" }}>채팅방이 없습니다</p>
        ) : (
          chats.map((chat, idx) => (
            <Link
              to={`/chat/${chat.chatroomId || chat.chatroomid}`}
              key={chat.chatroomId || chat.chatroomid || idx}
              className="chat-item"
            >
              <div className="chat-info">
                <h3>{chat.buyerUsername} & {chat.sellerUsername}</h3>
                <p>{chat.itemTitle}</p>
              </div>
              <span className="chat-time">
                {new Date(chat.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
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
