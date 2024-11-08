import React from 'react';
import './header.css';
import { Link } from 'react-router-dom';
import Logo from '../../images/logo.png';

const Header = () => {
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
        <Link to="/mypage" className="header-link">
          마이페이지
        </Link>
      </div>

      <div className="header-right">
        <Link to="/login" className="header-link">
          로그인
        </Link>
      </div>
    </header>
  );
};

export default Header;
