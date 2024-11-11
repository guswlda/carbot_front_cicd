import React, { useEffect, useState } from "react";
import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../images/logo.png";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

  // 로그인 상태 확인 함수
  const checkLoginStatus = () => {
    const token = sessionStorage.getItem("token");
    const storedUserType = sessionStorage.getItem("userType");
    setIsLoggedIn(!!token && storedUserType === "customer"); // customer 확인
    setUserType(storedUserType || "");
  };

  useEffect(() => {
    checkLoginStatus(); // 컴포넌트가 처음 로드될 때 상태 확인
    window.addEventListener("storage", checkLoginStatus); // sessionStorage 변경 감지
    return () => {
      window.removeEventListener("storage", checkLoginStatus); // 이벤트 정리
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.clear(); // 모든 sessionStorage 데이터 삭제
    setIsLoggedIn(false);
    setUserType("");
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/notification" className="header-link">
          공지사항
        </Link>
      </div>

      <div className="header-logo">
        <Link to="/">
          <img src={Logo} alt="Carbot Logo" className="logo" />
        </Link>
      </div>

      <div className="header-right">
        {isLoggedIn ? (
          <>
            {/* customer 로그인이 확인된 경우에만 적용 */}
            <Link to="/mypage" className="header-link">
              마이페이지
            </Link>
            <button
              onClick={handleLogout}
              className="header-link logout-button"
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link to="/login" className="header-link">
            로그인
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
