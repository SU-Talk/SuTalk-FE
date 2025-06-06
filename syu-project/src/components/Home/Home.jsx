import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FixedSizeList as List } from "react-window";
import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import Nav from "../Nav/Nav";
import TopBar from "../TopBar/TopBar";
import { MoonLoader } from "react-spinners";
import "../Loader/Loader.css"; // ✅ Loader 폴더 안의 css
import { Link } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortOrder, setSortOrder] = useState("최신순");
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";

  const highlightText = (text) => {
    if (!searchQuery || !text) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? <mark key={index}>{part}</mark> : part
    );
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/items`);
      if (!response.ok) throw new Error("네트워크 오류");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("❌ 데이터 가져오기 실패:", error);
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
      result.sort((a, b) => Number(b.regdate) - Number(a.regdate));
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

  const handleClickPost = (postId) => {
    setLoading(true);
    setTimeout(() => {
      navigate(`/post/${postId}`);
    }, 300); // 살짝 delay를 줘야 loader가 렌더링됨
  };

  const Row = ({ index, style }) => {
    const post = filteredPosts[index];
    const thumbnail =
      post.itemImages && post.itemImages.length > 0
        ? `/uploads/thumbnails/thumb_${post.itemImages[0].split("/").pop()}`
        : "/assets/default-image.png";

    return (
      <div style={style}>
        <div
          className="home-PostCard"
          onClick={() => handleClickPost(post.itemid)}
        >
          <img loading="lazy" src={thumbnail} alt={post.title || "게시물"} />
          <div className="home-PostDetails">
            <h3>{highlightText(post.title || "제목 없음")}</h3>
            <div className="post-meta">
              <span className="post-author">작성자: {post.sellerId}</span>
              <span className="post-date">
                {new Date(Number(post.regdate)).toLocaleDateString("ko-KR")}
              </span>
            </div>
            <p className="post-price">
              {typeof post.price === "number"
                ? `가격: ${post.price.toLocaleString()}원`
                : "가격 없음"}
            </p>
            <p className="post-comment">
              {highlightText(post.description || "설명 없음")}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="home-Container">
      {loading && (
        <div className="loader-overlay">
          <MoonLoader color="#2670ff" size={40} />
        </div>
      )}

      <TopBar />

      <div className="filter-scroll-wrapper">
        <div className="filter-scroll-row">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-button ${selectedCategory === category ? "active" : ""}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
          {["최신순", "가격↑", "가격↓"].map((option) => (
            <button
              key={option}
              className={`filter-button ${sortOrder === option ? "active" : ""}`}
              onClick={() => setSortOrder(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="home-Posts">
        {filteredPosts.length > 0 ? (
          <List
            height={window.innerHeight - 170}
            itemCount={filteredPosts.length}
            itemSize={120}
            width={"100%"}
          >
            {Row}
          </List>
        ) : (
          !loading && <p className="no-results">검색 결과가 없습니다</p>
        )}
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
