import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./notification.css";

const Notification = () => {
  const [notices, setNotices] = useState([]);
  const [noticeDetail, setNoticeDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 9;
  const { notice_no } = useParams();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch(
          "http://222.112.27.120:8001/get_user_notices",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setNotices(data.notices || []);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching notices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const handleNoticeClick = (notice_no) => {
    const selectedNotice = notices.find(
      (notice) => notice.notice_no === notice_no
    );
    setNoticeDetail(selectedNotice);
  };

  const handleBackToList = () => {
    setNoticeDetail(null);
    navigate("/notification");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 페이지네이션을 위한 데이터 계산
  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = notices.slice(indexOfFirstNotice, indexOfLastNotice);
  const totalPages = Math.ceil(notices.length / noticesPerPage);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="notification-container">
      <h2 className="notification-title">공지사항</h2>
      {noticeDetail ? (
        <div className="notice-detail">
          <h3>{noticeDetail.notice_title}</h3>
          <p className="notice-date">{formatDate(noticeDetail.created_at)}</p>
          <div className="notice-content">
            <p>{noticeDetail.notice_content}</p>
          </div>
          <button className="back-button" onClick={handleBackToList}>
            목록
          </button>
        </div>
      ) : (
        <div>
          <div className="notice-list">
            {currentNotices.length > 0 ? (
              currentNotices.map((notice) => (
                <div
                  key={notice.notice_no}
                  className="notice-card"
                  onClick={() => handleNoticeClick(notice.notice_no)}
                >
                  <h3>{notice.notice_title}</h3>
                  <p className="notice-date">{formatDate(notice.created_at)}</p>
                </div>
              ))
            ) : (
              <p>공지사항이 없습니다.</p>
            )}
          </div>
          {/* 페이지네이션 */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`page-button ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
