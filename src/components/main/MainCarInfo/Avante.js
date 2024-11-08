import React, { useEffect } from "react";
import "../../carinfo/carInfo.css";
import AvanteImage from "../../../images/avante.png";

const Avante = () => {
  // 페이지 로드 시 스크롤을 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* Main Content */}
      <div className="carinfo-container">
        <div className="carinfo-title">
          <h2>Avante Hybrid</h2>
        </div>

        <div className="carinfo-content">
          <img
            src={AvanteImage}
            alt="아반떼 하이브리드"
            className="carinfo-image"
          />

          <div className="carinfo-specifications">
            <p className="carinfo-p">차량 정보</p>
            <ul className="carinfo-ul">
              <li>엔진 종류: 가솔린 하이브리드</li>
              <li>배기량: 1,580cc</li>
              <li>최대 출력: 105마력</li>
              <li>최대 토크: 15.0kg.m</li>
              <li>구동 방식: 전륜 구동</li>
              <li>공인 연비: 20.2km/l</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Avante;
