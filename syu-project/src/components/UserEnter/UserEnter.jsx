import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/api/axiosInstance";
import "./UserEnter.css";

const UserEnter = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userid: "",
    email: "",
    name: "",
    password: "",
    phone: "",
    status: "ACTIVE",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/users", form);
      localStorage.setItem("senderId", form.userid);
      navigate("/home");
    } catch (error) {
      alert("❌ 에러 발생: " + error.message);
    }
  };

  return (
    <div className="user-enter-container">
      <button className="back-button" onClick={() => navigate("/login")}>
        &lt;
      </button>

      <img src="/assets/default-image.png" alt="logo" className="logo-image" />

      <div className="title">
        <span className="brand">SU_Talk</span> 회원가입
      </div>

      <form onSubmit={handleSubmit} className="enter-form">
        {["userid", "email", "name", "password", "phone"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={`${field} 입력`}
            className="user-input"
          />
        ))}
        <select name="status" value={form.status} onChange={handleChange} className="user-input">
          <option value="ACTIVE">ACTIVE</option>
          <option value="정지">정지</option>
        </select>
        <button type="submit" className="enter-button">가입 후 시작하기</button>
      </form>
    </div>
  );
};

export default UserEnter;
