import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DealerDashboard.css";
import { MdOutlineClose } from "react-icons/md";

const DealerDashboard = () => {
  const [dealerName, setDealerName] = useState(""); // 딜러 이름 상태 추가
  const [selectedTab, setSelectedTab] = useState("상담 시작 전"); // 초기 화면을 "상담 시작 전"으로 설정
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [memo, setMemo] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchDealerName = async () => {
      const dealerId = sessionStorage.getItem("userId"); // 세션에서 dealerId 가져오기
      try {
        const response = await axios.get(
          `http://222.112.27.120:8001/dealer_name/${dealerId}`
        );
        setDealerName(response.data.dealerName); // 딜러 이름 저장
      } catch (error) {
        console.error("Error fetching dealer name:", error);
      }
    };

    fetchDealerName();
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications(selectedTab);
  }, [selectedTab, applications]);

  const fetchApplications = async () => {
    try {
      const response = await axios.get("http://222.112.27.120:8001/dealer_consult");
      setApplications(response.data);
      setFilteredApplications(
        response.data.filter((app) => app.consult_process === "상담 시작 전")
      ); // 초기 필터링
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const filterApplications = (status) => {
    setFilteredApplications(
      applications.filter((app) => app.consult_process === status)
    );
  };

  const handleTabChange = (status) => {
    setSelectedTab(status);
    setSelectedApplication(null);
  };

  const handleStatusClick = async (application) => {
    if (application.consult_process === "상담 시작 전") {
      try {
        await axios.put(
          `http://222.112.27.120:8001/dealer_consult/${application.custom_consult_no}`,
          { consult_process: "진행 중" }
        );
        alert("상태가 진행 중으로 변경되었습니다.");
        fetchApplications();
        setSelectedTab("진행 중");
      } catch (error) {
        console.error("Error updating consult process:", error);
      }
    } else if (application.consult_process === "진행 중") {
      setSelectedApplication(application);
      setMemo("");
      setIsEditing(false);
    } else if (application.consult_process === "상담 완료") {
      setSelectedApplication(application);
      setMemo(application.memo || "");
      setIsEditing(true);
    }
  };

  const handleMemoChange = (e) => {
    setMemo(e.target.value);
  };

  const handleSaveMemo = async () => {
    if (isEditing) {
      try {
        await axios.put(
          `http://222.112.27.120:8001/dealer_consult/${selectedApplication.custom_consult_no}`,
          { consult_content: memo }
        );
        alert("메모가 수정되었습니다.");
        fetchApplications();
        setSelectedApplication(null);
      } catch (error) {
        console.error("Error updating memo:", error);
      }
    } else {
      try {
        await axios.post("http://222.112.27.120:8001/add_consult_memo", {
          consult_content: memo,
          consult_hist_status: true,
          custom_consult_no: selectedApplication.custom_consult_no,
        });
        await axios.put(
          `http://222.112.27.120:8001/dealer_consult/${selectedApplication.custom_consult_no}`,
          { consult_process: "상담 완료" }
        );
        alert("메모가 추가되고 상담 상태가 완료로 변경되었습니다.");
        fetchApplications();
        setSelectedApplication(null);
      } catch (error) {
        console.error("Error saving memo:", error);
      }
    }
  };

  const handleEditMemo = () => {
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setSelectedApplication(null);
    setIsEditing(false);
  };

  return (
    <div className="dealer-dashboard">
      <div className="dealer-dashboard-sidebar">
        <button
          className={selectedTab === "상담 시작 전" ? "active-tab" : ""}
          onClick={() => handleTabChange("상담 시작 전")}
        >
          상담 시작 전
        </button>
        <button
          className={selectedTab === "진행 중" ? "active-tab" : ""}
          onClick={() => handleTabChange("진행 중")}
        >
          진행 중
        </button>
        <button
          className={selectedTab === "상담 완료" ? "active-tab" : ""}
          onClick={() => handleTabChange("상담 완료")}
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
              <th>접수된 상담</th>
              <th>신청날짜</th>
              <th>진행 상태</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app, index) => (
              <tr key={app.custom_consult_no}>
                <td>{index + 1}</td>
                <td>
                  {app.custom_content
                    ? app.custom_content.length > 15
                      ? app.custom_content.substring(0, 15) + "..."
                      : app.custom_content
                    : "고객 요청 사항이 없습니다"}
                </td>
                <td>{new Date(app.created_at).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleStatusClick(app)}>
                    {app.consult_process === "상담 시작 전"
                      ? "상담 시작 전"
                      : app.consult_process === "진행 중"
                      ? "진행 중"
                      : "수정"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedApplication && (
        <div className="dealer-dashboard-modal">
          <div className="dealer-dashboard-modal-content">
            <button className="dealer-close-button" onClick={handleCloseModal}>
              <MdOutlineClose />
            </button>

            <h3>상담 접수번호 : {selectedApplication.custom_consult_no}</h3>
            <div className="dealer-dashboard-modal-body">
              <div className="dealer-dashboard-applicant-info">
                <p>고객 요청사항: {selectedApplication.custom_content}</p>
              </div>
              <div className="dealer-dashboard-memo-section">
                <textarea
                  value={memo}
                  onChange={handleMemoChange}
                  placeholder="메모를 입력하세요..."
                />
                <div className="dealer-button-group">
                  <button
                    onClick={handleSaveMemo}
                    className="dealer-dashboard-complete-button"
                  >
                    {isEditing ? "수정 완료" : "완료"}
                  </button>
                  {isEditing && (
                    <button
                      onClick={handleEditMemo}
                      className="dealer-dashboard-edit-button"
                    >
                      수정
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealerDashboard;
