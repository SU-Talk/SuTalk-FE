import React from "react";
import { Link } from "react-router-dom";
import "./Chat.css";
import Nav from "../Nav/Nav";

const ChatList = () => {
  const chats = [
    { id: 1, user: "사용자1", lastMessage: "안녕하세요!", time: "10:30 AM" },
    { id: 2, user: "사용자2", lastMessage: "품절되었나요?", time: "9:45 AM" },
  ];

  return (
    <div className="chat-list-container">
      <header className="chat-header">
        <h3>채팅</h3>
      </header>
      <div className="chat-items">
        {chats.map((chat) => (
          <Link to={`/chat/${chat.id}`} key={chat.id} className="chat-item">
            <div className="chat-info">
              <h3>{chat.user}</h3>
              <p>{chat.lastMessage}</p>
            </div>
            <span className="chat-time">{chat.time}</span>
          </Link>
        ))}
      </div>
      <Nav />
    </div>
  );
};

export default ChatList;
