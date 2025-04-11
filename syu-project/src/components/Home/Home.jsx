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
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";

  const highlightText = (text) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text
      .split(regex)
      .map((part, index) =>
        regex.test(part) ? <mark key={index}>{part}</mark> : part
      );
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://13.55.195.181:8080/api/items`);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        console.log("✅ 응답 데이터:", data);

        // 기존 posts랑 합치기 (중복 제거)
        setPosts((prevPosts) => {
          const newPosts = data.filter(
            (post) => !prevPosts.find((p) => p.itemid === post.itemid)
          );
          return [...prevPosts, ...newPosts];
        });
      } catch (error) {
        console.error("❌ Error fetching post data:", error);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [page]);

  useEffect(() => {
    let result = posts;

    // 카테고리 필터링
    if (selectedCategory !== "전체") {
      result = result.filter((post) => post.category === selectedCategory);
    }

    // 검색어 필터링
    if (searchQuery) {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery) ||
          post.comment.toLowerCase().includes(searchQuery)
      );
    }

    setFilteredPosts(result);
  }, [posts, selectedCategory, searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
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
          categories={["전체", "전자제품", "가구", "생활용품"]}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      <div className="home-Posts">
        {filteredPosts.map((post) => (
          <Link to={`/post/${post.itemid}`} key={post.itemid} className="home-PostCard">
            <img
              src={post.thumbnail || "/assets/default-image.png"}
              alt={post.title}
            />
            <div className="home-PostDetails">
              <h3>{highlightText(post.title)}</h3>
              <div className="post-metadata">
                <p>{post.time}</p>
                <p>{post.price.toLocaleString()}원</p>
              </div>
              <p className="post-comment">{highlightText(post.comment)}</p>
            </div>
          </Link>
        ))}

        {loading && <p className="loading-text">불러오는 중...</p>}
        {!loading && filteredPosts.length === 0 && (
          <p className="no-results">검색 결과가 없습니다</p>
        )}
      </div>

      <div className="home-Write">
        <Link to="/write">
          <FontAwesomeIcon icon={faPen} />
        </Link>
      </div>

      <Nav />
    </div>
  );
};

export default Home;
