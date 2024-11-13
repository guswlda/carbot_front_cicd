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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
  const [memoContent, setMemoContent] = useState("");
  const [selectedConsult, setSelectedConsult] = useState(null);
  const [consultDetails, setConsultDetails] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedConsultForStatusChange, setSelectedConsultForStatusChange] =
    useState(null);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab]);

  const filteredApplications = applications.filter(
    (app) => app.consult_process === selectedTab
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApplications.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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

  const handleSaveMemo = async () => {
    try {
      const { custom_consult_no, consult_hist_no } = selectedConsult;
      if (consult_hist_no) {
        // 메모 수정
        await axios.put(
          `http://222.112.27.120:8001/consult_hist/${consult_hist_no}`,
          {
            consult_content: memoContent,
          }
        );
        alert("메모가 성공적으로 수정되었습니다.");
      } else {
        // 메모 등록
        await axios.post("http://222.112.27.120:8001/consult_hist", {
          custom_consult_no: custom_consult_no,
          consult_content: memoContent,
        });
        alert("메모가 성공적으로 등록되었습니다.");
      }

      // 메모 저장 후 상담 데이터 갱신
      const updatedData = await axios.get(
        `http://222.112.27.120:8001/dealer_consults/${dealerNo}`
      );
      setApplications(updatedData.data);

      setIsMemoModalOpen(false);
    } catch (error) {
      console.error("메모 저장 중 오류 발생:", error);
      alert("메모 저장 중 오류가 발생했습니다.");
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
            {currentItems.map((app, index) => (
              <tr key={app.custom_consult_no}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{app.customer_name}</td>
                <td>{app.custom_content}</td>
                <td>{new Date(app.created_at).toLocaleDateString()}</td>
                <td>
                  {app.consult_process === "상담 시작 전" ? (
                    <button
                      onClick={() => {
                        setSelectedConsultForStatusChange({
                          consultNo: app.custom_consult_no,
                          customerName: app.customer_name,
                        });
                        setIsConfirmModalOpen(true); // 모달 열기
                      }}
                    >
                      상담 완료로 변경
                    </button>
                  ) : (
                    <span>상담 완료</span>
                  )}
                </td>
                <td>
                  <button onClick={() => openMemoModal(app.custom_consult_no)}>
                    {app.consult_hist_no ? "메모 수정" : "메모 등록"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-button ${
                currentPage === page ? "active" : ""
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      {isMemoModalOpen && (
        <MemoModal
          isOpen={isMemoModalOpen}
          consultDetails={consultDetails}
          memoContent={memoContent}
          onChangeMemoContent={setMemoContent}
          onClose={closeMemoModal}
          onSave={handleSaveMemo} // handleSaveMemo 전달
          isEditMode={!!selectedConsult?.consult_hist_no} // 메모 수정 여부 판단
        />
      )}

      <CompleteCheck
        isOpen={isConfirmModalOpen}
        customerName={selectedConsultForStatusChange?.customerName}
        onConfirm={async () => {
          try {
            const response = await axios.put(
              `http://222.112.27.120:8001/process_complete/${selectedConsultForStatusChange.consultNo}`
            );
            console.log(response.data.message);

            const updatedData = await axios.get(
              `http://222.112.27.120:8001/dealer_consults/${dealerNo}`
            );
            setApplications(updatedData.data);

            setIsConfirmModalOpen(false);
          } catch (error) {
            console.error("상담 완료 처리 중 오류 발생:", error);
          }
        }}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
};

export default DealerDashboard;
