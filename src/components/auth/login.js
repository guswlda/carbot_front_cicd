import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // 올바르게 임포트
import './login.css';

const Login = () => {
  const [isDealerLogin, setIsDealerLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // toggleLoginMode 함수 정의 (고객/딜러 로그인 전환)
  const toggleLoginMode = () => {
    setIsDealerLogin(!isDealerLogin);
    setErrors({});
  };

  // 페이지 새로 고침 시 토큰과 쿠키가 있으면 로그인 상태 유지
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const isLoggedInCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('isLoggedIn='))
      ?.split('=')[1];

    if (token && isLoggedInCookie) {
      try {
        const decoded = jwtDecode(token); // 토큰 디코딩
        setIsLoggedIn(true);
        sessionStorage.setItem('userId', decoded.userId); // userId 저장
        sessionStorage.setItem('userType', decoded.userType); // userType 저장
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }, []);

  // 로그인 처리 함수
  const handleLogin = () => {
    const newErrors = {};
    if (!username) newErrors.username = '아이디를 입력해 주세요.';
    if (!password) newErrors.password = '비밀번호를 입력해 주세요.';
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const loginData = {
        username,
        password,
        userType: isDealerLogin ? 'dealer' : 'customer', // userType 추가
      };

      axios
        .post('http://222.112.27.120:8001/login', loginData, {
          withCredentials: true, // 쿠키 전송을 위해 withCredentials 설정
        })
        .then((response) => {
          const { token, userId, userType } = response.data;

          if (token && token.split('.').length === 3) {
            // JWT 형식 확인
            sessionStorage.setItem('token', token); // JWT를 sessionStorage에 저장
            sessionStorage.setItem('userId', userId); // userId 저장
            sessionStorage.setItem('userType', userType); // userType 저장

            // 상태 갱신 이벤트 디스패치
            window.dispatchEvent(new Event('storage'));

            alert('로그인에 성공했습니다.');
            if (userType === 'customer') {
              navigate('/mypage'); // 마이페이지로 이동
            } else if (userType === 'dealer') {
              navigate('/DealerDashboard');
            }
          } else {
            console.error('Invalid token format');
          }
        })
        .catch((error) => {
          alert(error.response?.data?.message || '로그인에 실패했습니다.');
        });
    }
  };

  return (
    <div className='page-container'>
      <section className='login-container'>
        <div className='login-box'>
          <div className='login-box-text'>
            <h1>{isDealerLogin ? '딜러 로그인' : '고객 로그인'}</h1>
            <a href='#' className='corporate-login' onClick={toggleLoginMode}>
              {isDealerLogin ? '개인 로그인' : '딜러 로그인'}
            </a>
          </div>

          <div className='login-inputs'>
            <input
              type='text'
              placeholder={
                isDealerLogin ? '딜러 아이디 입력' : '고객 아이디 입력'
              }
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={errors.username ? 'login-error-input' : ''}
            />
            {errors.username && (
              <p className='login-error-message'>{errors.username}</p>
            )}
            <input
              type='password'
              placeholder='비밀번호 입력'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'login-error-input' : ''}
            />
            {errors.password && (
              <p className='login-error-message'>{errors.password}</p>
            )}
            <button className='login-button' onClick={handleLogin}>
              {isDealerLogin ? '딜러 로그인' : '고객 로그인'}
            </button>
          </div>

          <div className='help-links'>
            <Link to='/findID'>아이디 찾기</Link> |{' '}
            <Link to='/findPW'>비밀번호 찾기</Link>
            <p>
              회원이 아니신가요?{' '}
              <Link to='/join' className='signup-link'>
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
