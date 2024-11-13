import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // 올바르게 임포트
import "./AdminLogin.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // 페이지 새로 고침 시 토큰과 쿠키가 있으면 로그인 상태 유지
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const isLoggedInCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("isLoggedIn="))
      ?.split("=")[1];

    if (token && isLoggedInCookie) {
      try {
        const decoded = jwtDecode(token); // 토큰 디코딩
        setIsLoggedIn(true);
        sessionStorage.setItem("userId", decoded.userId); // userId 저장
        sessionStorage.setItem("userType", decoded.userType); // userType 저장
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  // 관리자 로그인 처리 함수
  const handleAdminLogin = (e) => {
    e.preventDefault();

    // 관리자 로그인 데이터
    const loginData = {
      username,
      password,
      userType: "admin", // 관리자는 userType을 'admin'으로 설정
    };

    axios
      .post("http://222.112.27.120:8001/login", loginData, {
        withCredentials: true, // 쿠키 전송을 위해 설정
      })
      .then((response) => {
        const { token, userId, userType } = response.data;

        if (token && token.split(".").length === 3) {
          // JWT 형식 확인
          sessionStorage.setItem("token", token); // JWT를 sessionStorage에 저장
          sessionStorage.setItem("userId", userId); // userId 저장
          sessionStorage.setItem("userType", userType); // userType 저장

          window.dispatchEvent(new Event("storage"));

          alert("관리자 로그인에 성공했습니다.");
          navigate("/AdminDashboard"); // 성공 시 관리자 대시보드로 이동
        } else {
          console.error("Invalid token format");
        }
      })
      .catch((error) => {
        setError(error.response?.data?.message || "로그인에 실패했습니다.");
      });
  };

  return (
    <div className="AdminLogin-container">
      <div className="AdminLogin-box">
        <h2 className="AdminLogin-title">관리자 로그인</h2>
        <form onSubmit={handleAdminLogin}>
          <div className="AdminLogin-input-group">
            <label htmlFor="username">아이디 입력</label>
            <input
              type="text"
              id="username"
              placeholder="아이디 입력"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="AdminLogin-input-group">
            <label htmlFor="password">비밀번호 입력</label>
            <input
              type="password"
              id="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="AdminLogin-error">{error}</p>}
          <button type="submit" className="AdminLogin-login-button">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
