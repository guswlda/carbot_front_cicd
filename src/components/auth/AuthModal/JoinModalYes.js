import React, { useState } from 'react';
import './JoinModalYes.css';
import { MdOutlineClose } from 'react-icons/md';

const Modal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    manufacturer: '',
    type: '',
    model: '',
    year: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const handleSubmit = () => {
    const newErrors = {};

    if (!formData.manufacturer)
      newErrors.manufacturer = '제조사를 선택해 주세요.';
    if (!formData.type) newErrors.type = '차량 유형을 선택해 주세요.';
    if (!formData.model) newErrors.model = '모델명을 입력해 주세요.';
    if (!formData.year) newErrors.year = '연식을 입력해 주세요.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('저장되었습니다!');
      onClose();
    }
  };

  return (
    <div className='join-modal-overlay'>
      <div className='join-modal-content'>
        <div>
          <div className='join-modal-text'>
            <p>소중한 정보를 입력해주셔서 감사합니다.</p>
            <p>
              맞춤형 차량 추천 서비스를 통해 회원님께 최적의 차량을
              찾아드리겠습니다!
            </p>
          </div>
          <div className='join-modal-select'>
            <label>보유 차량 제조사 선택</label>
            <select
              name='manufacturer'
              value={formData.manufacturer}
              onChange={handleChange}
              className={errors.manufacturer ? 'error' : ''}
            >
              <option value=''>* 제조사 선택</option>
              <option value='현대'>현대</option>
              <option value='기아'>기아</option>
              <option value='BMW'>BMW</option>
              <option value='벤츠'>벤츠</option>
              <option value='아우디'>아우디</option>
            </select>
            {errors.manufacturer && (
              <p className='join-modal-error-message'>{errors.manufacturer}</p>
            )}

            <div>
              <label>보유 차량 유형 입력</label>
              <select
                name='type'
                value={formData.type}
                onChange={handleChange}
                className={errors.type ? 'error' : ''}
              >
                <option value=''>* 차량 유형 선택</option>
                <option value='SUV'>SUV</option>
                <option value='세단'>세단</option>
                <option value='트럭'>트럭</option>
              </select>
              {errors.type && (
                <p className='join-modal-error-message'>{errors.type}</p>
              )}
            </div>
          </div>
          <div className='join-modal-input'>
            <label>보유 차량 모델명 입력</label>
            <input
              type='text'
              name='model'
              value={formData.model}
              onChange={handleChange}
              placeholder='차량 모델명 입력'
              className={errors.model ? 'error' : ''}
            />
            {errors.model && (
              <p className='join-modal-error-message'>{errors.model}</p>
            )}

            <label>보유 차량 연식 입력</label>
            <input
              type='text'
              name='year'
              value={formData.year}
              onChange={handleChange}
              placeholder='ex)2024형'
              className={errors.year ? 'error' : ''}
            />
            {errors.year && (
              <p className='join-modal-error-message'>{errors.year}</p>
            )}
          </div>
          <div className='join-modal-button'>
            <button className='join-submit-button' onClick={handleSubmit}>
              확인
            </button>
          </div>
        </div>
        <button className='join-modal-close-button' onClick={onClose}>
          <MdOutlineClose />
        </button>
      </div>
    </div>
  );
};

export default Modal;
