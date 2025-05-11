// components/Profile/SellerProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import SellerReviewList from "../Review/SellerReviewList";
import "./profile.css";

const SellerProfile = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  const reporterId = localStorage.getItem("senderId");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/users/${sellerId}`);
        setProfile(response.data);
      } catch (error) {
        console.error("❌ 프로필 조회 실패:", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/api/items/mine?userId=${sellerId}`);
        setPosts(response.data);
      } catch (error) {
        console.error("❌ 게시글 조회 실패:", error);
      }
    };

    fetchProfile();
    fetchPosts();
  }, [sellerId]);

  if (!profile) return <p>로딩 중...</p>;

  return (
    <div className="profile-container">
      <header className="profile-header">
        <h2>{profile.name || `test-user-${sellerId.slice(-3)}`}님의 프로필</h2>
      </header>

      <div className="profile-info">
        <div className="profile-avatar">👤</div>
        <h3>{profile.name || `test-user-${sellerId.slice(-3)}`}</h3>
        <p>
          후기 평균 ⭐ {profile.averageRating?.toFixed(1) ?? "0.0"} / 후기{" "}
          {profile.reviewCount ?? 0}개
        </p>

        {/* 🚨 신고 버튼을 프로필 정보 아래로 이동 */}
        <button
          className="edit-profile-button"
          onClick={() =>
            navigate("/report", {
              state: { reporterId, reportedId: sellerId, itemId: null },
            })
          }
        >
          🚨 신고하기
        </button>
      </div>

      {/* 받은 후기 리스트 */}
      <div className="profile-reviews">
        <h4>📌 받은 후기</h4>
        <SellerReviewList sellerId={sellerId} />
      </div>

      {/* 작성한 게시글 */}
      <div className="profile-posts">
        <h4>🛒 작성한 게시글</h4>
        {posts.map((post) => (
          <div key={post.itemid} className="profile-post-card">
            <Link to={`/post/${post.itemid}`}>
              <h5>{post.title}</h5>
              <p>{post.price.toLocaleString()}원</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerProfile;
