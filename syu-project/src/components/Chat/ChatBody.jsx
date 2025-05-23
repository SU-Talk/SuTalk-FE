import React, { useEffect, useRef } from "react";
import dayjs from "dayjs"; // ⬅️ 설치 필요: npm install dayjs

const ChatBody = ({ messages }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "시간 없음";
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
        console.log("🖨 렌더링할 메시지:", msg);
        console.log("📦 senderId 비교:", msg.senderId, localStorage.getItem("senderId")); // ✅ 여기에 위치
        return (
          <div
            key={index}
            className={`message ${
              msg.senderId === localStorage.getItem("senderId") ? "sent" : "received"
            }`}
          >
            <p>{msg.content || msg.messageContent || msg.comment || "(내용 없음)"}</p>
            <span>{msg.sentAt ? formatTime(msg.sentAt) : "시간 없음"}</span>
          </div>
        );
      })}
      <div ref={scrollRef}></div>
    </div>
  );
};


export default ChatBody;
