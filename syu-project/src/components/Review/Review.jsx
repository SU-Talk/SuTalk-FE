import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Review.css";

const Review = () => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // itemId, buyerId를 location.state로 받는다
  const { itemId } = location.state || {};
  const buyerId = localStorage.getItem("senderId");

  const handleRating = (index) => {
    setRating(index + 1);
  };

  const handleComplete = async () => {
    if (!rating) {
      alert("별점을 선택해주세요.");
      return;
    }
    if (!reviewText.trim()) {
      alert("리뷰 내용을 작성해주세요.");
      return;
    }
    if (!itemId || !buyerId) {
      alert("리뷰 대상 정보가 없습니다.");
      return;
    }

    try {
      await axios.post("/api/reviews", {
        itemId,
        buyerId,
        rating,
        comment: reviewText,
      });
      alert("리뷰가 저장되었습니다!");
      navigate(-1);
    } catch (err) {
      console.error("리뷰 저장 오류:", err);
      alert("리뷰 저장에 실패했습니다.");
    }
  };

  const handleReport = () => {
    navigate("/report");
  };

  return (
    <div className="review-container">
      <header className="review-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          &lt;
        </button>
        <h3>리뷰하기</h3>
        <button className="report-button" onClick={handleReport}>
          신고
        </button>
      </header>
      <div className="review-content">
        <div className="profile-avatar">
          <img
            src="/assets/수야.png"
            alt="프로필 이미지"
            className="profile-image"
          />
        </div>
        <h3 className="profile-name">궁예</h3>
        <div className="stars">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={`star ${index < rating ? "filled" : ""}`}
              onClick={() => handleRating(index)}>
              ★
            </span>
          ))}
        </div>
        <textarea
          className="review-textarea"
          placeholder="리뷰 내용을 작성해주세요."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}></textarea>
        <button className="complete-button" onClick={handleComplete}>
          완료
        </button>
      </div>
    </div>
  );
};

export default Review;
