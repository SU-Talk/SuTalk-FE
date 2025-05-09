// ChatRoom.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
import "./Chat.css";

const ChatRoom = () => {
  const { chatRoomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [itemStatus, setItemStatus] = useState(""); // 추가 상태 추적

  const itemId = location.state?.itemId;
  const chatSellerId = location.state?.sellerId;
  const senderId = localStorage.getItem("senderId");

  const isBuyer = senderId && senderId !== chatSellerId;

  useEffect(() => {
    console.log("🔥 상태 확인용 로그:");
    console.log("✅ isCompleted:", isCompleted);
    console.log("✅ senderId:", senderId);
    console.log("✅ sellerId:", chatSellerId);
    console.log("✅ isBuyer:", isBuyer);
  }, [isCompleted, senderId, chatSellerId]);
  

  useEffect(() => {
    // 채팅 메시지 불러오기
    axios.get(`/api/chat-messages/${chatRoomId}`)
      .then(res => {
        console.log("📩 메시지 불러오기 성공:", res.data);
        setMessages(res.data);
      })
      .catch(err => console.error("❌ 메시지 불러오기 실패:", err));

    // WebSocket 연결
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("🟢 WebSocket 연결됨");
        client.subscribe(`/topic/chat/${chatRoomId}`, (message) => {
          const data = JSON.parse(message.body);
          setMessages(prev => [...prev, data]);
        });
        setStompClient(client);
      },
      onStompError: frame => console.error("❌ STOMP 오류:", frame),
    });

    client.activate();
    return () => {
      client.deactivate();
      console.log("🔌 WebSocket 연결 해제됨");
    };
  }, [chatRoomId]);

  useEffect(() => {
    if (!itemId) return;
    axios.get(`/api/items/${itemId}`)
      .then(res => {
        setItemStatus(res.data.status);
        if (res.data.status === "거래완료") {
          console.log("✅ 아이템 상태: 거래완료");
          setIsCompleted(true);
        }
      })
      .catch(err => console.error("❌ 아이템 상태 조회 실패:", err));
  }, [itemId]);

  const handleCompleteDeal = async () => {
    try {
      await axios.post(`/api/items/${itemId}/complete?chatRoomId=${chatRoomId}`);
      alert("✅ 거래가 완료되었습니다.");
      setIsCompleted(true);
      setItemStatus("거래완료");
    } catch (err) {
      console.error("❌ 거래 완료 요청 실패:", err);
      alert("거래 완료에 실패했습니다.");
    }
  };

  const handleReviewWrite = () => {
    navigate("/review", {
      state: {
        itemId,
        buyerId: senderId,
      }
    });
  };

  return (
    <div className="chat-room">
      <header className="chat-header">
        <h2>💬 채팅방 #{chatRoomId}</h2>
        {!isCompleted && senderId === chatSellerId && (
          <button onClick={handleCompleteDeal} className="complete-button">거래 완료</button>
        )}
      </header>

      <ChatBody messages={messages} />

      {/* 후기 작성 버튼 (구매자 전용) */}
      {isCompleted && isBuyer && (
        <div className="review-banner">
          <button onClick={handleReviewWrite}>📝 후기 작성하기</button>
        </div>
      )}

      {/* 하단 입력창 or 거래 완료 배너 */}
      {isCompleted ? (
        <div className="chat-footer completed-banner">
          거래가 완료된 채팅방입니다.
        </div>
      ) : (
        <ChatFooter
          stompClient={stompClient}
          chatRoomId={chatRoomId}
          setMessages={setMessages}
        />
      )}
    </div>
  );
};

export default ChatRoom;
