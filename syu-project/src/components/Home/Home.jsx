import React, { useState, useEffect } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import Nav from "../Nav/Nav";
import TopBar from "../TopBar/TopBar";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/dummyData.json?page=${page}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        if (!data || !data.posts) {
          console.error("Invalid data format:", data);
          return;
        }

        setPosts((prevPosts) => {
          const newPosts = data.posts.filter(
            (post) => !prevPosts.find((p) => p.id === post.id)
          );
          return [...prevPosts, ...newPosts];
        });
      } catch (error) {
        console.error("Error fetching dummy data:", error);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50
      ) {
        if (!loading) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <div className="home-Container">
      <TopBar />
      <div className="home-Posts">
        {posts.map((post) => (
          <Link to={`/post/${post.id}`} key={post.id} className="home-PostCard">
            <img
              src={
                !post.thumbnail ? "/assets/default-image.png" : post.thumbnail
              }
              alt={post.title}
            />
            <div className="home-PostDetails">
              <h3>{post.title}</h3>
              <p>{post.time}</p>
              <p>{post.price}</p>
            </div>
          </Link>
        ))}
        {loading && <p>Loading...</p>}
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
