import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/api/axiosInstance";
import "./SalesHistory.css";

const SalesHistory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("판매중");
  const [salesData, setSalesData] = useState({ 판매중: [], 예약중: [], 거래완료: [] });

  const fetchSalesData = async () => {
    const userId = localStorage.getItem("senderId");
    if (!userId) return;

    try {
      const { data } = await axios.get(`/items/mine`, {
        params: { userId },
      });

      const categorized = {
        판매중: data.filter((post) => post.status === "판매중"),
        예약중: data.filter((post) => post.status === "예약중"),
        거래완료: data.filter((post) => post.status === "거래완료"),
      };
      setSalesData(categorized);
    } catch (error) {
      console.error("❌ 판매 데이터 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const handleEdit = (post) => {
    navigate(`/post/${post.itemid}/edit`, { state: { postData: post } });
  };

  const handleDelete = async (itemid) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/items/${itemid}`);
      alert("삭제되었습니다.");
      fetchSalesData();
    } catch (error) {
      console.error("❌ 삭제 실패:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  const handleStatusChange = async (itemid, newStatus) => {
    try {
      await axios.patch(`/items/${itemid}/status`, { status: newStatus });
      fetchSalesData();
    } catch (error) {
      console.error("❌ 상태 변경 실패:", error);
    }
  };

  return (
    <div className="sales-history-container">
      <header className="sales-history-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          &lt;
        </button>
        <h2>나의 판매 내역</h2>
      </header>

      <div className="tabs">
        {["판매중", "예약중", "거래완료"].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="sales-list">
        {(salesData[activeTab] || []).map((item) => (
          <div key={item.itemid} className="sales-item">
            <img
              src={
                item.itemImages?.length > 0
                  ? `${import.meta.env.VITE_API_BASE_URL}${item.itemImages[0]}`
                  : "/assets/default-image.png"
              }
              alt={item.title}
              className="sales-image"
            />
            <div className="sales-details">
              <h3>{item.title}</h3>
              <p>{item.regdate}</p>
              <p>{item.price.toLocaleString()}원</p>

              {activeTab === "판매중" && (
                <>
                  <div className="actions">
                    <button className="edit-button" onClick={() => handleEdit(item)}>✏️</button>
                    <button className="delete-button" onClick={() => handleDelete(item.itemid)}>🗑️</button>
                  </div>
                  <div className="status-buttons">
                    <button onClick={() => handleStatusChange(item.itemid, "예약중")}>예약중</button>
                    <button onClick={() => handleStatusChange(item.itemid, "거래완료")}>거래완료</button>
                  </div>
                </>
              )}

              {activeTab === "예약중" && (
                <div className="status-buttons">
                  <button onClick={() => handleStatusChange(item.itemid, "판매중")}>판매중</button>
                  <button onClick={() => handleStatusChange(item.itemid, "거래완료")}>거래완료</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesHistory;
