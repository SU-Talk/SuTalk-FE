import React, { useState } from "react";

const ChatFooter = ({ stompClient, chatRoomId, setMessages }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    const senderId = localStorage.getItem("senderId");
  
    if (!stompClient || !stompClient.connected) {
      console.warn("⚠️ WebSocket 연결 안됨");
      return;
    }
  
    const newMessage = {
      chatRoomId: Number(chatRoomId),
      senderId,
      content: message,
    };
  
    stompClient.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(newMessage),
    });
  
    setMessage("");
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
