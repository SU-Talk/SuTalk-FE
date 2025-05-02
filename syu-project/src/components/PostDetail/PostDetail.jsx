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
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/items/${postId}`);
        if (!response.ok) throw new Error("Failed to fetch post data");
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    setTouchEnd(e.changedTouches[0].clientX);
    const SWIPE_THRESHOLD = 50;
    if (touchStart - touchEnd > SWIPE_THRESHOLD) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    } else if (touchEnd - touchStart > SWIPE_THRESHOLD) {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const images =
    post?.itemImages?.map((path) => `http://localhost:8080${path}`) ||
    [post?.thumbnail ? `http://localhost:8080${post.thumbnail}` : "/assets/default-image.png"];

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleStartChat = async () => {
    const senderId = localStorage.getItem("senderId");
    if (!senderId) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/chat-room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: postId,
          senderId: senderId,
        }),
      });

      if (!response.ok) throw new Error("채팅방 생성 실패");

      const data = await response.json();
      const chatRoomId = data.chatRoomId;
      navigate(`/chatroom/${chatRoomId}`);
    } catch (error) {
      console.error("채팅방 이동 실패:", error);
      alert("채팅방 생성 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div className="post-detail-container">
      <TopBar />
      <div
        className="slider-container"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[currentImageIndex]}
          alt={`Slide ${currentImageIndex + 1}`}
          className="slider-image"
        />
        <div className="dots-container">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentImageIndex === index ? "active" : ""}`}
              onClick={() => handleDotClick(index)}
            ></span>
          ))}
        </div>
      </div>
      <div className="comment-container">
        <h1>{post.title}</h1>
        <div className="category-tag">{post.category}</div>
        <div className="description">
          <p>{post.description}</p>
        </div>
        <p>장소: {post.meetLocation}</p>
        <p>게시일: {post.time}</p>
        <button className="chat-button" onClick={handleStartChat}>
          💬 채팅하기
        </button>
      </div>
      <BottomBar postId={postId} price={post.price} />
    </div>
  );
};

export default PostDetail;
