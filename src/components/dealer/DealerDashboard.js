import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DealerDashboard.css";
import MemoModal from "./modal/memoModal";
import CompleteCheck from "./modal/completeCheck";

const DealerDashboard = () => {
  const [dealerName, setDealerName] = useState("딜러 이름 로딩 중...");
  const [dealerNo, setDealerNo] = useState(null);
  const [selectedTab, setSelectedTab] = useState("상담 시작 전");
  const [applications, setApplications] = useState([]);
  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
  const [memoContent, setMemoContent] = useState("");
  const [selectedConsult, setSelectedConsult] = useState(null);
  const [consultDetails, setConsultDetails] = useState(null);

  // 확인 모달 상태 추가
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedConsultForStatusChange, setSelectedConsultForStatusChange] =
    useState(null);

  // 딜러 이름 가져오기
  useEffect(() => {
    const fetchDealerName = async () => {
      const dealerId = sessionStorage.getItem("userId");
      try {
        const response = await axios.get(
          `http://222.112.27.120:8001/dealer_name/${dealerId}`
        );
        setDealerName(response.data.dealerName);
        setDealerNo(response.data.dealerNo);
      } catch (error) {
        console.error("딜러 이름을 가져오는 중 오류 발생:", error);
        setDealerName("딜러 이름을 가져올 수 없습니다");
      }
    };

    fetchDealerName();
  }, []);

  // 상담 데이터 가져오기
  useEffect(() => {
    if (!dealerNo) return;
    const fetchConsultData = async () => {
      try {
        const response = await axios.get(
          `http://222.112.27.120:8001/dealer_consults/${dealerNo}`
        );
        setApplications(response.data);
      } catch (error) {
        console.error("상담 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchConsultData();
  }, [dealerNo]);

  const openMemoModal = async (consultNo) => {
    try {
      const consultResponse = await axios.get(
        `http://222.112.27.120:8001/consult_details/${consultNo}`
      );
      setConsultDetails(consultResponse.data);

      const memoResponse = await axios.get(
        `http://222.112.27.120:8001/memo/${consultNo}`
      );

      const consultContent = memoResponse.data.consultContent || "";
      const consultHistNo = memoResponse.data.consult_hist_no || null;

      setMemoContent(consultContent);
      setSelectedConsult({
        custom_consult_no: consultNo,
        consult_hist_no: consultHistNo,
      });

      setIsMemoModalOpen(true);
    } catch (error) {
      console.error("모달 데이터를 가져오는 중 오류 발생:", error);
      setMemoContent("");
      setSelectedConsult({
        custom_consult_no: consultNo,
        consult_hist_no: null,
      });
      setIsMemoModalOpen(true);
    }
  };

  const saveMemo = async () => {
    try {
      let endpoint;
      let method;
      let payload;

      if (selectedConsult.consult_hist_no) {
        // 기존 메모 수정
        endpoint = `http://222.112.27.120:8001/consult_hist/${selectedConsult.consult_hist_no}`;
        method = "put";
        payload = { consult_content: memoContent };
      } else {
        // 새로운 메모 등록
        endpoint = `http://222.112.27.120:8001/consult_hist`;
        method = "post";
        payload = {
          custom_consult_no: selectedConsult.custom_consult_no,
          consult_content: memoContent,
        };
      }

      const response = await axios[method](endpoint, payload);

      alert(
        selectedConsult.consult_hist_no
          ? "메모가 성공적으로 수정되었습니다."
          : "메모가 성공적으로 등록되었습니다."
      );

      if (!selectedConsult.consult_hist_no) {
        setSelectedConsult((prev) => ({
          ...prev,
          consult_hist_no: response.data.data.consult_hist_no,
        }));
      }

      setIsMemoModalOpen(false);
    } catch (error) {
      console.error("메모 저장 중 오류 발생:", error);
      alert("메모 저장 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 상담 상태 변경
  const confirmChangeConsultStatus = (consultNo, customerName) => {
    setSelectedConsultForStatusChange({ consultNo, customerName });
    setIsConfirmModalOpen(true);
  };

  const changeConsultStatus = async () => {
    try {
      const { consultNo } = selectedConsultForStatusChange;
      const response = await axios.put(
        `http://222.112.27.120:8001/dealer_consults/complete/${consultNo}`
      );

      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.custom_consult_no === consultNo
            ? { ...app, consult_process: "상담 완료" }
            : app
        )
      );

      setIsConfirmModalOpen(false);
    } catch (error) {
      console.error("상담 상태를 업데이트 하는 중 오류 발생:", error);
    }
  };

  const closeMemoModal = () => {
    setIsMemoModalOpen(false);
    setMemoContent("");
  };

  return (
    <div className="dealer-dashboard">
      <div className="dealer-dashboard-sidebar">
        <button
          className={selectedTab === "상담 시작 전" ? "active-tab" : ""}
          onClick={() => setSelectedTab("상담 시작 전")}
        >
          상담 시작 전
        </button>
        <button
          className={selectedTab === "상담 완료" ? "active-tab" : ""}
          onClick={() => setSelectedTab("상담 완료")}
        >
          상담 완료
        </button>
      </div>
      <div className="dealer-dashboard-content">
        <h2>{dealerName} 딜러님의 상담페이지 입니다.</h2>
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>고객 이름</th>
              <th>접수된 상담</th>
              <th>신청날짜</th>
              <th>진행 상태</th>
              <th>메모</th>
            </tr>
          </thead>
          <tbody>
            {applications
              .filter((app) => app.consult_process === selectedTab)
              .map((app, index) => (
                <tr key={app.custom_consult_no}>
                  <td>{index + 1}</td>
                  <td>{app.customer_name}</td>
                  <td>{app.custom_content}</td>
                  <td>{new Date(app.created_at).toLocaleDateString()}</td>
                  <td>
                    {app.consult_process === "상담 시작 전" ? (
                      <button
                        onClick={() =>
                          confirmChangeConsultStatus(
                            app.custom_consult_no,
                            app.customer_name
                          )
                        }
                      >
                        상담 완료로 변경
                      </button>
                    ) : (
                      <span>상담 완료</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => openMemoModal(app.custom_consult_no)}
                    >
                      {app.consult_process === "상담 완료" ||
                      app.consult_hist_no
                        ? "메모 수정"
                        : "메모 등록"}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {isMemoModalOpen && (
        <MemoModal
          isOpen={isMemoModalOpen}
          consultDetails={consultDetails}
          memoContent={memoContent}
          onChangeMemoContent={setMemoContent}
          onClose={closeMemoModal}
          onSave={saveMemo}
          isEditMode={!!selectedConsult?.consult_hist_no}
        />
      )}

      <CompleteCheck
        isOpen={isConfirmModalOpen}
        customerName={selectedConsultForStatusChange?.customerName}
        onConfirm={changeConsultStatus}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
};

export default DealerDashboard;
