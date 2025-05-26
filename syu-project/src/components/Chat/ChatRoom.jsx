import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
import { FaBars, FaArrowLeft } from "react-icons/fa";
import "../Loader/Loader.css"; // ✅ 로딩 스타일 추가
import "./Chat.css";
import { MoonLoader } from "react-spinners";


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
  const [itemTitle, setItemTitle] = useState(location.state?.itemTitle || ""); // ✅ 초기 제목

  const senderId = localStorage.getItem("senderId");
  const isBuyer = senderId && senderId !== chatSellerId;

  // ✅ 채팅방 정보 fallback
  useEffect(() => {
    if (itemId && chatSellerId && buyerId) return;

    const fetchChatRoomDetails = async () => {
      try {
        const res = await axios.get(`/api/chat-rooms/${chatRoomId}`);
        setItemId(res.data.itemId);
        setChatSellerId(res.data.sellerId);
        setBuyerId(res.data.buyerId);
      } catch (err) {
        console.error("❌ 채팅방 정보 조회 실패:", err);
      }
    };

    fetchChatRoomDetails();
  }, [chatRoomId]);

  // ✅ 거래 ID 조회
  useEffect(() => {
    if (!itemId || !senderId) return;

    const fetchTransactionId = async () => {
      try {
        const res = await axios.get(`/api/transactions/item/${itemId}/user/${senderId}`);
        setTransactionId(res.data.transactionId);
      } catch (err) {
        console.error("❌ 거래 ID 조회 실패:", err.response || err);
      }
    };

    fetchTransactionId();
  }, [itemId, senderId]);

  // ✅ 채팅 메시지 조회 + WebSocket 연결
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/chat-messages/${chatRoomId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("❌ 메시지 조회 실패:", err);
      }
    };
    fetchMessages();

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/chat/${chatRoomId}`, (message) => {
          const data = JSON.parse(message.body);
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

  // ✅ 아이템 상태 + 제목 조회
  useEffect(() => {
    const fetchItemInfo = async () => {
      if (!itemId) return;
      try {
        const res = await axios.get(`/api/items/${itemId}`);
        setItemStatus(res.data.status);
        if (!itemTitle) setItemTitle(res.data.title); // fallback
        if (res.data.status === "거래완료") {
          setIsCompleted(true);
        }
      } catch (err) {
        console.error("❌ 아이템 정보 조회 실패:", err);
      }
    };
    fetchItemInfo();
  }, [itemId]);

  // ✅ 거래 완료 처리
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
        alert("채팅방을 나갔습니다.");
        navigate("/chatlist");
      } catch (err) {
        alert("채팅방 삭제에 실패했습니다.");
      }
    }
  };

  // ✅ 상대방 프로필 보기
  const handleViewProfile = () => {
    const opponentId = senderId === chatSellerId ? buyerId : chatSellerId;
    if (!opponentId) {
      return alert("상대방 정보를 불러오지 못했습니다.");
    }
    navigate(`/profile/seller/${opponentId}`);
  };

  // ✅ 채팅목록으로 이동
  const handleBack = () => {
    navigate("/chatlist");
  };

  // ✅ itemTitle이 없으면 로딩 화면 표시
  if (!itemTitle) {
    return (
      <div className="loader-overlay">
        <MoonLoader color="#2670ff" size={40} />
      </div>
    );
  }

  return (
    <div className="chat-room">
      <header className="chat-header">
        <div className="chat-header-left">
          <button className="back-button" onClick={handleBack}>
            <FaArrowLeft className="back-icon" />
          </button>
          <div className="chat-header-title">{itemTitle}</div>
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
