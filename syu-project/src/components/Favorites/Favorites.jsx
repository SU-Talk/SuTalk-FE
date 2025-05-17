import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "./Favorites.css";
import Nav from "../Nav/Nav";
import axios from "@/axiosInstance";

const Favorites = () => {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const senderId = localStorage.getItem("senderId");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`/likes/my?userId=${senderId}`);
        setFavoriteItems(response.data);
      } catch (error) {
        console.error("❌ 관심 목록 조회 오류:", error);
        setError(true);
      }
    };

    if (senderId) {
      fetchFavorites();
    }
  }, [senderId]);

  if (error) {
    return (
      <div className="favorites-container">
        <p style={{ padding: "30px", fontWeight: "bold" }}>
          페이지 로딩 중 오류가 발생했습니다. 새로 고침해주세요.
        </p>
        <Nav />
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <header className="favorites-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          &lt;
        </button>
        <h2>관심 목록</h2>
      </header>

      <div className="favorites-list">
        {favoriteItems.length > 0 ? (
          favoriteItems.map((post) => (
            <Link to={`/post/${post.itemid}`} key={post.itemid} className="favorite-item">
              <div className="favorite-thumbnail">
                <img
                  src={
                    post.itemImages?.length > 0
                      ? `${import.meta.env.VITE_API_BASE_URL}${post.itemImages[0]}`
                      : "/assets/default-image.png"
                  }
                  alt={post.title}
                  className="favorite-image"
                />
              </div>
              <div className="favorite-details">
                <h3>{post.title}</h3>
                <p>{post.price != null ? `${post.price.toLocaleString()}원` : "가격 정보 없음"}</p>
                <div className="favorite-like-count">
                  <FontAwesomeIcon icon={faHeart} style={{ color: "#f55", marginRight: "4px" }} />
                  <span>{post.likeCount ?? 0}</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="no-favorites">관심 목록이 비어 있습니다.</p>
        )}
      </div>

      <Nav />
    </div>
  );
};

export default Favorites;
