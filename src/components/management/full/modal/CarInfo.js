import React from 'react';
import './CarInfo.css';

const CarInfo = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="small-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>고객 차량 정보</h3>
        <table>
          <tbody>
            <tr>
              <td>제조사</td>
              <td>현대</td>
            </tr>
            <tr>
              <td>모델명</td>
              <td>아반떼</td>
            </tr>
            <tr>
              <td>연식</td>
              <td>2020</td>
            </tr>
            <tr>
              <td>차량 유형</td>
              <td>세단</td>
            </tr>
          </tbody>
        </table>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default CarInfo;
