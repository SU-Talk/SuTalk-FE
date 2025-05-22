import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { MoonLoader } from "react-spinners";
import "./Favorites.css";
import Nav from "../Nav/Nav";

const Favorites = () => {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const senderId = useMemo(() => localStorage.getItem("senderId"), []);

  useEffect(() => {
    if (!senderId) return;

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/likes/my?userId=${senderId}`);
        if (!res.ok) throw new Error("조회 실패");

        const data = await res.json();
        setFavoriteItems(data);
      } catch (err) {
        console.error("❌ 관심 목록 조회 오류:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
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

      {loading ? (
        <div className="loader-overlay">
          <MoonLoader color="#2670ff" size={40} />
        </div>
      ) : (
        <div className="favorites-list">
          {favoriteItems.length > 0 ? (
            favoriteItems.map((post) => (
              <Link to={`/post/${post.itemid}`} key={post.itemid} className="favorite-item">
                <div className="favorite-thumbnail">
                  <img
                    loading="lazy"
                    src={
                      post.itemImages?.length > 0
                        ? `/uploads/thumbnails/thumb_${post.itemImages[0].split("/").pop()}`
                        : "/assets/default-image.png"
                    }
                    alt={post.title}
                    className="favorite-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/assets/default-image.png";
                    }}
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
      )}

      <Nav />
    </div>
  );
};

export default Favorites;
