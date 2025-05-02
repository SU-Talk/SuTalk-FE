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
    if (!searchQuery || !text) return text;
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
        const response = await fetch("http://localhost:8080/api/items");
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        console.log("✅ 응답 데이터:", data);

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

    if (selectedCategory !== "전체") {
      result = result.filter((post) => post.category === selectedCategory);
    }

    if (searchQuery) {
      result = result.filter((post) =>
        (post.title?.toLowerCase() || "").includes(searchQuery) ||
        (post.comment?.toLowerCase() || "").includes(searchQuery)
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
            <Link to={`/post/${post.itemid}`} key={post.itemid} className="home-PostCard">
              <img src={thumbnail} alt={post.title || "게시물"} />
              <div className="home-PostDetails">
                <h3>{highlightText(post.title || "제목 없음")}</h3>
                <div className="post-metadata">
                  <p>{post.time || "시간 없음"}</p>
                  <p>
                    {typeof post.price === "number"
                      ? post.price.toLocaleString() + "원"
                      : "가격 없음"}
                  </p>
                </div>
                <p className="post-comment">
                  {highlightText(post.comment || "설명 없음")}
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
