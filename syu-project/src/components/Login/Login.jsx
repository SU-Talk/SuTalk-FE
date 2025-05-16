import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "../../api/axiosInstance"; // ✅ axiosInstance import

const Login = () => {
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/users/${userId}/check`); // ✅ baseURL 자동 적용
      if (!response.status === 200) throw new Error("존재하지 않는 사용자입니다.");

      localStorage.setItem("senderId", userId);
      navigate("/home");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="login-container">
      <img src="/assets/default-image.png" alt="logo" className="login-logo" />
      <h2>SU_Talk 로그인</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="User ID 입력"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="user-input"
        />
        <button type="submit" className="enter-button">로그인</button>
        <p style={{ marginTop: "10px" }}>
          계정이 없으신가요? <a href="/enter">회원가입</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
