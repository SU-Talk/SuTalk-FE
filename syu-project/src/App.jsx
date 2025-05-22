import React, { useRef, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./App.css";

// 컴포넌트 import
import LoadingPage from "./components/Loading/Loading";
import HomePage from "./components/Home/Home";
import ChatRoom from "./components/Chat/ChatRoom";
import ChatListPage from "./components/Chat/ChatList";
import SearchPage from "./components/Serach/Search";
import ProfilePage from "./components/Profile/Profile";
import ProfileEditPage from "./components/Profile/ProfileEdit";
import FavoritesPage from "./components/Favorites/Favorites";
import SalesHistoryPage from "./components/SalesHistory/SalesHistory";
import PostDetailPage from "./components/PostDetail/PostDetail";
import PostEditPage from "./components/Post/PostEdit";
import Reviewpage from "./components/Review/Review";
import ReportPage from "./components/Report/Report";
import SellerProfile from "./components/Profile/SellerProfile";
import UserEnter from "./components/UserEnter/UserEnter";
import Login from "./components/Login/Login";

// ✅ 로딩 후 로그인으로 리디렉션
const LoadingWrapper = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("senderId");
    const timer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return <LoadingPage />;
};

// ✅ 애니메이션 라우터
const AnimatedRoutes = () => {
  const location = useLocation();
  const nodeRef = useRef(null);
  const [nickname, setNickname] = useState("상혁");

  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={location.key}
        nodeRef={nodeRef}
        classNames="fade"
        timeout={0}
        unmountOnExit
      >
        <div ref={nodeRef}>
          <Routes location={location}>
            <Route path="/" element={<LoadingWrapper />} />
            <Route path="/login" element={<Login />} />
            <Route path="/enter" element={<UserEnter />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/chat/:chatRoomId" element={<ChatRoom />} />
            <Route path="/chatlist" element={<ChatListPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<ProfilePage nickname={nickname} />} />
            <Route path="/profile/edit" element={<ProfileEditPage nickname={nickname} setNickname={setNickname} />} />
            <Route path="/profile/favorites" element={<FavoritesPage />} />
            <Route path="/profile/sales-history" element={<SalesHistoryPage />} />
            <Route path="/review" element={<Reviewpage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/post" element={<PostEditPage />} /> {/* ✅ PostPage → PostEditPage */}
            <Route path="/post/:postId" element={<PostDetailPage />} />
            <Route path="/post/:postId/edit" element={<PostEditPage />} />
            <Route path="/profile/seller/:sellerId" element={<SellerProfile />} />
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

// ✅ 예외 처리용 에러 바운더리
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
      return <h2>페이지 로딩 중 오류가 발생했습니다. 새로고침해주세요.</h2>;
    }
    return this.props.children;
  }
}

// ✅ App 전체 라우트 구성
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
