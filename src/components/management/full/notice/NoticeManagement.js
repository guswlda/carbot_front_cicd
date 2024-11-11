import React, { useEffect, useState } from "react";
import NoticeForm from "./NoticeForm";
import NoticeDetail from "./NoticeDetail";
import "./NoticeManagement.css";
import axios from "axios";

const NoticeManagement = () => {
  const [notices, setNotices] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [error, setError] = useState(""); // 에러 상태 추가
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  // 공지사항 조회
  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://222.112.27.120:8001/admin_notices"
      );
      setNotices(response.data.notices); // 응답 데이터로 상태 업데이트
    } catch (error) {
      console.error("Error fetching notices:", error);
      setError("공지사항을 불러오는 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트가 마운트될 때 공지사항 가져오기
  useEffect(() => {
    fetchNotices();
  }, []);

  // 공지사항 등록
  const handleFormSubmit = async (newNotice) => {
    try {
      await axios.post("http://222.112.27.120:8001/add_notice", {
        admin_id: localStorage.getItem("userId"), // admin_id를 localStorage에서 가져옴
        ...newNotice,
      });
      fetchNotices(); // 공지사항 등록 후 목록 갱신
      setIsFormOpen(false); // 등록 모달 닫기
    } catch (error) {
      console.error("Error adding notice:", error);
      setError("공지사항 등록 중 문제가 발생했습니다.");
    }
  };

  // 공지사항 삭제
  const handleDelete = async (notice_no) => {
    try {
      await axios.patch(
        `http://222.112.27.120:8001/del_notice/${localStorage.getItem(
          "userId"
        )}/${notice_no}`
      );
      fetchNotices(); // 공지사항 삭제 후 목록 갱신
      setSelectedNotice(null); // 상세 보기 닫기
    } catch (error) {
      console.error("Error deleting notice:", error);
      setError("공지사항 삭제 중 문제가 발생했습니다.");
    }
  };

  // 공지사항 수정
  const handleUpdate = async (updatedNotice) => {
    try {
      await axios.patch(
        `http://222.112.27.120:8001/re_notice/${localStorage.getItem(
          "userId"
        )}/${updatedNotice.notice_no}`,
        {
          ...updatedNotice,
        }
      );
      fetchNotices(); // 공지사항 수정 후 목록 갱신
      setSelectedNotice(null); // 상세 보기 닫기
    } catch (error) {
      console.error("Error updating notice:", error);
      setError("공지사항 수정 중 문제가 발생했습니다.");
    }
  };

  const handleFormOpen = () => {
    setSelectedNotice(null); // 작성 모드로 설정
    setIsFormOpen(true);
  };

  const handleFormClose = () => setIsFormOpen(false);

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice); // 상세 보기/수정 모드로 설정
  };

  return (
    <div className="notice-management-container">
      <h2 className="notice-management-title">공지사항 관리</h2>
      {error && <p className="error-message">{error}</p>}{" "}
      {/* 에러 메시지 표시 */}
      {isLoading ? (
        <p>공지사항을 불러오는 중입니다...</p>
      ) : (
        <table className="notice-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성 날짜</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice, index) => (
              <tr key={notice.notice_no}>
                <td>{index + 1}</td>
                <td>
                  <button
                    className="notice-title-button"
                    onClick={() => handleNoticeClick(notice)}
                  >
                    {notice.notice_title}
                  </button>
                </td>
                <td>{notice.admin_name}</td>
                <td>{new Date(notice.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={handleFormOpen} className="notice-register-button">
        등록
      </button>
      {/* 공지사항 등록 모달 */}
      {isFormOpen && (
        <NoticeForm onClose={handleFormClose} onSubmit={handleFormSubmit} />
      )}
      {/* 공지사항 상세 보기/수정 모달 */}
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
