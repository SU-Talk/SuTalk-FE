import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./SalesHistory.css";

const SalesHistory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("판매중"); // 현재 활성화된 탭 상태
  const [salesData, setSalesData] = useState({ 판매중: [], 거래완료: [] }); // 판매 내역 데이터 상태

  // JSON 데이터 가져오기
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch("/dummyData.json"); // JSON 파일 경로
        if (!response.ok) throw new Error("데이터를 가져오는데 실패했습니다.");
        const data = await response.json();

        // 판매 상태별로 데이터 분류
        const categorizedData = {
          판매중: data.posts.filter((post) => post.status === "판매중"),
          거래완료: data.posts.filter((post) => post.status === "거래완료"),
        };

        setSalesData(categorizedData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, []);

  // 수정 버튼 클릭 핸들러
  const handleEdit = (post) => {
    navigate(`/post/${post.id}/edit`, { state: { postData: post } });
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      // 1. 서버 삭제 요청 (실제 구현 시)
      // await fetch(`/api/posts/${postId}`, { method: "DELETE" });

      // 2. 클라이언트 상태 업데이트
      setSalesData((prev) => ({
        판매중: prev.판매중.filter((item) => item.id !== postId),
        거래완료: prev.거래완료.filter((item) => item.id !== postId),
      }));
    } catch (error) {
      console.error("삭제 실패:", error);
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
        <button
          className={`tab-button ${activeTab === "판매중" ? "active" : ""}`}
          onClick={() => setActiveTab("판매중")}>
          판매중
        </button>
        <button
          className={`tab-button ${activeTab === "거래완료" ? "active" : ""}`}
          onClick={() => setActiveTab("거래완료")}>
          거래완료
        </button>
      </div>
      <div className="sales-list">
        {salesData[activeTab].map((item) => (
          <div key={item.id} className="sales-item">
            <img
              src={item.images[0]}
              alt={item.title}
              className="sales-image"
            />
            <div className="sales-details">
              <h3>{item.title}</h3>
              <p>{item.time}</p>
              <p>{item.price}</p>
              {activeTab === "판매중" && (
                <>
                  {/* 예약 상태 */}
                  <span
                    className={`status ${
                      item.status === "예약중" ? "reserved" : ""
                    }`}>
                    {item.status}
                  </span>
                  {/* 수정 및 삭제 버튼 */}
                  <div className="actions">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(item)} // 수정 버튼 클릭 시
                    >
                      ✏️
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(item.id)}>
                      🗑️
                    </button>
                  </div>
                </>
              )}
              {activeTab === "거래완료" && (
                <>
                  <Link to="/review">
                    <button className="review-button">후기 남기기</button>
                  </Link>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesHistory;
