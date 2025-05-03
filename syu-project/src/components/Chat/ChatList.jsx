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
        if (!response.ok) throw new Error("채팅 목록 불러오기 실패");
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error("❌ 채팅 목록 불러오기 실패:", error);
      }
    };

    if (senderId) {
      fetchChats();
    }
  }, [senderId]);

  return (
    <div className="chat-list-container">
      <header className="chat-header">
        <h3>채팅</h3>
      </header>
      <div className="chat-items">
        {chats.map((chat) => (
          <Link
          to={`/chat/${chat.chatroomId}`}  // ✅ 여기가 핵심 수정
          key={chat.chatroomId || idx}
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
        ))}
      </div>
      <Nav />
    </div>
  );
};

export default ChatList;
