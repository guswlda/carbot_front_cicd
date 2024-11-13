import React, { useEffect, useState } from "react";
import axios from "axios";
import ConsultationModal from "../modal/Consultations";
import "./ConsultationManagement.css";

const Consultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 상담 목록 가져오기
  const fetchConsultations = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(
        "http://222.112.27.120:8001/get_consult"
      );
      console.log("Fetched consultations:", response.data); // 데이터 확인
      // 중복 제거
      const uniqueConsultations = response.data.filter(
        (item, index, self) =>
          index ===
          self.findIndex((t) => t.custom_consult_no === item.custom_consult_no)
      );
      setConsultations(uniqueConsultations);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      setError("상담 목록을 불러오는 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleRowClick = (consultation) => {
    console.log("Selected consultation:", consultation); // 선택 데이터 확인
    setSelectedConsultation(consultation); // 선택된 상담 설정
  };

  const handleCloseModal = () => {
    setSelectedConsultation(null); // 모달 닫기
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = consultations.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(consultations.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="consultations-container">
      <h2>상담관리</h2>
      {error && <p className="error-message">{error}</p>}
      {isLoading ? (
        <p>상담 목록을 불러오는 중입니다...</p>
      ) : (
        <>
          <table className="consultations-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>접수된 상담</th>
                <th>담당자</th>
                <th>작성일</th>
                <th>상세보기</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((consultation, index) => (
                <tr key={`${consultation.custom_consult_no}-${index}`}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{consultation.customer_name || "정보 없음"}</td>
                  <td>{consultation.dealer_name || "정보 없음"}</td>
                  <td>
                    {consultation.created_at
                      ? new Date(consultation.created_at).toLocaleDateString()
                      : "정보 없음"}
                  </td>
                  <td>
                    <button
                      onClick={() => handleRowClick(consultation)}
                      className="details-button"
                    >
                      자세히 보기
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
                  page === currentPage ? "active" : ""
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}
      {selectedConsultation && (
        <ConsultationModal
          consultation={selectedConsultation}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Consultations;
