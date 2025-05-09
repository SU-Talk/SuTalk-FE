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
        const res = await fetch(`/api/chat-rooms?userId=${senderId}`);
        if (!res.ok) throw new Error("채팅 목록 조회 실패");
        const data = await res.json();
        setChats(data);
      } catch (err) {
        console.error("❌ 채팅 목록 오류:", err);
      }
    };

    if (senderId) fetchChats();
  }, [senderId]);

  return (
    <div className="chat-list-container">
      <header className="chat-header"><h3>채팅</h3></header>
      <div className="chat-items">
        {chats.length === 0 ? (
          <p style={{ padding: "1rem" }}>채팅방이 없습니다</p>
        ) : (
          chats.map((chat, idx) => (
            <Link
              key={chat.chatroomId || idx}
              to={`/chat/${chat.chatroomId}`}
              state={{
                itemId: chat.itemId,
                sellerId: chat.sellerId,
              }}
              className="chat-item"
            >
              <div className="chat-info">
                <h3>{chat.buyerUsername} & {chat.sellerUsername}</h3>
                <p>{chat.itemTitle}</p>
              </div>
              <span className="chat-time">
                {new Date(chat.createdAt).toLocaleTimeString([], {
                  hour: "2-digit", minute: "2-digit"
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
