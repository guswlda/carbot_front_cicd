import React, { useEffect } from "react";
import "../../carinfo/carInfo.css";
import GrandeurImage from "../../../images/grandeur.png";

const Grandeur = () => {
  // 페이지 로드 시 스크롤을 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* Main Content */}
      <div className="carinfo-container">
        <div className="carinfo-title">
          <h2>Grandeur</h2>
        </div>

        <div className="carinfo-content">
          <img src={GrandeurImage} alt="그랜저" className="carinfo-image" />

          <div className="carinfo-specifications">
            <p className="carinfo-p">차량 정보</p>
            <ul className="carinfo-ul">
              <li>엔진 종류: 3.5L V6</li>
              <li>배기량: 3,470cc</li>
              <li>최대 출력: 290마력</li>
              <li>최대 토크: 35.0kg.m</li>
              <li>구동 방식: 전륜 구동</li>
              <li>공인 연비: 10.5km/l</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grandeur;
