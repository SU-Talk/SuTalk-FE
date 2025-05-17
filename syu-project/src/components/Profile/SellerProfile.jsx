import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import axios from "@/api/axiosInstance";
import SellerReviewList from "../Review/SellerReviewList";
import "./Profile.css";
import { FaBars, FaArrowLeft } from "react-icons/fa"; // ✅ 중복 없이 정리

const SellerProfile = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const reporterId = localStorage.getItem("senderId");

  const handleGoBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/users/${sellerId}`);
        setProfile(response.data);
      } catch (error) {
        console.error("❌ 프로필 조회 실패:", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/items/by-seller?sellerId=${sellerId}`);
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
      <div className="profile-topbar">
        <button className="back-button" onClick={handleGoBack}>
          <FaArrowLeft className="back-icon" />
        </button>
        <h2 className="topbar-title">
          {profile.name || `test-user-${sellerId.slice(-3)}`}님의 프로필
        </h2>
      </div>

      <div className="profile-info">
        <div className="profile-avatar">👤</div>
        <h3>{profile.name || `test-user-${sellerId.slice(-3)}`}</h3>
        <p>
          후기 평균 ⭐ {profile.averageRating?.toFixed(1) ?? "0.0"} / 후기{" "}
          {profile.reviewCount ?? 0}개
        </p>
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

      <div className="profile-reviews">
        <SellerReviewList sellerId={sellerId} />
      </div>

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
