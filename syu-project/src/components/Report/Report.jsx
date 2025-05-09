import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Report.css";

const Report = () => {
  const [selectedReason, setSelectedReason] = useState(""); // 선택된 신고 사유
  const [additionalText, setAdditionalText] = useState(""); // 기타 추가 입력
  const navigate = useNavigate();
  const location = useLocation();

  // 📦 신고 대상 정보 (Review.jsx → navigate로 전달됨)
  const { reporterId, reportedId, itemId } = location.state || {};

  const handleSubmit = async () => {
    if (!selectedReason) {
      alert("신고 사유를 선택해주세요.");
      return;
    }

    const reason = selectedReason === "기타 부적절한 행위"
      ? `${selectedReason}: ${additionalText}`
      : selectedReason;

    try {
      await axios.post("/api/reports", {
        reporterId,
        reportedId,
        itemId,
        reason
      });

      alert("신고가 접수되었습니다.");
      navigate(-1);
    } catch (error) {
      console.error("❌ 신고 실패:", error);
      alert("신고 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="report-container">
      <header className="report-header">
        <button className="close-button" onClick={() => navigate(-1)}>
          &lt;
        </button>
        <h3>신고하기</h3>
      </header>

      <div className="report-content">
        <p>신고하는 사유를 선택해주세요.</p>
        <form>
          <label>
            <input
              type="radio"
              name="reason"
              value="사기"
              onChange={(e) => setSelectedReason(e.target.value)}
            />
            사기
          </label>
          <label>
            <input
              type="radio"
              name="reason"
              value="욕설"
              onChange={(e) => setSelectedReason(e.target.value)}
            />
            욕설
          </label>
          <label>
            <input
              type="radio"
              name="reason"
              value="거래 게시글이 아닙니다."
              onChange={(e) => setSelectedReason(e.target.value)}
            />
            거래 게시글이 아닙니다.
          </label>
          <label>
            <input
              type="radio"
              name="reason"
              value="기타 부적절한 행위"
              onChange={(e) => setSelectedReason(e.target.value)}
            />
            기타 부적절한 행위
          </label>
          {selectedReason === "기타 부적절한 행위" && (
            <textarea
              placeholder="입력하세요."
              value={additionalText}
              onChange={(e) => setAdditionalText(e.target.value)}
            ></textarea>
          )}
        </form>

        <button className="submit-button" onClick={handleSubmit}>
          제출
        </button>
      </div>
    </div>
  );
};

export default Report;
