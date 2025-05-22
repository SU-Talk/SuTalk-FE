import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import SellerReviewList from "../Review/SellerReviewList";
import "./profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FaBars, FaArrowLeft } from "react-icons/fa";
import { MoonLoader } from "react-spinners";
import "../Loader/Loader.css"; // ✅ Loader 스타일 import

const SellerProfile = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ 로딩 상태

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
        const response = await axios.get(`/api/users/${sellerId}`);
        setProfile(response.data);
      } catch (error) {
        console.error("❌ 프로필 조회 실패:", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/api/items/by-seller?sellerId=${sellerId}`);
        setPosts(response.data);
      } catch (error) {
        console.error("❌ 게시글 조회 실패:", error);
      }
    };

    const loadAll = async () => {
      await Promise.all([fetchProfile(), fetchPosts()]);
      setLoading(false); // ✅ 데이터 다 불러오면 로딩 false
    };

    loadAll();
  }, [sellerId]);

  if (loading) {
    return (
      <div className="loader-overlay">
        <MoonLoader color="#2670ff" size={40} />
      </div>
    );
  }

  if (!profile) return <p>판매자 정보를 찾을 수 없습니다.</p>;

  return (
    <div className="profile-container">
      {/* ✅ 상단 고정 헤더 */}
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

      {/* 받은 후기 리스트 */}
      <div className="profile-reviews">
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
