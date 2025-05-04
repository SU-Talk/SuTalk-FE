import React, { useEffect, useRef } from "react";

const ChatBody = ({ messages }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="chat-body">
      {messages.map((msg, index) => {
        console.log("📦 [클라] 렌더링할 메시지:", msg);
        return (
          <div
            key={index}
            className={`message ${msg.senderId === localStorage.getItem("senderId") ? "sent" : "received"}`}
          >
            <p>{msg.content || msg.comment}</p>
            <span>{msg.sentAt ? formatTime(msg.sentAt) : "시간 없음"}</span>
          </div>
        );
      })}
      <div ref={scrollRef}></div>
    </div>
  );
};

export default ChatBody;
