import React, { useState } from "react";
import "./ProfileEdit.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCamera, faUser } from "@fortawesome/free-solid-svg-icons";

const ProfileEdit = ({ nickname, setNickname }) => {
  const [newNickname, setNewNickname] = useState(nickname); // 초기값 설정

  const handleSave = () => {
    setNickname(newNickname); // 닉네임 저장
    alert(`닉네임이 "${newNickname}"으로 저장되었습니다.`);
    window.history.back(); // 이전 페이지로 이동
  };

  const handleClose = () => {
    window.history.back(); // 이전 페이지로 이동
  };

  return (
    <div className="profile-edit-container">
      <header className="profile-edit-header">
        <button className="profile-close-button" onClick={handleClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2>프로필 수정</h2>
        <button className="save-button" onClick={handleSave}>
          완료
        </button>
      </header>
      <div className="profile-edit-content">
        <div className="profile-avatar">
          <FontAwesomeIcon icon={faUser} className="avatar-icon" />
          <span className="camera-icon">
            <FontAwesomeIcon icon={faCamera} />
          </span>
        </div>
        <input
          type="text"
          placeholder="닉네임을 입력하세요."
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)} // 입력값 업데이트
          className="nickname-input"
        />
      </div>
    </div>
  );
};

export default ProfileEdit;
