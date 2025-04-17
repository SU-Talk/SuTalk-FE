import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate 추가
import "./Favorites.css";
import Nav from "../Nav/Nav";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate(); // navigate 훅 생성

  // 로컬 스토리지에서 관심 목록 가져오기
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
    console.log("저장된 관심 목록:", storedFavorites); // 디버깅용
  }, []);

  // 전체 게시글 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/dummyData.json");
        if (!response.ok) throw new Error("데이터를 가져오는데 실패했습니다.");
        const data = await response.json();
        setPosts(data.posts);
        console.log("불러온 게시글:", data.posts); // 디버깅용
      } catch (error) {
        console.error("Error fetching dummy data:", error);
      }
    };

    fetchPosts();
  }, []);

  // 타입 변환을 통해 문자열과 숫자 ID 모두 처리
  const filteredFavorites = posts.filter(
    (post) =>
      favorites.includes(String(post.id)) || favorites.includes(Number(post.id))
  );

  console.log("필터링된 관심 목록:", filteredFavorites); // 디버깅용

  return (
    <div className="favorites-container">
      <header className="favorites-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          &lt;
        </button>
        <h2>관심 목록</h2>
      </header>
      <div className="favorites-list">
        {filteredFavorites.length > 0 ? (
          filteredFavorites.map((post) => (
            <Link
              to={`/post/${post.id}`}
              key={post.id}
              className="favorite-item">
              <div className="favorite-thumbnail">
                <img
                  src={post.thumbnail || "/assets/default-image.png"}
                  alt={post.title}
                  className="favorite-image"
                />
              </div>
              <div className="favorite-details">
                <h3>{post.title}</h3>
                <p>{post.price}</p>
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
