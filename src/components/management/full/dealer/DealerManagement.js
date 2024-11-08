import React, { useState } from 'react';
import './DealerManagement.css';
import dealerData from './dealerData.json';

const DealerManagement = () => {
  const [dealers, setDealers] = useState(dealerData);
  const [selectedDealer, setSelectedDealer] = useState(null);

  const handleEditClick = (dealer) => {
    setSelectedDealer(dealer);
  };

  const handleCloseModal = () => {
    setSelectedDealer(null);
  };

  return (
    <div className="dealer-management">
      <h2 className="dealer-management-title">딜러 관리</h2>
      <table className="dealer-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>딜러 이름</th>
            <th>전화번호</th>
            <th>평점</th>
            <th>정보 수정</th>
          </tr>
        </thead>
        <tbody>
          {dealers.map((dealer, index) => (
            <tr key={dealer.id}>
              <td>{index + 1}</td>
              <td>{dealer.name}</td>
              <td>{dealer.phone}</td>
              <td>{dealer.rank}</td>
              <td>
                <button onClick={() => handleEditClick(dealer)}>수정</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 딜러 수정 모달 */}
      {selectedDealer && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>딜러 정보 수정</h3>
            <table className="modal-table">
              <tbody>
                <tr>
                  <td>이름</td>
                  <td>{selectedDealer.name}</td>
                </tr>
                <tr>
                  <td>전화번호</td>
                  <td>{selectedDealer.phone}</td>
                </tr>
                <tr>
                  <td>평점</td>
                  <td>{selectedDealer.rank}</td>
                </tr>
              </tbody>
            </table>
            <div className="modal-buttons">
              <button className="edit-button">수정</button>
              <button className="delete-button" onClick={handleCloseModal}>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealerManagement;
