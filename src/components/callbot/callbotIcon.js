import React, { useState } from "react";
import CallbotModal from "./modal/callbot";
import "./callbotIcon.css";
import botImage from "./callbot_img.png";

const CallbotIcon = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* 우측 하단에 고정된 버튼과 아이콘 */}
      <div className="callbot-container" onClick={openModal}>
        <div className="callbot-text">콜봇에게 문의하세요!</div>
        <div className="callbot-icon">
          <img src={botImage} alt="Callbot Icon" className="bot-image" />
        </div>
      </div>

      {/* 모달 창 */}
      {isModalOpen && <CallbotModal onClose={closeModal} />}
    </div>
  );
};

export default CallbotIcon;
