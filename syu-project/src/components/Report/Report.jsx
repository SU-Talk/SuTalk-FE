import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "@/axiosInstance";
import "./Report.css";

const Report = () => {
  const [selectedReason, setSelectedReason] = useState("");
  const [additionalText, setAdditionalText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { reporterId, reportedId, itemId } = location.state || {};

  const handleSubmit = async () => {
    if (!selectedReason) {
      alert("신고 사유를 선택해주세요.");
      return;
    }

    const reason =
      selectedReason === "기타 부적절한 행위"
        ? `${selectedReason}: ${additionalText}`
        : selectedReason;

    try {
      await axios.post("/reports", {
        reporterId,
        reportedId,
        itemId,
        reason,
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
          {["사기", "욕설", "거래 게시글이 아닙니다.", "기타 부적절한 행위"].map(
            (reason) => (
              <label key={reason}>
                <input
                  type="radio"
                  name="reason"
                  value={reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                />
                {reason}
              </label>
            )
          )}
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
