import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./FindID.css";

const FindId = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ name: false, email: false });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(""); // 찾은 아이디 상태 관리
  const [error, setError] = useState(""); // 서버 오류 메시지

  const navigate = useNavigate();

  const findId = async () => {
    if (!name || !email) {
      console.error("Name or email is missing");
      return; // name과 email이 없으면 함수 종료
    }

    console.log("Name:", name, "Email:", email); // 디버깅 로그

    const findIdData = {
      customer_name: name,
      customer_email: email,
    };

    try {
      const response = await axios.post(
        "http://222.112.27.120:8001/find_id",
        findIdData
      );
      setUserId(response.data.userId); // 서버 응답에서 userId 가져오기
      setIsModalOpen(true); // 모달 열기
    } catch (error) {
      console.error(
        "아이디 찾기 오류:",
        error.response?.data?.message || error.message
      );
      setError(error.response?.data?.message || "아이디 찾기에 실패했습니다.");
    }
  };

  const handleValidation = () => {
    const newErrors = {
      name: name.trim() === "",
      email: email.trim() === "",
    };
    setErrors(newErrors);

    return !newErrors.name && !newErrors.email;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("폼 제출됨");

    if (handleValidation()) {
      console.log("유효성 검사 통과, 아이디 찾기 함수 호출");
      findId(); // 유효성 검사를 통과하면 아이디 찾기 함수 호출
    } else {
      console.log("유효성 검사 실패");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
    setUserId(""); // 아이디 초기화
    setError(""); // 오류 메시지 초기화
    navigate("/login");
  };

  return (
    <div className="findID-container">
      <div className="findID-box">
        <h1>아이디 찾기</h1>
        <form onSubmit={handleSubmit} className="input-name">
          <p>이름</p>
          <input
            type="text"
            placeholder="이름 입력"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? "input-error" : ""}
          />
          {errors.name && (
            <span className="error-text">이름을 입력해 주세요.</span>
          )}

          <p>이메일</p>
          <input
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && (
            <span className="error-text">이메일을 입력해 주세요.</span>
          )}

          <div className="findID-button">
            <button type="submit">확인</button>
          </div>
        </form>
      </div>

      {/* 모달창 표시 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>아이디 안내</h2>
            {userId ? (
              <p>찾은 아이디: {userId}</p>
            ) : (
              <p>{error || "아이디를 찾을 수 없습니다."}</p>
            )}
            <button onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindId;
