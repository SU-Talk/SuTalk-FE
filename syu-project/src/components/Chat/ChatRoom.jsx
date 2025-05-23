import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import axios from "@/api/axiosInstance";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
import { FaBars, FaArrowLeft } from "react-icons/fa";
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
  const [menuOpen, setMenuOpen] = useState(false);

  const [itemId, setItemId] = useState(location.state?.itemId || null);
  const [chatSellerId, setChatSellerId] = useState(location.state?.sellerId || null);
  const [buyerId, setBuyerId] = useState(location.state?.buyerId || null);

  const senderId = localStorage.getItem("senderId");
  const isBuyer = senderId && senderId !== chatSellerId;

  // ✅ 1. fallback: 채팅방 정보 조회

useEffect(() => {
  if (itemId && chatSellerId && buyerId) return;

  const fetchChatRoomDetails = async () => {
    try {
      const res = await axios.get(`/api/chat-rooms/${chatRoomId}`);
      console.log("📦 fallback 채팅방 정보:", res.data);
      setItemId(res.data.itemId);
      setChatSellerId(res.data.sellerId);
      setBuyerId(res.data.buyerId);
    } catch (err) {
      console.error("❌ 채팅방 정보 조회 실패:", err);
    }
  };

  fetchChatRoomDetails();
}, [chatRoomId]);

// ✅ 2. itemId와 senderId가 둘 다 있을 때만 거래 정보 요청
useEffect(() => {
  if (!itemId || !senderId) return;

  const fetchTransactionId = async () => {
    try {
      const res = await axios.get(`/api/transactions/item/${itemId}/user/${senderId}`);
      setTransactionId(res.data.transactionId);
      console.log("✅ 거래 ID:", res.data.transactionId);
    } catch (err) {
      console.error("❌ 거래 ID 조회 실패:", err.response || err);
    }
  };

  fetchTransactionId();
}, [itemId, senderId]);



  // ✅ 3. 채팅 메시지 조회 + WebSocket 연결
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/chat-messages/${chatRoomId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("❌ 메시지 조회 실패:", err);
      }
    };
    fetchMessages();

    const client = new Client({
      brokerURL: `${import.meta.env.VITE_API_BASE_URL.replace(/^http/, "ws")}/ws`,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/chat/${chatRoomId}`, (message) => {
          const data = JSON.parse(message.body);
          console.log("📥 서버에서 받은 메시지:", data); // 🔥 꼭 찍어봐!
          setMessages((prev) => [...prev, data]);
        });
        setStompClient(client);
      },
      onStompError: (frame) => {
        console.error("❌ STOMP 오류:", frame);
      },
    });

    client.activate();
    return () => client.deactivate();
  }, [chatRoomId]);

  // ✅ 4. 아이템 상태 조회 (거래 완료 여부 확인)
  useEffect(() => {
    const fetchItemStatus = async () => {
      if (!itemId) return;
      try {
        const res = await axios.get(`/items/${itemId}`);
        setItemStatus(res.data.status);
        if (res.data.status === "거래완료") {
          setIsCompleted(true);
        }
      } catch (err) {
        console.error("❌ 아이템 상태 조회 실패:", err);
      }
    };
    fetchItemStatus();
  }, [itemId]);

  // ✅ 거래 완료
  const handleCompleteDeal = async () => {
    try {
      await axios.post(`/items/${itemId}/complete?chatRoomId=${chatRoomId}`);
      alert("거래가 완료되었습니다.");
      setIsCompleted(true);
      setItemStatus("거래완료");
    } catch (err) {
      alert("거래 완료 실패");
    }
  };

  // ✅ 후기 작성
  const handleReviewWrite = () => {
    if (!transactionId) {
      return alert("리뷰 대상 정보가 없습니다.");
    }

    navigate("/review", {
      state: {
        itemId,
        buyerId: senderId,
        sellerId: chatSellerId,
        transactionId,
      },
    });
  };

  // ✅ 채팅방 나가기
  const handleLeaveChat = async () => {
    if (window.confirm("정말 채팅방을 나가시겠습니까?")) {
      try {
        await axios.delete(`/api/chat-rooms/${chatRoomId}`);
        alert("채팅방이 삭제되었습니다.");
        navigate("/chatlist");
      } catch (err) {
        alert("채팅방 삭제 실패");
      }
    }
  };

  // ✅ 상대방 프로필 보기
  const handleViewProfile = () => {
    const opponentId = senderId === chatSellerId ? buyerId : chatSellerId;
    if (!opponentId) {
      alert("상대방 정보를 불러오지 못했습니다.");
      return;
    }
    navigate(`/profile/seller/${opponentId}`);
  };

  // ✅ 채팅목록으로
  const handleBack = () => {
    navigate("/chatlist");
  };

  return (
    <div className="chat-room">
      <header className="chat-header">
        <div className="chat-header-left">
          <button className="back-button" onClick={handleBack}>
            <FaArrowLeft className="back-icon" />
          </button>
          <div className="chat-header-title">채팅방 #{chatRoomId}</div>
        </div>

        <div className="chat-header-right">
          {!isCompleted && senderId === chatSellerId && (
            <button onClick={handleCompleteDeal} className="complete-button">
              거래 완료
            </button>
          )}
          <button className="menu-icon-button" onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars />
          </button>
          {menuOpen && (
            <div className="chat-menu-dropdown">
              <button onClick={handleViewProfile}>👤 상대방 프로필</button>
              <button onClick={handleLeaveChat}>🚪 채팅방 나가기</button>
            </div>
          )}
        </div>
      </header>

      <ChatBody messages={messages} />

      {isCompleted && isBuyer ? (
        <div className="review-banner">
          <button onClick={handleReviewWrite}>📝 후기 작성하기</button>
        </div>
      ) : null}

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
