import React, { useState } from "react";

const ChatFooter = ({ socket, setMessages }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        text: message,
        time: new Date().toLocaleTimeString(),
        isSent: true,
      };

      console.log("[클라이언트] 메시지 전송:", newMessage); // 송신 로그
      socket.emit("message", newMessage); // 서버로 메시지 전송

      setMessages((prev) => [...prev, newMessage]); // 상태 업데이트
      setMessage(""); // 입력창 초기화
    }
  };

  return (
    <form className="chat-footer" onSubmit={handleSendMessage}>
      <input
        type="text"
        placeholder="메시지를 입력하세요..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">전송</button>
    </form>
  );
};

export default ChatFooter;
