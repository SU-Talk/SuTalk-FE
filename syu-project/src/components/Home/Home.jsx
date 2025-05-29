import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import Nav from "../Nav/Nav";
import TopBar from "../TopBar/TopBar";
import { MoonLoader } from "react-spinners";
import "../Loader/Loader.css";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortOrder, setSortOrder] = useState("최신순");
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";

  const highlightText = (text) => {
    if (!searchQuery || !text) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text
      .split(regex)
      .map((part, index) =>
        regex.test(part) ? <mark key={index}>{part}</mark> : part
      );
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/items");
      if (!response.ok) throw new Error("네트워크 오류");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      // console.error("❌ 데이터 가져오기 실패:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const senderId = localStorage.getItem("senderId");
    if (!senderId) {
      window.location.href = "/enter";
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    const intervalId = setInterval(() => fetchPosts(), 10000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let result = posts.filter((post) => post.status !== "거래완료");

    if (selectedCategory !== "전체") {
      result = result.filter(
        (post) =>
          (post.category || "").toLowerCase().trim() ===
          selectedCategory.toLowerCase().trim()
      );
    }

    if (searchQuery) {
      result = result.filter(
        (post) =>
          (post.title?.toLowerCase() || "").includes(searchQuery) ||
          (post.description?.toLowerCase() || "").includes(searchQuery)
      );
    }

    if (sortOrder === "최신순") {
      result.sort((a, b) => b.regdate - a.regdate);
    } else if (sortOrder === "가격↑") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "가격↓") {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredPosts(result);
  }, [posts, selectedCategory, searchQuery, sortOrder]);

  const categories = [
    "전체",
    "전자제품",
    "가구",
    "의류",
    "도서",
    "생활용품",
    "스포츠/레저",
    "기타",
  ];

  return (
    <div className="home-Container">
      {/* 로딩 오버레이 */}
      {loading && (
        <div className="loader-overlay">
          <MoonLoader color="#2670ff" size={40} />
        </div>
      )}

      <TopBar />

      {/* ✅ 카테고리 + 정렬 버튼 한 줄에 스크롤 */}
      <div className="filter-scroll-row">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-button ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category)}>
            {category}
          </button>
        ))}
        {["최신순", "가격↑", "가격↓"].map((option) => (
          <button
            key={option}
            className={`filter-button ${sortOrder === option ? "active" : ""}`}
            onClick={() => setSortOrder(option)}>
            {option}
          </button>
        ))}
      </div>

      <div className="home-Posts">
        {filteredPosts.map((post) => {
          const thumbnail =
            post.itemImages && post.itemImages.length > 0
              ? `http://localhost:8080${post.itemImages[0]}`
              : "/assets/default-image.png";

          return (
            <Link
              to={`/post/${post.itemid}`}
              key={post.itemid}
              className="home-PostCard">
              <img src={thumbnail} alt={post.title || "게시물"} />
              <div className="home-PostDetails">
                <h3>{highlightText(post.title || "제목 없음")}</h3>
                <div className="post-meta">
                  <span className="post-author">작성자: {post.sellerId}</span>
                </div>
                <span className="post-date">
                  {new Date(Number(post.regdate)).toLocaleDateString("ko-KR")}
                </span>
                <p className="post-price">
                  {typeof post.price === "number"
                    ? `가격: ${post.price.toLocaleString()}원`
                    : "가격 없음"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="home-Write">
        <Link to="/post">
          <FontAwesomeIcon icon={faPen} />
        </Link>
      </div>

      <Nav />
    </div>
  );
};

export default Home;
