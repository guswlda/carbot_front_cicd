import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ConsultationManagement.css';

const ConsultationManagement = () => {
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  useEffect(() => {
    // 백엔드의 consultUsers API 호출
    axios
      .get('http://localhost:8001/api/admin/consultUsers')
      .then((response) => {
        setConsultations(response.data.users);
      })
      .catch((error) => {
        console.error('Error fetching consultations data:', error);
      });
  }, []);

  const handleConsultationClick = async (consultationId) => {
    try {
      const response = await axios.get(
        `http://localhost:8001/api/admin/consultUsers/${consultationId}`
      );
      setSelectedConsultation(response.data.consultation);
    } catch (error) {
      console.error('Error fetching consultation details:', error);
    }
  };

  const handleCloseModal = () => {
    setSelectedConsultation(null);
  };

  return (
    <div className='consultation-management-container'>
      <h2 className='consultation-management-title'>상담관리</h2>
      <table className='consultation-table'>
        <thead>
          <tr>
            <th>번호</th>
            <th>접수된 상담</th>
            <th>담당자</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {consultations.map((consultation, index) => (
            <tr key={consultation.custom_consult_no}>
              <td>{index + 1}</td>
              <td>
                <button
                  className='consultation-customer-name'
                  onClick={() =>
                    handleConsultationClick(consultation.custom_consult_no)
                  }
                >
                  {consultation.customer_name}
                </button>
              </td>
              <td>{consultation.dealer_name}</td>
              <td>{new Date(consultation.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConsultationManagement;
