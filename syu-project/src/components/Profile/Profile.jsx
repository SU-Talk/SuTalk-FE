import React from "react";
import { Link } from "react-router-dom";
import "./profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faReceipt, faUser } from "@fortawesome/free-solid-svg-icons";
import Nav from "../Nav/Nav";
import SellerReviewList from "../Review/SellerReviewList";

const Profile = () => {
  const senderId = localStorage.getItem("senderId"); // 로그인된 사용자 ID

  return (
    <div className="profile-container">
      <header className="profile-header">
        <h2>나의 정보</h2>
      </header>

      <div className="profile-info">
        <div className="profile-avatar">
          <FontAwesomeIcon icon={faUser} className="avatar-icon" />
        </div>
        <h3 className="profile-name">{senderId}</h3> {/* 로그인 ID 출력 */}
        <Link to="/profile/edit">
          <button className="edit-profile-button">프로필 수정</button>
        </Link>
      </div>

      <div className="profile-menu">
        <div className="menu-item">
          <Link to="/profile/favorites" className="menu-link">
            <FontAwesomeIcon icon={faHeart} className="menu-icon" />
            <span>관심 목록</span>
          </Link>
          <span className="menu-arrow">〉</span>
        </div>
        <div className="menu-item">
          <Link to="/profile/sales-history" className="menu-link">
            <FontAwesomeIcon icon={faReceipt} className="menu-icon" />
            <span className="sales-span">판매내역</span>
          </Link>
          <span className="menu-arrow">〉</span>
        </div>
      </div>

      {/* 받은 후기 리스트 */}
      <div className="profile-reviews">
        <SellerReviewList sellerId={senderId} />
      </div>

      <Nav />
    </div>
  );
};

export default Profile;
