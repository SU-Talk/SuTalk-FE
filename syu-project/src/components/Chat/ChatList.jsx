import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../Nav/Nav";
import { MoonLoader } from "react-spinners";
import "./Chat.css";
import "../Loader/Loader.css";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ 최초만 true
  const senderId = localStorage.getItem("senderId");

  const fetchChats = async (isInitial = false) => {
    if (isInitial) setLoading(true); // ✅ 첫 진입일 때만 전체 로딩
    try {
      const res = await fetch(`/api/chat-rooms?userId=${senderId}`);
      if (!res.ok) throw new Error("채팅 목록 조회 실패");
      const data = await res.json();
      setChats(data);
    } catch (err) {
      console.error("❌ 채팅 목록 오류:", err);
    } finally {
      if (isInitial) setLoading(false); // ✅ 첫 진입 끝나면 로딩 false
    }
  };

  useEffect(() => {
    if (!senderId) return;

    fetchChats(true); // ✅ 첫 진입용 로딩
    const intervalId = setInterval(() => fetchChats(false), 10000); // ✅ 이후부터는 스피너 없음
    return () => clearInterval(intervalId);
  }, [senderId]);

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
            chats.length > 0 &&
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
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </Link>
            ))}
        </div>

        <Nav />
      </div>
    </>
  );
};

export default ChatList;
