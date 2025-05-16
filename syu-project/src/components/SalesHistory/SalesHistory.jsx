import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SalesHistory.css";

const SalesHistory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("판매중");
  const [salesData, setSalesData] = useState({ 판매중: [], 예약중: [], 거래완료: [] });

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
    const response = await fetch(`/api/items/${itemid}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("삭제 요청 실패");

    alert("삭제되었습니다.");
    fetchSalesData(); // 갱신
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
      fetchSalesData(); // 상태 변경 후 데이터 새로고침
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
        <button className={`tab-button ${activeTab === "판매중" ? "active" : ""}`} onClick={() => setActiveTab("판매중")}>판매중</button>
        <button className={`tab-button ${activeTab === "예약중" ? "active" : ""}`} onClick={() => setActiveTab("예약중")}>예약중</button>
        <button className={`tab-button ${activeTab === "거래완료" ? "active" : ""}`} onClick={() => setActiveTab("거래완료")}>거래완료</button>
      </div>

      <div className="sales-list">
        {(salesData[activeTab] || []).map((item) => (
          <div key={item.itemid} className="sales-item">
            <img
              src={item.itemImages?.length > 0 ? `http://localhost:8080${item.itemImages[0]}` : "/assets/default-image.png"}
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

              {/* 거래완료 탭에서는 후기 남기기 버튼 제거 */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesHistory;
