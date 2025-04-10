import React, { useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./App.css";

import LoadingPage from "./components/Loading/Loading.jsx";
import HomePage from "./components/Home/Home.jsx";
import SearchPage from "./components/Serach/Search.jsx";
import PostPage from "./components/Post/Post.jsx";
import PostDetailPage from "./components/PostDetail/PostDetail.jsx";

const LoadingWrapper = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home", { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return <LoadingPage />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const nodeRef = useRef(null);

  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={location.key}
        nodeRef={nodeRef}
        classNames="fade"
        timeout={0}
        unmountOnExit>
        <div ref={nodeRef}>
          <Routes location={location}>
            <Route path="/" element={<LoadingWrapper />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/post" element={<PostPage />} />
            <Route path="/post/:postId" element={<PostDetailPage />} />
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
