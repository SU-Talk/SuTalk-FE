import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";

const ChatRoom = () => {
  const { chatRoomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    axios.get(`/api/chat-messages/${chatRoomId}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("❌ 메시지 불러오기 실패:", err));

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ WebSocket 연결됨");
        client.subscribe(`/topic/chat/${chatRoomId}`, (message) => {
          const data = JSON.parse(message.body);
          setMessages((prev) => [...prev, data]);
        });
        setStompClient(client);
      },
      onStompError: (frame) => console.error("❌ STOMP 에러:", frame),
    });

    client.activate();

    return () => {
      client.deactivate();
      console.log("❎ WebSocket 연결 해제됨");
    };
  }, [chatRoomId]);

  return (
    <div className="chat-room">
      <header className="chat-header">
        <h2>💬 채팅방 #{chatRoomId}</h2>
      </header>
      <ChatBody messages={messages} />
      <ChatFooter
        stompClient={stompClient}
        postId={chatRoomId}
        setMessages={setMessages}
      />
    </div>
  );
};

export default ChatRoom;
