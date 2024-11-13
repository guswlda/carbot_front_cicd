import React, { useEffect, useState } from "react";
import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../images/logo.png";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 저장하는 상태 변수
  const [userType, setUserType] = useState(""); // 사용자 유형을 저장하는 상태 변수
  const navigate = useNavigate();

  // 로그인 상태 확인 함수
  const checkLoginStatus = () => {
    const token = sessionStorage.getItem("token"); // sessionStorage에서 token 가져오기
    const storedUserType = sessionStorage.getItem("userType"); // sessionStorage에서 userType 가져오기
    setIsLoggedIn(!!token && storedUserType); // token과 userType이 존재하면 로그인 상태로 설정
    setUserType(storedUserType || ""); // userType을 상태에 설정
  };

  useEffect(() => {
    checkLoginStatus(); // 컴포넌트가 처음 로드될 때 로그인 상태 확인
    window.addEventListener("storage", checkLoginStatus); // sessionStorage 변경 감지
    return () => {
      window.removeEventListener("storage", checkLoginStatus); // 컴포넌트 언마운트 시 이벤트 정리
    };
  }, []);

  // 로그아웃 함수
  const handleLogout = () => {
    sessionStorage.clear(); // 모든 sessionStorage 데이터 삭제
    setIsLoggedIn(false); // 로그인 상태 false로 설정
    setUserType(""); // 사용자 유형 초기화
    alert("로그아웃 되었습니다.");
    navigate("/"); // 홈 페이지로 이동
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
            {/* userType에 따라 다른 링크와 버튼을 렌더링 */}
            {userType === "customer" && (
              <>
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
            )}
            {userType === "admin" && (
              <>
                 <Link to="/AdminDashboard" className="header-link">
                  관리자 페이지
                </Link>
                <button
                  onClick={handleLogout}
                  className="header-link logout-button"
                >
                  로그아웃
                </button>
              </>
            )}
            {userType === "dealer" && (
              <>
                 <Link to="/DealerDashboard" className="header-link">
                  딜러 페이지
                </Link>
                <button
                  onClick={handleLogout}
                  className="header-link logout-button"
                >
                  로그아웃
                </button>
              </>
            )}
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
