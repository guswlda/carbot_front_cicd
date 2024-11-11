import React, { useEffect, useState } from "react";
import "./Membership.css";
import axios from "axios";
import { MdOutlineClose } from "react-icons/md";

const Membership = ({ customer, onClose }) => {
  const [detailedInfo, setDetailedInfo] = useState(null); // 추가 고객 정보 상태

  useEffect(() => {
    // 추가 고객 정보를 가져오는 함수
    const fetchDetailedInfo = async () => {
      try {
        const response = await axios.get(
          `http://222.112.27.120:8001/detail/${customer.customer_id}`
        );
        setDetailedInfo(response.data.user); // 가져온 추가 정보 저장
      } catch (error) {
        console.error("Error fetching detailed customer info:", error);
      }
    };

    fetchDetailedInfo();
  }, [customer.customer_id]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="membership-modal-content"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫기 방지
      >
        <h2>상세조회</h2>
        <p>상태: {customer.status ? "활성" : "비활성"}</p>
        <table className="membership-details-table">
          <tbody>
            <tr>
              <td>아이디</td>
              <td>{customer.customer_id}</td>
            </tr>
            <tr>
              <td>회원명</td>
              <td>{customer.customer_name}</td>
            </tr>
            <tr>
              <td>이메일</td>
              <td>{customer.customer_email || detailedInfo?.customer_email}</td>
            </tr>
            <tr>
              <td>가입 일자</td>
              <td>{new Date(customer.created_at).toLocaleDateString()}</td>
            </tr>
            {/* 추가 정보를 표시하는 부분 */}
            {detailedInfo && (
              <>
                <tr>
                  <td>전화번호</td>
                  <td>{detailedInfo.customer_phone}</td>
                </tr>
                <tr>
                  <td>거주지</td>
                  <td>{detailedInfo.customer_city}</td>
                </tr>
                <tr>
                  <td>생년월일</td>
                  <td>{detailedInfo.customer_birth}</td>
                </tr>
                <tr>
                  <td>성별</td>
                  <td>{detailedInfo.customer_gender}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
        <button onClick={onClose} className="membership-close-button">
          <MdOutlineClose />
        </button>
      </div>
    </div>
  );
};

export default Membership;
