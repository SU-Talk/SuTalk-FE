import React, { useEffect, useState } from "react";
import axios from "@/axiosInstance";
import "./SellerReviewList.css";

const SellerReviewList = ({ sellerId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!sellerId) return;
    axios
      .get(`/reviews/seller/${sellerId}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("❌ 판매자 리뷰 조회 실패:", err));
  }, [sellerId]);

  return (
    <div className="seller-review-container">
      <h3>📮 받은 후기</h3>
      {reviews.length === 0 ? (
        <p style={{ color: "#999", fontSize: "14px", marginLeft: "4px" }}>
          아직 후기가 없습니다.
        </p>
      ) : (
        reviews.map((review, idx) => (
          <div key={idx} className="review-box">
            <div className="review-header">
              <span>👤 {review.reviewerNickname}</span>
              <span className="review-rating">⭐ {review.rating}</span>
            </div>
            <p className="review-item">📦 {review.itemTitle}</p>
            <p className="review-comment">💬 {review.comment}</p>
            <span className="review-date">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default SellerReviewList;
