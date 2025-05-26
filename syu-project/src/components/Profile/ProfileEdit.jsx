import React, { useEffect, useState } from "react";
import "./ProfileEdit.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCamera, faUser } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../axiosInstance"; // 경로 확인!

const ProfileEdit = () => {
  const [userId, setUserId] = useState(""); // 기존 ID
  const [newUserId, setNewUserId] = useState(""); // 수정할 ID

  useEffect(() => {
    const currentId = localStorage.getItem("senderId");
    setUserId(currentId);
    setNewUserId(currentId);
  }, []);

  const handleSave = async () => {
    try {
      console.log("PATCH to:", `/users/${userId}`);
      console.log("Body:", { newUserId });

      await axiosInstance.patch(`/users/${userId}`, {
        newUserId: newUserId,
      });

      localStorage.setItem("senderId", newUserId);
      alert(`ID가 "${newUserId}"로 변경되었습니다.`);
      window.history.back();
    } catch (error) {
      console.error("ID 변경 실패", error);
      alert("ID 변경 중 오류가 발생했습니다.");
    }
  };

  const handleClose = () => {
    window.history.back();
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
          placeholder="새로운 ID를 입력하세요."
          value={newUserId}
          onChange={(e) => setNewUserId(e.target.value)}
          className="nickname-input"
        />
      </div>
    </div>
  );
};

export default ProfileEdit;
