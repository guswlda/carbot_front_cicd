import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './components/main/main.js';
import Notification from './components/notification/notification.js';
import Login from './components/auth/login.js';
import Join from './components/auth/join.js';
import CarInfo from './components/carinfo/carInfo.js';
import CarSelect from './components/carselect/carSelect.js';
import Layout from './components/Layout.js';
import FindID from './components/auth/set_id&pw/FindID.js';
import FindPW from './components/auth/set_id&pw/FindPW.js';
import ResetPW from './components/auth/set_id&pw/ResetPW.js';
import Mypage from './components/mypage/mypage.js';
import CallbotIcon from './components/callbot/callbotIcon.js';
import AdminLogin from './components/management/login/AdminLogin.js';
import AdminDashboard from './components/management/full/AdminDashboard.js';
import Avante from './components/main/MainCarInfo/Avante.js';
import Grandeur from './components/main/MainCarInfo/Grandeur.js';
import Palisade from './components/main/MainCarInfo/Palisade.js';
import DealerDashboard from './components/dealer/DealerDashboard.js';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Layout을 모든 페이지의 상위 컴포넌트로 설정 */}
          <Route element={<Layout />}>
            <Route path="/" element={<Main />} />
            <Route path="/MainCarInfo/Avante" element={<Avante />} />
            <Route path="/MainCarInfo/Grandeur" element={<Grandeur />} />
            <Route path="/MainCarInfo/Palisade" element={<Palisade />} />
            <Route path="/Notification" element={<Notification />} />
            {/* 추가 사항 */}
            <Route path="/notification/:notice_no" element={<Notification />} />
            <Route path="/Mypage" element={<Mypage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
            <Route path="/findID" element={<FindID />} />
            <Route path="/findPW" element={<FindPW />} />
            <Route path="/resetPW" element={<ResetPW />} />
            <Route path="/CarInfo" element={<CarInfo />} />
            <Route path="/CarSelect" element={<CarSelect />} />
            <Route path="/AdminLogin" element={<AdminLogin />} />
            <Route path="/DealerDashboard" element={<DealerDashboard />} />
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
            <Route path="/detail/:customer_id" element={<AdminDashboard />} />
          </Route>
        </Routes>
        <CallbotIcon />
      </div>
    </Router>
  );
};

export default App;
