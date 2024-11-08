import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./notification.css";

const Notification = () => {
  const [notices, setNotices] = useState([]);
  const [noticeDetail, setNoticeDetail] = useState(null);
  const [loading, setLoading] = useState(true);
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
        const response = await fetch("http://222.112.27.120:8001/check_notice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log("Fetched notices:", data.notices);
        setNotices(data.notices || []);
      } catch (error) {
        console.error("Error fetching notices:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!notice_no) {
      fetchNotices();
    }
  }, [notice_no]);

  useEffect(() => {
    const fetchNoticeDetail = async () => {
      try {
        const response = await fetch(
          `http://222.112.27.120:8001/check_notice/${notice_no}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setNoticeDetail(data.notice);
      } catch (error) {
        console.error("Error fetching notice detail:", error);
      }
    };

    if (notice_no) {
      fetchNoticeDetail();
    }
  }, [notice_no]);

  const handleNoticeClick = (notice_no) => {
    navigate(`/notification/${notice_no}`); // `notice_no`가 올바르게 전달되는지 확인
  };

  const handleBackToList = () => {
    setNoticeDetail(null);
    navigate("/notification");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="notification-container">
      <h2 className="notification-title">공지사항</h2>
      {notice_no && noticeDetail ? (
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
        <div className="notice-list">
          {notices.length > 0 ? (
            notices.map((notice, index) => (
              <div
                key={index}
                className="notice-card"
                onClick={() => handleNoticeClick(notice.notice_no)} // notice_no를 전달
              >
                <h3>{notice.notice_title}</h3>
                <p className="notice-date">{formatDate(notice.created_at)}</p>
              </div>
            ))
          ) : (
            <p>공지사항이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
