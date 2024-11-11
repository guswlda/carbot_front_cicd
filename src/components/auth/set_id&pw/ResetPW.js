import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 훅
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./ResetPW.css";

const ResetPW = () => {
  const location = useLocation();
  const email = location.state?.email;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate(); // 페이지 이동을 위한 훅 초기화

  const handleSubmit = async (e) => {
    e.preventDefault(); // 페이지 리로드 방지

    if (password === confirmPassword) {
      try {
        console.log("email", email);
        // 이메일을 백엔드로 전송
        const response = await axios.post(
          "http://222.112.27.120:8001/update_pass",
          {
            customer_email: email,
            new_password: password, // 새 비밀번호
          }
        );

        if (response.status === 200) {
          alert("비밀번호가 변경되었습니다!");
          setPassword("");
          setConfirmPassword("");
          setIsError(false);

          //로그인 페이지로 이동
          navigate("/login");
        } else {
          alert("비밀번호 변경에 실패했습니다. 다시 시도해 주세요.");
        }
      } catch (error) {
        console.error("Error updating password : ", error);
        alert("비밀번호 변경 중 오류가 발생했습니다.");
      }
    } else {
      setIsError(true); // 비밀번호 불일치 시
    }
  };

  return (
    <div className="resetPW-container">
      <div className="resetPW-box">
        <h1>비밀번호 재설정</h1>
        <form onSubmit={handleSubmit}>
          <p>새 비밀번호</p>
          <input
            type="password"
            placeholder="새 비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={isError ? "input-error" : ""}
          />
          <p>새 비밀번호 확인</p>
          <input
            type="password"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={isError ? "input-error" : ""}
          />
          {isError && (
            <p className="error-message">
              비밀번호가 일치하지 않습니다. 다시 입력해 주세요.
            </p>
          )}
          <div className="resetPW-button">
            <button type="submit">확인</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPW;
