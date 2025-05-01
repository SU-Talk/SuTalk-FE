import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";

const ChatRoom = ({ socket }) => {
  const { postId } = useParams(); // 채팅방 ID
  const [messages, setMessages] = useState([]); // 메시지 상태

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data) => {
      console.log("[클라이언트] 메시지 수신:", data); // 수신 로그
      setMessages((prev) => [...prev, data]); // 서버에서 수신한 메시지 추가
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket]);

  return (
    <div className="chat-room">
      <header className="chat-header">
        <h2>채팅방 {postId}</h2>
      </header>
      <ChatBody messages={messages} /> {/* 메시지 리스트 */}
      <ChatFooter socket={socket} setMessages={setMessages} /> {/* 입력창 */}
    </div>
  );
};

export default ChatRoom;
