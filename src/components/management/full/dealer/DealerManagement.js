// 프론트엔드 코드: DealerManagement.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DealerManagement.css";

const DealerManagement = () => {
  const [dealers, setDealers] = useState([]); // 전체 딜러 데이터
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [newPhone, setNewPhone] = useState(""); // 수정할 핸드폰 번호 상태
  const [newId, setNewId] = useState(""); // 수정할 딜러 아이디 상태
  const [isEditing, setIsEditing] = useState(false); // 수정 가능 여부 상태
  const dealersPerPage = 5; // 한 페이지에 보여줄 딜러 수

  const handleEditClick = (dealer) => {
    setSelectedDealer(dealer);
    setNewPhone(dealer.dealer_phone); // 기존 핸드폰 번호 설정
    setNewId(dealer.dealer_id); // 기존 아이디 설정
    setIsEditing(false); // 수정 활성화
  };

  const handlePhoneChange = (e) => {
    const input = e.target.value.replace(/[^0-9-]/g, ""); // 숫자와 하이픈만 허용
    if (input.length <= 13) {
      setNewPhone(input);
    }
  };

  const handleIdChange = (e) => {
    setNewId(e.target.value); // 아이디 입력 변경
  };

  const handleSaveInfo = async () => {
    try {
      const response = await axios.patch(
        `http://222.112.27.120:8001/update_dealer_info/${selectedDealer.dealer_no}`,
        {
          dealer_phone: newPhone,
          dealer_id: newId,
        }
      );

      if (response.status === 200) {
        // 성공적으로 수정된 경우 딜러 목록 업데이트
        setDealers((prevDealers) =>
          prevDealers.map((dealer) =>
            dealer.dealer_no === selectedDealer.dealer_no
              ? { ...dealer, dealer_phone: newPhone, dealer_id: newId }
              : dealer
          )
        );
        alert("딜러 정보가 수정되었습니다.");
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error updating dealer info:", error);
    }
  };

  const handleCloseModal = () => {
    setSelectedDealer(null);
    setNewPhone("");
    setNewId("");
    setIsEditing(false);
  };

  useEffect(() => {
    // 백엔드에서 딜러 데이터 가져오기
    const fetchDealers = async () => {
      try {
        const response = await axios.get(
          "http://222.112.27.120:8001/all_dealers"
        );
        setDealers(response.data.users); // 백엔드 응답의 users 키 사용
      } catch (error) {
        console.error("Error fetching dealer data:", error);
      }
    };

    fetchDealers();
  }, []);

  // 페이지에 표시할 딜러 데이터 계산
  const indexOfLastDealer = currentPage * dealersPerPage;
  const indexOfFirstDealer = indexOfLastDealer - dealersPerPage;
  const currentDealers = dealers.slice(indexOfFirstDealer, indexOfLastDealer);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(dealers.length / dealersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="dealer-management">
      <h2 className="dealer-management-title">딜러 관리</h2>
      <table className="dealer-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>딜러 아이디</th>
            <th>딜러 이름</th>
            <th>전화번호</th>
            <th>상태</th>
            <th>정보 수정</th>
          </tr>
        </thead>
        <tbody>
          {currentDealers.map((dealer, index) => (
            <tr key={dealer.dealer_no}>
              <td>{indexOfFirstDealer + index + 1}</td>
              <td>{dealer.dealer_id}</td>
              <td>{dealer.dealer_name}</td>
              <td>{dealer.dealer_phone}</td>
              <td>{dealer.status ? "활성" : "비활성"}</td>
              <td>
                <button onClick={() => handleEditClick(dealer)}>수정</button>
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

      {/* 딜러 수정 모달 */}
      {selectedDealer && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>딜러 정보 수정</h3>
            <table className="modal-table">
              <tbody>
                <tr>
                  <td>아이디</td>
                  <td>
                    <input
                      type="text"
                      value={newId}
                      onChange={handleIdChange}
                      disabled={!isEditing}
                      className={`id-input ${isEditing ? "editing" : ""}`}
                    />
                  </td>
                </tr>
                <tr>
                  <td>이름</td>
                  <td>{selectedDealer.dealer_name}</td>
                </tr>
                <tr>
                  <td>전화번호</td>
                  <td>
                    <input
                      type="text"
                      value={newPhone}
                      onChange={handlePhoneChange}
                      disabled={!isEditing}
                      className={`phone-input ${isEditing ? "editing" : ""}`}
                    />
                  </td>
                </tr>
                <tr>
                  <td>상태</td>
                  <td>{selectedDealer.status ? "활성" : "비활성"}</td>
                </tr>
              </tbody>
            </table>
            <div className="modal-buttons">
              <button
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                수정
              </button>
              <button className="save-button" onClick={handleSaveInfo}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealerManagement;
