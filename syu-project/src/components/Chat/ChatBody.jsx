import React, { useEffect, useRef } from "react";

const ChatBody = ({ messages }) => {
  const scrollRef = useRef(null);
  const senderId = localStorage.getItem("senderId");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chat-body">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${msg.senderId === senderId ? "sent" : "received"}`}
        >
          <p>{msg.content || msg.comment}</p>
          <span>
            {msg.sentAt
              ? new Date(msg.sentAt).toLocaleTimeString("ko-KR")
              : new Date().toLocaleTimeString("ko-KR")}
          </span>
        </div>
      ))}
      <div ref={scrollRef}></div>
    </div>
  );
};

export default ChatBody;
