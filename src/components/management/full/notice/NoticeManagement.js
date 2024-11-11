import React, { useEffect, useState } from "react";
import NoticeForm from "./NoticeForm";
import NoticeDetail from "./NoticeDetail";
import "./NoticeManagement.css";
import axios from "axios";

const NoticeManagement = () => {
  const [notices, setNotices] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 공지사항 조회
  const fetchNotices = async () => {
    setIsLoading(true);
    setError(""); // 에러 상태 초기화
    try {
      const response = await axios.get(
        "http://222.112.27.120:8001/admin_notices"
      );
      setNotices(response.data.notices);
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
  const handleFormSubmit = () => {
    fetchNotices(); // 공지사항 등록 후 목록 갱신
    setIsFormOpen(false); // 등록 모달 닫기
  };

  // 공지사항 삭제
  const handleDelete = async (notice_no) => {
    const adminId = sessionStorage.getItem("userId");
    const userType = sessionStorage.getItem("userType")?.trim();

    if (!adminId || userType !== "admin") {
      setError("관리자 권한이 없습니다.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.patch(
        `http://222.112.27.120:8001/del_notice/${adminId}/${notice_no}`
      );
      fetchNotices();
      setSelectedNotice(null); // 상세 보기 닫기
    } catch (error) {
      console.error("Error deleting notice:", error);
      setError("공지사항 삭제 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 공지사항 수정
  const handleUpdate = async (updatedNotice) => {
    const adminId = sessionStorage.getItem("userId");
    const userType = sessionStorage.getItem("userType")?.trim();

    if (!adminId || userType !== "admin") {
      setError("관리자 권한이 없습니다.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.patch(
        `http://222.112.27.120:8001/re_notice/${adminId}/${updatedNotice.notice_no}`,
        updatedNotice
      );
      fetchNotices();
      setSelectedNotice(null); // 상세 보기 닫기
    } catch (error) {
      console.error("Error updating notice:", error);
      setError("공지사항 수정 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormOpen = () => {
    setSelectedNotice(null); // 작성 모드로 설정
    setIsFormOpen(true);
  };

  const handleFormClose = () => setIsFormOpen(false);

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice); // 상세 보기/수정 모드로 설정
    setIsFormOpen(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = notices.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(notices.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="notice-management-container">
      <h2 className="notice-management-title">공지사항 관리</h2>
      <div className="notice-management-header">
        <button onClick={handleFormOpen} className="notice-register-button">
          등록
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}{" "}
      {isLoading ? (
        <p>공지사항을 처리 중입니다...</p>
      ) : (
        <>
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
              {currentItems.map((notice, index) => (
                <tr key={notice.notice_no}>
                  <td>{indexOfFirstItem + index + 1}</td>
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
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-button ${
                  page === currentPage ? "active" : ""
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}
      {isFormOpen && (
        <NoticeForm onClose={handleFormClose} onSubmit={handleFormSubmit} />
      )}
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
