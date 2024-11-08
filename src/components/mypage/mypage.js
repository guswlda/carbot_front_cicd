import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Eximage from '../../images/genesis.png'; // 이미지 경로 설정
import './mypage.css';
import Proposal from './modal/proposal';
import axios from 'axios';

function MyPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태 관리
  const [activePage, setActivePage] = useState('interest'); // 현재 활성화된 페이지 상태
  const [consultationData, setConsultationData] = useState([]); // 상담 내역 데이터 상태
  const [password, setPassword] = useState(''); // 비밀번호 상태 (회원 정보 수정 확인용)
  const [isPasswordChecked, setIsPasswordChecked] = useState(false); // 비밀번호 확인 상태
  const [formData, setFormData] = useState({
    email: 'user@example.com', // 이메일 (수정 불가, 고정 값)
    id: 'user123', // 아이디 (수정 불가, 고정 값)
    newPassword: '',
    confirmPassword: '',
    birthYear: '',
    city: '',
    gender: '',
  });
  const [errors, setErrors] = useState({});
  const userId = sessionStorage.getItem('userId'); // 세션 스토리지에서 userId 가져오기

  // 상담 내역 데이터 가져오기
  useEffect(() => {
    const fetchConsultationData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8001/consultations/${userId}`
        );
        const data = await response.json();
        setConsultationData(data);
      } catch (error) {
        console.error('Error fetching consultation data:', error);
      }
    };

    // 현재 페이지가 상담 내역 페이지일 때만 데이터 가져오기 실행
    if (activePage === 'consultation') {
      fetchConsultationData();
    }
  }, [activePage, userId]);

  // 비밀번호 확인 함수
  const handlePasswordSubmit = () => {
    setIsPasswordChecked(true);
  };

  // 입력 데이터 변경 함수
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: '' });
  };

  // 회원 정보 수정 제출 함수
  const handleSubmit = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ confirmPassword: '비밀번호가 일치하지 않습니다.' });
      return;
    }
    alert('회원 정보가 수정되었습니다.');
  };

  // 수정 취소 함수
  const handleCancel = () => {
    alert('회원정보 수정을 취소합니다.');
    navigate('/mypage');
  };

  // 페이지에 따라 다른 콘텐츠 렌더링
  const renderContent = () => {
    switch (activePage) {
      case 'interest':
        return (
          <div className='mypage-container'>
            {[1, 2, 3].map((_, index) => (
              <div className='mypage-card' key={index}>
                <img src={Eximage} alt='GV80 coupe' />
                <div className='mypage-info'>
                  <p>모델명: GV80 coupe</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className='proposal-button'
                  >
                    구매 상담 신청
                  </button>

                  {isModalOpen && (
                    <Proposal onClose={() => setIsModalOpen(false)} />
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      case 'consultation':
        return (
          <div className='consultation-container'>
            <table className='consultation-table'>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>상담 신청 차량</th>
                  <th>담당자</th>
                  <th>신청 날짜</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {consultationData.length > 0 ? (
                  consultationData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.no}</td>
                      <td>{item.car_model}</td>
                      <td>{item.dealer_name}</td>
                      <td>{item.created_at}</td>
                      <td>{item.consult_process}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='5'>상담 내역이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      case 'profile':
        if (!isPasswordChecked) {
          return (
            <div className='profile-container'>
              <p>현재 비밀번호 입력</p>
              <input
                type='password'
                placeholder='비밀번호 입력'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='password-input'
              />
              <button onClick={handlePasswordSubmit} className='confirm-button'>
                확인
              </button>
            </div>
          );
        } else {
          return (
            <div className='profile-edit-container'>
              <div className='editInfo-input-group'>
                <p>이메일</p>
                <input type='email' value={formData.email} disabled />
              </div>
              <div className='editInfo-input-group'>
                <p>아이디</p>
                <input type='text' value={formData.id} disabled />
              </div>
              <div className='editInfo-input-group'>
                <p>새 비밀번호</p>
                <input
                  type='password'
                  name='newPassword'
                  placeholder='새 비밀번호 입력'
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={errors.newPassword ? 'error' : ''}
                />
              </div>
              <div className='editInfo-input-group'>
                <p>비밀번호 확인</p>
                <input
                  type='password'
                  name='confirmPassword'
                  placeholder='비밀번호 확인'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && (
                  <p className='error-message'>{errors.confirmPassword}</p>
                )}
              </div>
              <div className='editInfo-residence-group'>
                <p>거주지</p>
                <select
                  name='city'
                  value={formData.city}
                  onChange={handleChange}
                >
                  <option value=''>지역 선택</option>
                  {[
                    '서울특별시',
                    '부산광역시',
                    '대구광역시',
                    '인천광역시',
                    '광주광역시',
                    '대전광역시',
                    '울산광역시',
                    '세종특별자치시',
                    '경기도',
                    '강원도',
                    '충청북도',
                    '충청남도',
                    '전라북도',
                    '전라남도',
                    '경상북도',
                    '경상남도',
                    '제주특별자치도',
                  ].map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              <button onClick={handleSubmit} className='editInfo-button'>
                저장
              </button>
              <button onClick={handleCancel} className='editInfo-button'>
                취소
              </button>
            </div>
          );
        }
      default:
        return null;
    }
  };

  return (
    <div className='my-page'>
      <div className='button-group'>
        <button
          onClick={() => setActivePage('interest')}
          className={activePage === 'interest' ? 'active' : ''}
        >
          나의 관심 차량
        </button>
        <button
          onClick={() => setActivePage('consultation')}
          className={activePage === 'consultation' ? 'active' : ''}
        >
          내 상담 내역
        </button>
        <button
          onClick={() => setActivePage('profile')}
          className={activePage === 'profile' ? 'active' : ''}
        >
          회원 정보 수정
        </button>
      </div>

      <div>{renderContent()}</div>
    </div>
  );
}

export default MyPage;
