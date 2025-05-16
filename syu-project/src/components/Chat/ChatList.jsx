import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Chat.css";
import Nav from "../Nav/Nav";

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
    fetchChats(); // 초기 로딩
    const intervalId = setInterval(fetchChats, 10000); // 🔁 10초마다 갱신
    return () => clearInterval(intervalId); // 언마운트 시 정리
  }, [senderId]);

  return (
    <div className="chat-list-container">
      <header className="chat-header"><h3>채팅</h3></header>

      <div className="chat-items">
        {loading && <p style={{ padding: "1rem" }}>불러오는 중...</p>}
        {!loading && chats.length === 0 ? (
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
