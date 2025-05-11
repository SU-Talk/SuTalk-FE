import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PostDetail.css";
import TopBar from "../TopBar/TopBar";
import BottomBar from "../BottomBar/BottomBar";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/items/${postId}`);
        if (!response.ok) throw new Error("Failed to fetch post data");
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("❌ 게시글 데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleStartChat = async () => {
    const buyerId = localStorage.getItem("senderId");
    const sellerId = post?.sellerId;

    if (!buyerId || !sellerId) {
      alert("로그인 또는 판매자 정보가 필요합니다.");
      return;
    }

    try {
      const transactionRes = await fetch(`/api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerId, sellerId, itemId: postId }),
      });

      if (!transactionRes.ok) throw new Error("거래 생성 실패");
      const transactionData = await transactionRes.json();
      const transactionId = transactionData.transactionid;

      const chatRoomRes = await fetch(`/api/chat-rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemTransactionId: transactionId,
          buyerId,
          sellerId,
        }),
      });

      if (!chatRoomRes.ok) throw new Error("채팅방 생성 실패");

      const chatRoomData = await chatRoomRes.json();
      const chatRoomId =
        chatRoomData.chatroomId ||
        chatRoomData.chatRoomId ||
        chatRoomData.chatroomid;

      if (!chatRoomId) throw new Error("chatRoomId가 응답에 없습니다!");

      navigate(`/chat/${chatRoomId}`);
    } catch (error) {
      console.error("❌ 채팅 시작 실패:", error);
      alert("채팅을 시작하는 도중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  const images =
    post?.itemImages?.map((path) => `http://localhost:8080${path}`) || [
      post?.thumbnail
        ? `http://localhost:8080${post.thumbnail}`
        : "/assets/default-image.png",
    ];

  const formattedDate = new Date(Number(post.regdate)).toLocaleDateString("ko-KR");

  return (
    <div className="post-detail-container">
      <TopBar />
      <img
        src={images[currentImageIndex]}
        alt="상품 이미지"
        className="slider-image"
      />
      <div className="comment-container">
        <h1>{post.title}</h1>
        <div className="category-tag">{post.category}</div>

        <div className="seller-info">
          <span>판매자:</span>
          <span
            className="seller-name"
            onClick={() => navigate(`/profile/seller/${post.sellerId}`)}
          >
            {post.sellerName || `test-user-${post.sellerId?.slice(-3)}`}
          </span>
        </div>

        <p className="description-text">{post.description}</p>

        <div className="info-row">
          <span>📍 {post.meetLocation}</span>
          <span>🕒 {formattedDate}</span>
        </div>

        <button className="chat-button" onClick={handleStartChat}>
          💬 채팅하기
        </button>
      </div>

      <BottomBar postId={postId} price={post.price} sellerId={post.sellerId} />

    </div>
  );
};

export default PostDetail;
