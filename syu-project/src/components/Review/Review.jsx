import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Review.css";

const Review = () => {
  const [rating, setRating] = useState(0); // 별점 상태
  const [reviewText, setReviewText] = useState(""); // 리뷰 내용 상태
  const navigate = useNavigate();

  // 별점 클릭 핸들러
  const handleRating = (index) => {
    setRating(index + 1); // 클릭한 별의 인덱스에 1을 더해 별점 설정
  };

  // 완료 버튼 클릭 핸들러
  const handleComplete = () => {
    if (!rating) {
      alert("별점을 선택해주세요.");
      return;
    }
    if (!reviewText.trim()) {
      alert("리뷰 내용을 작성해주세요.");
      return;
    }
    alert(`별점: ${rating}점\n리뷰 내용: ${reviewText}`);
    navigate(-1); // 완료 후 이전 페이지로 이동
  };

  // 신고하기 핸들러
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
