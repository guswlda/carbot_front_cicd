import React, { useEffect, useState } from "react";
import NoticeForm from "./NoticeForm";
import NoticeDetail from "./NoticeDetail";
import "./NoticeManagement.css";
import axios from "axios";

const NoticeManagement = () => {
  const [notices, setNotices] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const admin_id = localStorage.getItem("admin_id");

  // 컴포넌트가 처음 로드될 때 공지사항을 가져옴
  useEffect(() => {
    fetchNotices(); // 공지사항 데이터 불러오기
  }, []);

  // 공지사항 데이터를 백엔드에서 가져오는 함수
  const fetchNotices = async () => {
    try {
      const response = await axios.get("http://222.112.27.120:8001/notices");
      setNotices(response.data); // 응답 데이터로 상태 업데이트
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  // 공지사항 추가 후 리스트 업데이트
  const handleFormSubmit = async (newNotice) => {
    try {
      await axios.post(
        `http://222.112.27.120:8001/add_notice/${admin_id}`,
        newNotice
      );
      fetchNotices(); // 공지사항 추가 후 최신 데이터 다시 가져오기
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error adding notice:", error);
    }
  };

  // 공지사항 삭제 후 리스트 업데이트
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://222.112.27.120:8001/notices/${id}`);
      fetchNotices(); // 삭제 후 공지사항 데이터 다시 가져오기
      setSelectedNotice(null);
    } catch (error) {
      console.error("Error deleting notice:", error);
    }
  };

  const handleFormOpen = () => {
    setSelectedNotice(null); // 공지사항 작성 모드로 설정
    setIsFormOpen(true);
  };

  const handleFormClose = () => setIsFormOpen(false);

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice); // 공지사항 조회+수정+삭제 모드로 설정
  };

  const handleUpdate = (updatedNotice) => {
    setNotices(
      notices.map((notice) =>
        notice.id === updatedNotice.id ? updatedNotice : notice
      )
    );
    setSelectedNotice(null);
  };

  return (
    <div className="notice-management-container">
      <h2 className="notice-management-title">공지사항 관리</h2>
      <table className="notice-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>분류</th>
            <th>담당자</th>
            <th>작성 날짜</th>
          </tr>
        </thead>
        <tbody>
          {notices.map((notice, index) => (
            <tr key={notice.id}>
              <td>{index + 1}</td>
              <td>
                <button
                  className="notice-title-button"
                  onClick={() => handleNoticeClick(notice)}
                >
                  {notice.title}
                </button>
              </td>
              <td>{notice.category}</td>
              <td>{notice.author}</td>
              <td>{notice.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleFormOpen} className="notice-register-button">
        등록
      </button>

      {/* 공지사항 작성 모달 */}
      {isFormOpen && (
        <NoticeForm
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          admin_id={admin_id}
        />
      )}

      {/* 공지사항 상세 조회/수정/삭제 모달 */}
      {selectedNotice && (
        <NoticeDetail
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default NoticeManagement;
