import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";

const ChatRoom = () => {
  const { postId } = useParams();
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws", // ✨ SockJS 제거 버전
      reconnectDelay: 5000, // 재연결 옵션 (선택)
      onConnect: () => {
        console.log("✅ WebSocket 연결 성공");

        client.subscribe(`/topic/chat/${postId}`, (message) => {
          const data = JSON.parse(message.body);
          setMessages((prev) => [...prev, data]);
        });

        setStompClient(client);
      },
      onStompError: (frame) => {
        console.error("❌ STOMP 에러:", frame);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
      console.log("❎ WebSocket 연결 해제");
    };
  }, [postId]);

  if (!stompClient) {
    return <p>🔌 채팅 서버 연결 중입니다... 잠시만 기다려주세요</p>;
  }

  return (
    <div className="chat-room">
      <header className="chat-header">
        <h2>💬 채팅방 {postId}</h2>
      </header>
      <ChatBody messages={messages} />
      <ChatFooter
        stompClient={stompClient}
        postId={postId}
        setMessages={setMessages}
      />
    </div>
  );
};

export default ChatRoom;
