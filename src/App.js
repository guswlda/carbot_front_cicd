// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './components/main/main';
import Notification from './components/notification/notification';
import Login from './components/auth/login';
import Join from './components/auth/join';
import CarInfo from './components/carinfo/carInfo';
import CarSelect from './components/carselect/carSelect';
import Layout from './components/Layout';
import FindID from './components/auth/set_id&pw/FindID';
import FindPW from './components/auth//set_id&pw/FindPW';
import ResetPW from './components/auth//set_id&pw/ResetPW';
import Mypage from './components/mypage/mypage';
import CallbotIcon from './components/callbot/callbotIcon';
import AdminLogin from './components/management/login/AdminLogin';
import AdminDashboard from './components/management/full/AdminDashboard';
import Avante from './components/main/MainCarInfo/Avante';
import Grandeur from './components/main/MainCarInfo/Grandeur';
import Palisade from './components/main/MainCarInfo/Palisade';
import DealerDashboard from './components/dealer/DealerDashboard';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Layout을 모든 페이지의 상위 컴포넌트로 설정 */}
          <Route element={<Layout />}>
            <Route path='/' element={<Main />} />
            <Route path='/MainCarInfo/Avante' element={<Avante />} />
            <Route path='/MainCarInfo/Grandeur' element={<Grandeur />} />
            <Route path='/MainCarInfo/Palisade' element={<Palisade />} />
            <Route path='/Notification' element={<Notification />} />
            {/* 추가 사항 */}
            <Route path='/notification/:notice_no' element={<Notification />} />
            <Route path='/Mypage' element={<Mypage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/join' element={<Join />} />
            <Route path='/findID' element={<FindID />} />
            <Route path='/findPW' element={<FindPW />} />
            <Route path='/resetPW' element={<ResetPW />} />
            <Route path='/CarInfo' element={<CarInfo />} />
            <Route path='/CarSelect' element={<CarSelect />} />
            <Route path='/AdminLogin' element={<AdminLogin />} />
            <Route path='/DealerDashboard' element={<DealerDashboard />} />
            <Route path='/AdminDashboard' element={<AdminDashboard />} />
            <Route path='/detail/:customer_id' element={<AdminDashboard />} />
          </Route>
        </Routes>
        <CallbotIcon />
      </div>
    </Router>
  );
};

export default App;