import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import Nav from "../Nav/Nav";
import TopBar from "../TopBar/TopBar";
import CategoryFilter from "../CategoryFilter/CategoryFilter";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";

  // 텍스트 하이라이트
  const highlightText = (text) => {
    if (!searchQuery || !text) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? <mark key={index}>{part}</mark> : part
    );
  };

  // 게시글 가져오는 함수
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/items");
      if (!response.ok) throw new Error("네트워크 오류");
      const data = await response.json();
      console.log("✅ 받아온 데이터:", data);
      setPosts(data);
    } catch (error) {
      console.error("❌ 데이터 가져오기 실패:", error);
    }
    setLoading(false);
  };

  // 처음 로딩 + 주기적 새로고침
  useEffect(() => {
    fetchPosts();

    const intervalId = setInterval(() => {
      fetchPosts(); // 10초마다 자동으로 새로운 데이터 요청
    }, 10000); // 10000ms = 10초

    return () => clearInterval(intervalId); // cleanup
  }, []);

  // 카테고리 & 검색 필터
  useEffect(() => {
    let result = [...posts];

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

    setFilteredPosts(result);
  }, [posts, selectedCategory, searchQuery]);

  // 무한 스크롤 (page state는 현재 사용되지 않지만 유지)
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 100 &&
        !loading
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <div className="home-Container">
      <TopBar />
      <div className="category-Container">
        <CategoryFilter
          categories={[
            "전체",
            "전자제품",
            "가구",
            "의류",
            "도서",
            "생활용품",
            "스포츠/레저",
            "기타",
          ]}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
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
              className="home-PostCard"
            >
              <img src={thumbnail} alt={post.title || "게시물"} />
              <div className="home-PostDetails">
                <h3>{highlightText(post.title || "제목 없음")}</h3>
                <div className="post-metadata">
                  <p>{post.regdate || "시간 없음"}</p>
                  <p>
                    {typeof post.price === "number"
                      ? post.price.toLocaleString() + "원"
                      : "가격 없음"}
                  </p>
                </div>
                <p className="post-comment">
                  {highlightText(post.description || "설명 없음")}
                </p>
              </div>
            </Link>
          );
        })}

        {loading && <p className="loading-text">불러오는 중...</p>}
        {!loading && filteredPosts.length === 0 && (
          <p className="no-results">검색 결과가 없습니다</p>
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
