import React, { useState } from "react";
import "./Report.css";

const Report = () => {
  const [selectedReason, setSelectedReason] = useState(""); // 선택된 신고 사유
  const [additionalText, setAdditionalText] = useState(""); // 추가 입력 내용

  const handleSubmit = () => {
    if (!selectedReason) {
      alert("신고 사유를 선택해주세요.");
      return;
    }
    alert(`신고 사유: ${selectedReason}\n추가 내용: ${additionalText}`);
    // 서버로 데이터 전송 로직 추가 가능
  };

  return (
    <div className="report-container">
      <header className="report-header">
        <button className="close-button" onClick={() => window.history.back()}>
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
              onChange={(e) => setAdditionalText(e.target.value)}></textarea>
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
