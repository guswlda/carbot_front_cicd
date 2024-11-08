import React, { useState, useEffect } from 'react';
import './carSelect.css';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa'; // 북마크 아이콘 import
import Eximg from '../../images/genesis.png';

const CarSelect = () => {
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [bookmarked, setBookmarked] = useState([false, false, false]); // 각 카드의 북마크 상태

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleManufacturerChange = (event) => {
    setSelectedManufacturer(event.target.value);
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  // 북마크 아이콘 클릭 핸들러
  const handleBookmarkClick = (index) => {
    const updatedBookmarks = [...bookmarked];
    updatedBookmarks[index] = !updatedBookmarks[index];
    setBookmarked(updatedBookmarks);

    if (updatedBookmarks[index]) {
      toast.success('저장되었습니다.', { autoClose: 1000 });
    } else {
      toast.info('삭제되었습니다.', { autoClose: 1000 });
    }
  };

  return (
    <div className="carselect-page">
      <ToastContainer /> {/* ToastContainer 추가 */}
      <div className="carselect-container">
        <h2>나에게 맞는 차량을 검색해 보세요!</h2>

        {/* Search Section */}
        <div className="carselect-search-container">
          <select
            onChange={handleManufacturerChange}
            className="carselect-dropdown"
          >
            <option value="">제조사</option>
            <option value="manufacturer1">제조사1</option>
            <option value="manufacturer2">제조사2</option>
          </select>

          <select onChange={handleModelChange} className="carselect-dropdown">
            <option value="">차종</option>
            <option value="model1">차종1</option>
            <option value="model2">차종2</option>
          </select>

          <button className="carselect-search-button">조회</button>
        </div>

        {/* Car List Section */}
        <div className="select-car-list">
          {[Eximg, Eximg, Eximg].map((image, index) => (
            <div key={index} className="select-card">
              <img src={image} alt={`차량 모델 ${index + 1}`} />
              <div className="select-info">
                <div className="select-model-info">
                  <p>모델명: 차량 모델 {index + 1}</p>
                  {/* 북마크 아이콘 */}
                  <span
                    onClick={() => handleBookmarkClick(index)}
                    className="carselect-bookmark-icon"
                  >
                    {bookmarked[index] ? <FaBookmark /> : <FaRegBookmark />}
                  </span>
                </div>
                <Link to="/carInfo" className="carselect-main-links">
                  <button className="carselect-details-button">
                    자세히 보기
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarSelect;
