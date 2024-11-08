import React, { useEffect } from "react";
import "../../carinfo/carInfo.css";
import PalisadeImage from "../../../images/palisade.png";

const Palisade = () => {
  // 페이지 로드 시 스크롤을 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* Main Content */}
      <div className="carinfo-container">
        <div className="carinfo-title">
          <h2>Palisade</h2>
        </div>

        <div className="carinfo-content">
          <img src={PalisadeImage} alt="팰리세이드" className="carinfo-image" />

          <div className="carinfo-specifications">
            <p className="carinfo-p">차량 정보</p>
            <ul className="carinfo-ul">
              <li>엔진 종류: 3.8L V6</li>
              <li>배기량: 3,778cc</li>
              <li>최대 출력: 295마력</li>
              <li>최대 토크: 36.2kg.m</li>
              <li>구동 방식: 전륜 또는 AWD</li>
              <li>공인 연비: 9.0km/l</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Palisade;
