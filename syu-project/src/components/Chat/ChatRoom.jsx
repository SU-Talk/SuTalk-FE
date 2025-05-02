import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";

const ChatRoom = () => {
  const { postId: chatRoomId } = useParams(); // postId → chatRoomId
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    // 🔁 1. 과거 채팅 불러오기
    axios
      .get(`/api/chat-messages/${chatRoomId}`)
      .then((res) => {
        const formattedMessages = res.data.map((msg) => ({
          ...msg,
          time: new Date(msg.sentAt).toLocaleTimeString(), // 시간 포맷팅
          isSent: msg.senderId === localStorage.getItem("senderId"), // 내가 보낸 메시지 여부
        }));
        setMessages(formattedMessages);
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

        client.subscribe(`/topic/chat/${chatRoomId}`, (message) => {
          const data = JSON.parse(message.body);
          const formatted = {
            ...data,
            time: new Date(data.sentAt).toLocaleTimeString(),
            isSent: data.senderId === localStorage.getItem("senderId"),
          };
          setMessages((prev) => [...prev, formatted]);
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
  }, [chatRoomId]);

  return (
    <div className="chat-room">
      <header className="chat-header">
        <h2>💬 채팅방 {chatRoomId}</h2>
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
