import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FindPW.css";
import axios from "axios";

const FindPassword = () => {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false); // 인증 완료 여부
  const [showVerification, setShowVerification] = useState(false); // 인증 필드 표시 여부
  const [errors, setErrors] = useState({
    id: false,
    email: false,
  });

  const navigate = useNavigate();

  const handleValidation = () => {
    const newErrors = {
      id: id.trim() === "",
      customor_email: email.trim() === "",
    };
    setErrors(newErrors);

    return !newErrors.id && !newErrors.email;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (handleValidation()) {
      try {
        const verifyResponse = await axios.post(
          "http://222.112.27.120:8001/verify_user",
          {
            customer_id: id,
            customer_email: email,
          }
        );

        if (verifyResponse.status === 200) {
          const response = await axios.post(
            "http://222.112.27.120:8001/send_email",
            {
              customor_email: email, // userEmail은 사용자 입력 이메일 주소 변수
            }
          );

          if (response.status === 200) {
            // 백엔드에서 인증번호 발송 성공 응답을 받으면 알림 표시
            alert("인증번호가 이메일로 발송되었습니다.");
            setShowVerification(true); // 인증 필드 표시
          }
        }
      } catch (error) {
        console.error("Error sending verification code:", error);
        alert("아이디 또는 이메일이 올바르지 않습니다.");
      }
    }
  };

  const handleVerification = async () => {
    if (verificationCode.trim() === "") {
      alert("인증번호를 입력해주세요.");
    } else {
      try {
        const response = await axios.post(
          "http://222.112.27.120:8001/verify_email",
          {
            email: email,
            code: verificationCode,
          }
        );
        // 서버에서 인증이 성공했다면
        if (response.status === 200) {
          alert("인증이 완료되었습니다.");
          setIsVerified(true); // 인증 완료 상태로 변경
        } else {
          alert("인증번호가 일치하지 않습니다.");
        }
      } catch (error) {
        console.error("Error sending verification code:", error);
        alert("인증번호 확인 중 오류가 발생했습니다.");
      }
    }
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (isVerified) {
      navigate("/resetPW", { state: { email } }); // 인증 완료 후 페이지 이동
    } else {
      alert("먼저 인증을 완료해 주세요.");
    }
  };

  return (
    <div className="pw-container">
      <div className="pw-box">
        <h1>비밀번호 찾기</h1>
        <form
          onSubmit={showVerification ? handleFinalSubmit : handleEmailSubmit}
          className="pw-input-box"
        >
          <p>아이디</p>
          <input
            type="text"
            placeholder="아이디 입력"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className={errors.id ? "input-error" : ""}
          />
          {errors.id && (
            <span className="error-text">아이디를 입력해 주세요.</span>
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

          {showVerification && (
            <div className="verification">
              <input
                type="text"
                placeholder="인증번호 입력"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <button type="button" onClick={handleVerification}>
                인증
              </button>
            </div>
          )}

          <div className="pw-button">
            <button type="submit">확인</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FindPassword;
