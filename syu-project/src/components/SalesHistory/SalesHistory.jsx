import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SalesHistory.css";

const SalesHistory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("판매중");
  const [salesData, setSalesData] = useState({ 판매중: [], 예약중: [], 거래완료: [] });
  const formatDate = (regdate) => {
  if (!regdate) return "";
  const timestamp = Number(regdate);
  if (isNaN(timestamp)) return "";
  return new Date(timestamp).toLocaleDateString("ko-KR");
};



  const fetchSalesData = async () => {
    const userId = localStorage.getItem("senderId");
    if (!userId) return;

    try {
      const response = await fetch(`/api/items/mine?userId=${userId}`);
      if (!response.ok) throw new Error("데이터를 가져오는데 실패했습니다.");
      const data = await response.json();
      const categorized = {
        판매중: data.filter((post) => post.status === "판매중"),
        예약중: data.filter((post) => post.status === "예약중"),
        거래완료: data.filter((post) => post.status === "거래완료"),
      };
      setSalesData(categorized);
    } catch (error) {
      console.error("Error fetching sales data:", error);
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
      const response = await fetch(`/api/items/${itemid}`, { method: "DELETE" });
      if (!response.ok) throw new Error("삭제 요청 실패");
      alert("삭제되었습니다.");
      fetchSalesData();
    } catch (error) {
      console.error("❌ 삭제 실패:", error);
      alert("삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleStatusChange = async (itemid, newStatus) => {
    try {
      const response = await fetch(`/api/items/${itemid}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("상태 변경 실패");
      fetchSalesData();
    } catch (error) {
      console.error("상태 변경 실패:", error);
    }
  };

  return (
    <div className="sales-history-container">
      <header className="sales-history-header">
        <button className="back-button" onClick={() => navigate(-1)}>&lt;</button>
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
                  ? `/uploads/thumbnails/thumb_${item.itemImages[0].split("/").pop()}`
                  : "/assets/default-image.png"
              }
              alt={item.title}
              className="sales-image"
            />
            <div className="sales-details">
              <h3 className="item-title">{item.title}</h3>
              <p className="item-price">{item.price.toLocaleString()}원</p>
              <p className="item-date">{formatDate(item.regdate)}</p>

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
