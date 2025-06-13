import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PostDetail.css";
import TopBar from "../TopBar/TopBar";
import BottomBar from "../BottomBar/BottomBar";
import { MoonLoader } from "react-spinners";
import "../Loader/Loader.css"; // ✅ Loader 폴더에 있는 css

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [prevImageIndex, setPrevImageIndex] = useState(0);

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

  const images =
    post?.itemImages?.length > 0
      ? post.itemImages.map(
          (path) => `/uploads/thumbnails/thumb_${path.split("/").pop()}`
        )
      : ["/assets/default-image.png"];

  const changeImage = (nextIndex) => {
    setPrevImageIndex(currentImageIndex);
    setCurrentImageIndex(nextIndex);
  };

  const formattedDate = post
    ? new Date(Number(post.regdate)).toLocaleDateString("ko-KR")
    : "";

  return (
    <div className="post-detail-container">
      {loading && (
        <div className="loader-overlay">
          <MoonLoader color="#2670ff" size={40} />
        </div>
      )}

      {!loading && post && (
        <>
          <TopBar />

          <div className="image-slider">
            <img
              src={images[prevImageIndex]}
              className="slider-image fade-out"
              alt="이전 이미지"
              key={`prev-${prevImageIndex}`}
            />
            <img
              src={images[currentImageIndex]}
              className="slider-image fade-in"
              alt="현재 이미지"
              key={`current-${currentImageIndex}`}
            />

            {images.length > 1 && (
              <>
                <button
                  className="slider-button left"
                  onClick={() =>
                    changeImage(
                      (currentImageIndex - 1 + images.length) % images.length
                    )
                  }
                >
                  &lt;
                </button>
                <button
                  className="slider-button right"
                  onClick={() =>
                    changeImage((currentImageIndex + 1) % images.length)
                  }
                >
                  &gt;
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="indicator-dots">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${index === currentImageIndex ? "active" : ""}`}
                  onClick={() => changeImage(index)}
                ></span>
              ))}
            </div>
          )}

          <div className="comment-container">
            <h1>{post.title}</h1>
            <div className="category-tag">{post.category}</div>

            <div className="seller-info">
              <span>판매자:</span>
              <span
                className="seller-name"
                onClick={() => navigate(`/profile/seller/${post.sellerId}`)}
              >
                {post.sellerName || `${post.sellerId?.slice(-3)}`}
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

          <BottomBar
            postId={postId}
            price={post.price}
            sellerId={post.sellerId}
          />
        </>
      )}
    </div>
  );
};

export default PostDetail;
