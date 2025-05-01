import React, { useEffect, useRef } from "react";

const ChatBody = ({ messages }) => {
  const scrollRef = useRef(null); // 마지막 메시지를 참조하기 위한 ref 생성

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" }); // 최신 메시지로 스크롤
    }
  }, [messages]); // messages 상태 변경 시 실행

  return (
    <div className="chat-body">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${msg.isSent ? "sent" : "received"}`}>
          <p>{msg.text}</p>
          <span>{msg.time}</span>
        </div>
      ))}
      {/* 마지막 메시지를 참조할 빈 div */}
      <div ref={scrollRef}></div>
    </div>
  );
};

export default ChatBody;
