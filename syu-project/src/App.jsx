import React, { useState, useEffect, useRef } from "react";
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
import ChatPage from "./components/Chat/ChatRoom.jsx";
import socket from "./Socket.js";
import ChatListPage from "./components/Chat/ChatList.jsx";
import SearchPage from "./components/Serach/Search.jsx";
import ProfilePage from "./components/Profile/Profile.jsx";
import ProfileEditPage from "./components/Profile/ProfileEdit.jsx";
import FavoritesPage from "./components/Favorites/Favorites.jsx";
import SalesHistoryPage from "./components/SalesHistory/SalesHistory.jsx";
import PostPage from "./components/Post/Post.jsx";
import PostDetailPage from "./components/PostDetail/PostDetail.jsx";
import PostEditPage from "./components/Post/PostEdit.jsx";
import Reviewpage from "./components/Review/Review.jsx";
import ReportPage from "./components/Report/Report.jsx";

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
  const [nickname, setNickname] = useState("상혁"); // 여기서 상태 관리

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
            <Route
              path="/chat/:PostId"
              element={<ChatPage socket={socket} />}
            />
            <Route path="/chatlist" element={<ChatListPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route
              path="/profile"
              element={<ProfilePage nickname={nickname} />}
            />
            <Route
              path="/profile/edit"
              element={
                <ProfileEditPage
                  nickname={nickname}
                  setNickname={setNickname}
                />
              }
            />
            <Route path="/profile/favorites" element={<FavoritesPage />} />
            <Route
              path="/profile/sales-history"
              element={<SalesHistoryPage />}
            />
            <Route path="/review" element={<Reviewpage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/post" element={<PostPage />} />
            <Route path="/post/:postId" element={<PostDetailPage />} />
            <Route path="/post/:postId/edit" element={<PostEditPage />} />
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

// App 컴포넌트를 ErrorBoundary로 감싸기
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("라우트 오류 발생:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <h2>페이지 로딩 중 오류가 발생했습니다. 페이지를 새로고침해주세요.</h2>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AnimatedRoutes />
      </ErrorBoundary>
    </Router>
  );
}

export default App;
