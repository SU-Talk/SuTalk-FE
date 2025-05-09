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
  const [itemStatus, setItemStatus] = useState("");
  const [transactionId, setTransactionId] = useState(null);

  const itemId = location.state?.itemId;
  const chatSellerId = location.state?.sellerId;
  const senderId = localStorage.getItem("senderId");
  const isBuyer = senderId && senderId !== chatSellerId;

  // 거래 ID 조회
  useEffect(() => {
    if (itemId && senderId) {
      axios
        .get(`/api/transactions/item/${itemId}/user/${senderId}`)
        .then(res => setTransactionId(res.data.transactionId))
        .catch(err => console.error("❌ 거래 ID 조회 실패:", err));
    }
  }, [itemId, senderId]);

  useEffect(() => {
    axios.get(`/api/chat-messages/${chatRoomId}`)
      .then(res => setMessages(res.data))
      .catch(err => console.error("❌ 메시지 조회 실패:", err));

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/chat/${chatRoomId}`, (message) => {
          const data = JSON.parse(message.body);
          setMessages(prev => [...prev, data]);
        });
        setStompClient(client);
      },
      onStompError: frame => console.error("❌ STOMP 오류:", frame),
    });

    client.activate();
    return () => client.deactivate();
  }, [chatRoomId]);

  useEffect(() => {
    if (!itemId) return;
    axios.get(`/api/items/${itemId}`)
      .then(res => {
        setItemStatus(res.data.status);
        if (res.data.status === "거래완료") setIsCompleted(true);
      })
      .catch(err => console.error("❌ 아이템 상태 조회 실패:", err));
  }, [itemId]);

  const handleCompleteDeal = async () => {
    try {
      await axios.post(`/api/items/${itemId}/complete?chatRoomId=${chatRoomId}`);
      alert("거래가 완료되었습니다.");
      setIsCompleted(true);
      setItemStatus("거래완료");
    } catch (err) {
      alert("거래 완료 실패");
    }
  };

  const handleReviewWrite = () => {
    if (!transactionId) return alert("리뷰 대상 정보가 없습니다.");
    navigate("/review", {
      state: {
        itemId,
        buyerId: senderId,
        sellerId: chatSellerId,
        transactionId
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

      {isCompleted && isBuyer && (
        <div className="review-banner">
          <button onClick={handleReviewWrite}>📝 후기 작성하기</button>
        </div>
      )}

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
