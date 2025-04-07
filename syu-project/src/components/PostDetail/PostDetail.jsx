import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./PostDetail.css";
import TopBar from "../TopBar/TopBar";
import BottomBar from "../BottomBar/BottomBar";

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0); // 터치 시작 위치
  const [touchEnd, setTouchEnd] = useState(0); // 터치 종료 위치

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/dummyData.json`);
        if (!response.ok) throw new Error("Failed to fetch post data");
        const data = await response.json();
        const selectedPost = data.posts.find(
          (p) => p.id === postId || p.id === parseInt(postId)
        );
        setPost(selectedPost);
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
      setCurrentImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  const images = post.images || [post.thumbnail || "/assets/default-image.png"];

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="post-detail-container">
      <TopBar />
      <div
        className="slider-container"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}>
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
              onClick={() => handleDotClick(index)}></span>
          ))}
        </div>
      </div>
      <div className="comment-container">
        <h1>{post.title}</h1>
        <div className="category-tag">{post.category}</div>
        <div className="description">
          <p>{post.comment}</p>
        </div>
        {/* <h3>가격: {post.price}</h3> */}
        <p>게시일: {post.time}</p>
      </div>
      <BottomBar postId={postId} price={post.price} />
    </div>
  );
};

export default PostDetail;
