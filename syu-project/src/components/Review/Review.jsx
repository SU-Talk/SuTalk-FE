// Review.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Review.css";

const Review = () => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [sellerProfile, setSellerProfile] = useState(null); // sellerName → 객체 저장
  const navigate = useNavigate();
  const location = useLocation();

  const { itemId, buyerId, sellerId, transactionId } = location.state || {};

  useEffect(() => {
    if (sellerId) {
      axios
        .get(`/api/users/${sellerId}`)
        .then((res) => setSellerProfile(res.data))
        .catch((err) => console.error("❌ 판매자 정보 조회 실패:", err));
    }
  }, [sellerId]);

  const handleRating = (index) => setRating(index + 1);

  const handleComplete = async () => {
    if (!rating || !reviewText.trim() || !itemId || !buyerId || !transactionId || !sellerId) {
      return alert("리뷰 대상 정보가 없습니다.");
    }

    try {
      await axios.post("/api/reviews", {
        itemId,
        buyerId,
        revieweeId: sellerId,
        transactionId,
        rating,
        comment: reviewText,
      });
      alert("리뷰가 저장되었습니다!");
      navigate(-1);
    } catch (err) {
      console.error("❌ 리뷰 저장 오류:", err);
      alert("리뷰 저장에 실패했습니다.");
    }
  };

  const handleReport = () => {
    if (!buyerId || !sellerId || !itemId) {
      alert("신고 대상 정보가 부족합니다.");
      return;
    }

    navigate("/report", {
      state: {
        reporterId: buyerId,
        reportedId: sellerId,
        itemId: itemId,
      },
    });
  };

  const sellerDisplayName =
    sellerProfile?.userid || `test-user-${sellerId?.slice(-3)}`;

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
          <img loading="lazy" src="/assets/수야.png" alt="프로필 이미지" className="profile-image" />
        </div>
        <h3 className="profile-name">{sellerDisplayName}</h3>

        <div className="stars">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={`star ${index < rating ? "filled" : ""}`}
              onClick={() => handleRating(index)}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          className="review-textarea"
          placeholder="리뷰 내용을 작성해주세요."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        ></textarea>

        <button className="complete-button" onClick={handleComplete}>
          완료
        </button>
      </div>
    </div>
  );
};

export default Review;
