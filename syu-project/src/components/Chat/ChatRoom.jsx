import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";

const ChatRoom = () => {
  const { postId } = useParams(); // chatRoomId
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    // 🔁 1. 과거 채팅 불러오기
    axios
      .get(`/api/chat-messages/${postId}`)
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => {
        console.error("❌ 메시지 불러오기 실패:", err);
      });

    // 🔌 2. WebSocket 연결
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ WebSocket 연결 성공");

        client.subscribe(`/topic/chat/${postId}`, (message) => {
          const data = JSON.parse(message.body);
          setMessages((prev) => [...prev, data]);
        });

        // ✅ 연결된 이후에만 stompClient 저장
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
