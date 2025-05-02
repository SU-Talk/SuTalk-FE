import React, { useState } from "react";

const ChatFooter = ({ stompClient, postId, setMessages }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();

    const senderId = localStorage.getItem("senderId") || "unknown";

    if (message.trim() && stompClient && stompClient.connected) {
      const newMessage = {
        chatRoomId: Number(postId),
        senderId: senderId,
        comment: message,
      };

      console.log("[🚀 메시지 전송]:", newMessage);

      // ✅ publish 방식으로 전송!
      stompClient.publish({
        destination: "/app/chat.send", // @MessageMapping("/chat.send")와 일치해야 함
        body: JSON.stringify(newMessage),
      });

      setMessages((prev) => [
        ...prev,
        {
          ...newMessage,
          isSent: true,
          time: new Date().toLocaleTimeString(),
        },
      ]);

      setMessage("");
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
