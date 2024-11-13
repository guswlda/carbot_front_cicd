import React, { useEffect, useState } from "react";
import axios from "axios";
import "./proposal.css";
import { MdOutlineClose } from "react-icons/md";

function Proposal({ onClose }) {
  const [customerRequest, setCustomerRequest] = useState("");
  const [dealerName, setDealerName] = useState(""); // 딜러 이름 상태 추가

  useEffect(() => {
    const fetchDealerName = async () => {
      try {
        const response = await axios.get("http://222.112.27.120:8001/dealer/1"); // dealer_no가 1인 딜러 데이터 가져오기
        setDealerName(response.data.dealerName); // 딜러 이름 저장
      } catch (error) {
        console.error("Error fetching dealer name:", error);
      }
    };

    fetchDealerName();
  }, []);

  const handleSubmit = async () => {
    const userId = sessionStorage.getItem("userId"); // 세션 스토리지에서 userId 가져오기

    if (!userId) {
      alert("로그인이 필요합니다. 다시 로그인해주세요.");
      return;
    }

    const consultContent = customerRequest || "요청사항 없음";

    try {
      const response = await axios.post(
        "http://222.112.27.120:8001/submit_consult",
        {
          userId: userId,
          consult_content: consultContent,
        }
      );

      // 요청 성공 시 처리
      console.log("Data from backend:", response.data);
      alert(
        `감사합니다! 딜러 '${
          response.data.dealerName || "미정"
        }'님이 배정되었습니다. 곧 상담 전화 드리겠습니다.`
      );

      if (typeof onClose === "function") {
        onClose();
      }
    } catch (error) {
      console.error("Error submitting request:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.error || "구매 상담 신청에 실패했습니다.";
        alert(errorMessage);
      } else {
        alert("네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    }
  };

  return (
    <div className="proposal-modal-overlay">
      <div className="proposal-modal-content">
        <div className="proposal-modal-header">
          <div className="proposal-modal-logo">CARBOT</div>
          <button className="proposal-modal-close" onClick={onClose}>
            <MdOutlineClose />
          </button>
        </div>

        <div className="proposal-modal-body">
          <div className="proposal-section">
            <p>1. 배정된 딜러</p>
            <div className="proposal-dealer-selected">
              {dealerName || "로딩 중..."}
            </div>
          </div>

          <div className="proposal-section">
            <p>2. 고객 요청 사항</p>
            <textarea
              placeholder="요청 사항을 입력해 주세요."
              value={customerRequest}
              onChange={(e) => setCustomerRequest(e.target.value)}
            />
          </div>

          <button className="proposal-submit-button" onClick={handleSubmit}>
            구매 상담 신청
          </button>
        </div>
      </div>
    </div>
  );
}

export default Proposal;
