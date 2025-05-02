import React, { useState } from "react";

const ChatFooter = ({ stompClient, postId, setMessages }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();

    const senderId = localStorage.getItem("senderId") || "unknown";

    if (!stompClient || !stompClient.connected) {
      console.warn("⚠️ 메시지를 전송할 수 없습니다. WebSocket 연결 상태를 확인하세요.");
      return;
    }

    const newMessage = {
      chatRoomId: Number(postId),
      senderId: senderId,
      comment: message,
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
