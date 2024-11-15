import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Eximage from '../../images/genesis.png'; // 이미지 경로 설정
import Grandeur from '../../images/grandeur.png';
import Avante from '../../images/avante.png';
import Palisade from '../../images/palisade.png';
import './mypage.css';
import Proposal from './modal/proposal';

const carData = [
  {
    image: Grandeur,
    modelName: 'Grandeur',
  },
  {
    image: Avante,
    modelName: 'Avante Hybrid',
  },
  {
    image: Palisade,
    modelName: 'Palisade',
  },
];

function MyPage() {
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate hook
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태 관리
  const [activePage, setActivePage] = useState('interest'); // 현재 활성화된 페이지 상태
  const [consultationData, setConsultationData] = useState([]); // 상담 내역 데이터 상태
  const [password, setPassword] = useState(''); // 비밀번호 상태 (회원 정보 수정 확인용)
  const [isPasswordChecked, setIsPasswordChecked] = useState(false); // 비밀번호 확인 상태
  const [userId, setUserId] = useState(''); // 사용자 아이디 상태
  const [confirmPassword, setConfirmPassword] = useState(''); // 새 비밀번호 확인 상태
  const [email, setEmail] = useState(''); // email 상태 정의
  const [isError, setIsError] = useState(false); // 에러 상태
  const { customer_id } = useParams(); // URL 매개변수에서 customer_id를 가져오기
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 저장하는 상태 변수
  const [userType, setUserType] = useState(''); // 사용자 유형을 저장하는 상태 변수

  // formData: 사용자 정보 상태 관리 (이메일, 아이디, 새 비밀번호 등)
  const [formData, setFormData] = useState({
    email: '',
    id: '',
    newPassword: '',
    confirmPassword: '',
    birthYear: '',
    city: '',
    gender: '',
  });
  const [errors, setErrors] = useState({}); // 에러 메시지 상태 관리
  const storedUserId = sessionStorage.getItem('userId'); // 세션 스토리지에서 userId 가져오기

  // 사용자 정보 가져오기
  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      axios
        .get(`http://222.112.27.120:8001/user_email/${storedUserId}`)
        .then((response) => {
          const { email, userId } = response.data;

          // 이메일과 아이디를 formData에 설정
          setFormData((prevData) => ({
            ...prevData,
            email: email,
            id: userId,
          }));
        })
        .catch((error) => {
          console.error('회원 정보를 불러오는데 오류가 발생했습니다.', error);
        });
    } else {
      // 세션에 사용자 정보가 없을 경우 로그인 페이지로 이동
      console.error(
        '세션에 사용자 정보가 없습니다. 로그인 페이지로 이동합니다.'
      );
      navigate('/login');
    }
  }, [navigate]);

  // 상담 내역 데이터 가져오기
  useEffect(() => {
    const fetchConsultationData = async () => {
      try {
        const storedUserId = sessionStorage.getItem('userId'); // 세션에서 userId 가져오기
        if (!storedUserId) {
          console.error('로그인 상태가 아닙니다. 로그인 페이지로 이동합니다.');
          navigate('/login');
          return;
        }

        const response = await axios.get(
          `http://222.112.27.120:8001/consultations/${storedUserId}`
        );

        if (response.status === 200) {
          setConsultationData(response.data); // 상담 내역 데이터 상태 업데이트
        } else {
          console.error(
            `상담 데이터를 가져오는 데 실패했습니다. 상태 코드: ${response.status}`
          );
          setConsultationData([]); // 실패 시 빈 배열로 초기화
        }
      } catch (error) {
        console.error(
          '상담 내역 데이터를 가져오는 중 오류가 발생했습니다.',
          error
        );
        setConsultationData([]); // 오류 발생 시 빈 배열로 초기화
      }
    };

    // 현재 페이지가 상담 내역 페이지일 때만 데이터 가져오기 실행
    if (activePage === 'consultation') {
      fetchConsultationData();
    }
  }, [activePage, navigate]);

  // 회원정보 수정 비밀번호 확인
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    // 세션 스토리지에서 userId 가져오기
    const storedUserId = sessionStorage.getItem('userId');

    // 입력된 비밀번호가 제대로 전달되고 있는지 콘솔 확인
    console.log('Stored User ID:', storedUserId);
    console.log('Entered Password:', password);

    try {
      const response = await axios.post(
        'http://222.112.27.120:8001/cumstom_edit',
        {
          storeadUserId: storedUserId,
          password: password,
        }
      );

      if (response.status === 200) {
        setIsPasswordChecked(true);
        alert(response.data.message);

        // 비밀번호 확인 후 입력 필드 초기화
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('비밀번호 확인 오류:', error);
      alert(error.response?.data?.message || '비밀번호가 일치하지 않습니다.');
    }
  };
  // 회원정보 수정에서 비밀번호 변경
  const handleMyInfoEdit = async (e) => {
    e.preventDefault(); // 페이지 리로드 방지

    // 새 비밀번호와 비밀번호 확인 일치 여부 확인
    if (password !== confirmPassword) {
      // console.log('새 비밀번호와 비밀번호 확인이 일치하지 않음');
      alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      setIsError(true);
      return;
    }

    try {
      // 세션에 저장된 userId 또는 userEmail 가져오기
      const userId = sessionStorage.getItem('userId');

      console.log('전송할 새 비밀번호:', password);

      // 새 비밀번호를 백엔드로 전송
      const response = await axios.post(
        'http://222.112.27.120:8001/update_pass',
        {
          customer_id: userId,
          new_password: password, // 새 비밀번호
        }
      );

      if (response.status === 200) {
        alert('비밀번호가 변경되었습니다!');
        // console.log('비밀번호가 성공적으로 변경됨');

        // 상태 초기화
        setPassword('');
        setConfirmPassword('');
        setIsError(false);

        sessionStorage.clear(); // 모든 sessionStorage 데이터 삭제
        setIsLoggedIn(false); // 로그인 상태 false로 설정
        setUserType(''); // 사용자 유형 초기화
        alert('로그아웃 되었습니다.');
        navigate('/'); // 홈 페이지로 이동

        // 로그인 페이지로 이동
        navigate('/login');
      } else {
        alert('비밀번호 변경에 실패했습니다. 다시 시도해 주세요.');
        console.log('비밀번호 변경 실패, 상태 코드:', response.status);
      }
    } catch (error) {
      console.error('비밀번호 변경 중 오류 발생:', error);
      alert('비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  // 수정 취소 함수
  const handleCancel = () => {
    alert('회원정보 수정을 취소합니다.');
    navigate('/');
  };

  // 페이지에 따라 다른 콘텐츠 렌더링
  const renderContent = () => {
    switch (activePage) {
      case 'interest':
        return (
          <div className="mypage-container">
            {carData.map((car, index) => (
              <div className="mypage-card" key={index}>
                <img src={car.image} alt={car.modelName} />
                <div className="mypage-info">
                  <p>모델명: {car.modelName}</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="proposal-button"
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
          <div className="consultation-container">
            <table className="consultation-table">
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
                    <td colSpan="5">상담 내역이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      case 'profile':
        if (!isPasswordChecked) {
          return (
            <div className="profile-container">
              <p>현재 비밀번호 입력</p>
              <input
                type="password"
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="password-input"
              />
              <button onClick={handlePasswordSubmit} className="confirm-button">
                확인
              </button>
            </div>
          );
        } else {
          return (
            <div className="profile-edit-container">
              <div className="editInfo-input-group">
                <p>이메일</p>
                <input type="email" value={formData.email} disabled />
              </div>
              <div className="editInfo-input-group">
                <p>아이디</p>
                <input type="text" value={formData.id} disabled />
              </div>
              <div className="editInfo-input-group">
                <p>새 비밀번호</p>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="새 비밀번호 입력"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={errors.newPassword ? 'error' : ''}
                />
              </div>
              <div className="editInfo-input-group">
                <p>비밀번호 확인</p>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="비밀번호 확인"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && (
                  <p className="error-message">{errors.confirmPassword}</p>
                )}
              </div>
              <button onClick={handleMyInfoEdit} className="editInfo-button">
                저장
              </button>
              <button onClick={handleCancel} className="editInfo-button">
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
    <div className="my-page">
      <div className="button-group">
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
