import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import Membership from "./modal/Membership";
import ConsultationManagement from "./consultation/ConsultationManagement";
import NoticeManagement from "./notice/NoticeManagement";
import DealerManagement from "./dealer/DealerManagement";

const AdminDashboard = () => {
  const [customers, setCustomers] = useState([]); // 고객 데이터 상태
  const [activeMenu, setActiveMenu] = useState("회원 관리");
  const [selectedCustomer, setSelectedCustomer] = useState(null); // 선택된 고객 상태

  useEffect(() => {
    // 백엔드에서 고객 데이터 가져오기
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://222.112.27.120:8001/all_users");
        setCustomers(response.data.users); // 응답 데이터에서 사용자 배열 설정
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchCustomers();
  }, []);

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer); // 선택된 고객 상태 설정하여 모달 열기
  };

  const handleCloseMembershipModal = () => {
    setSelectedCustomer(null); // 모달 닫기 위해 선택된 고객 상태 초기화
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <button onClick={() => setActiveMenu("회원 관리")}>회원 관리</button>
        <button onClick={() => setActiveMenu("상담 관리")}>상담 관리</button>
        <button onClick={() => setActiveMenu("공지사항 관리")}>
          공지사항 관리
        </button>
        <button onClick={() => setActiveMenu("딜러 관리")}>딜러 관리</button>
      </div>

      <div className="dashboard-content">
        {activeMenu === "회원 관리" && (
          <>
            <h2 className="dashboard-content-title">회원 조회</h2>
            <table className="dashboard-content-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>아이디</th>
                  <th>회원명</th>
                  <th>가입일자</th>
                  <th>상태</th>
                  <th>정보</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr key={customer.customer_id}>
                    <td>{index + 1}</td>
                    <td>{customer.customer_id}</td>
                    <td>{customer.customer_name}</td>
                    <td>
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td>{customer.status ? "활성" : "비활성"}</td>
                    <td>
                      <button onClick={() => handleCustomerClick(customer)}>
                        자세히 보기
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeMenu === "상담 관리" && <ConsultationManagement />}
        {activeMenu === "공지사항 관리" && <NoticeManagement />}
        {activeMenu === "딜러 관리" && <DealerManagement />}
      </div>

      {/* 고객 정보 모달 */}
      {selectedCustomer && (
        <Membership
          customer={selectedCustomer}
          onClose={handleCloseMembershipModal}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
