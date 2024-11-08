import React, { useState } from "react";
import "./join.css";
import { Link, useNavigate } from "react-router-dom";
import TermsUse from "./AuthModal/TermsUse";
import axios from "axios";

const Join = () => {
  const [formData, setFormData] = useState({
    email: "",
    id: "",
    phone: "",
    name: "",
    password: "",
    confirmPassword: "",
    birthYear: "",
    city: "",
    gender: "",
    carOwnership: "",
    termsAgree: false,
    privacyAgree: false,
    thirdPartyAgree: false,
    ageConfirm: false,
  });
  const [errors, setErrors] = useState({});
  const [verificationMessage, setVerificationMessage] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const handleGenderChange = (value) => {
    setFormData({ ...formData, gender: value });
    setErrors({ ...errors, gender: "" });
  };

  const handleCarOwnershipChange = (value) => {
    setFormData({ ...formData, carOwnership: value });
    setErrors({ ...errors, carOwnership: "" });
  };

  const handleOpenTermsModal = (content) => {
    setShowTermsModal(content);
  };

  const handleCloseTermsModal = () => {
    setShowTermsModal(null);
  };

  const navigate = useNavigate();

  const signupcomplete = () => {
    axios
      .post("http://222.112.27.120:8001/sign_up", {
        customer_id: formData.id,
        customer_pw: formData.password,
        customer_email: formData.email,
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_gender: formData.gender,
        customer_birth: formData.birthYear,
        customer_city: formData.city,
      })
      .then((response) => {
        alert("회원가입이 완료되었습니다.");
        navigate("/login");
      })
      .catch((error) => {
        alert(error.response?.data?.message || "회원가입에 실패했습니다.");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // 필수 항목 검증
    if (!formData.email) newErrors.email = "이메일을 입력해 주세요.";
    if (!formData.id) newErrors.id = "아이디를 입력해 주세요.";
    if (!formData.phone) newErrors.phone = "전화번호를 입력해 주세요.";
    if (!formData.name) newErrors.name = "이름을 입력해 주세요.";
    if (!formData.password) newErrors.password = "비밀번호를 입력해 주세요.";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호를 다시 확인해 주세요.";
    }
    if (!formData.birthYear) newErrors.birthYear = "생년월일을 선택해 주세요.";
    if (!formData.city) newErrors.city = "지역을 선택해 주세요.";
    if (!formData.gender) newErrors.gender = "성별을 선택해 주세요.";
    if (!formData.termsAgree)
      newErrors.termsAgree = "이용약관에 동의해 주세요.";
    if (!formData.privacyAgree)
      newErrors.privacyAgree = "개인정보 수집 및 이용에 동의해 주세요.";
    if (!formData.thirdPartyAgree)
      newErrors.thirdPartyAgree = "개인정보 제3자 제공에 동의해 주세요.";
    if (!formData.ageConfirm)
      newErrors.ageConfirm = "만 18세 이상임을 확인해 주세요.";

    setErrors(newErrors);

    // 모든 필수 항목이 채워진 경우에만 회원가입 완료 함수 호출
    if (Object.keys(newErrors).length === 0) {
      signupcomplete();
    } else {
      console.log(
        "Form submission blocked due to validation errors:",
        newErrors
      );
    }
  };

  return (
    <div className="join-container">
      <div className="join-box">
        <h1>회원가입</h1>
        <form className="join-form" onSubmit={handleSubmit}>
          <div className="input-fields-box">
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="이메일 입력"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error" : ""}
              />
            </div>
            {verificationMessage && (
              <p className="verification-message">{verificationMessage}</p>
            )}
            {errors.email && (
              <p className="join-error-message">{errors.email}</p>
            )}

            <div className="input-group">
              <input
                type="text"
                name="id"
                placeholder="아이디 입력"
                value={formData.id}
                onChange={handleChange}
                className={errors.id ? "error" : ""}
              />
            </div>
            {errors.id && <p className="join-error-message">{errors.id}</p>}

            <input
              type="text"
              name="phone"
              placeholder="전화번호 입력"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? "error" : ""}
            />
            {errors.phone && (
              <p className="join-error-message">{errors.phone}</p>
            )}

            <input
              type="text"
              name="name"
              placeholder="이름 입력"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
            />
            {errors.name && <p className="join-error-message">{errors.name}</p>}

            <input
              type="password"
              name="password"
              placeholder="비밀번호 입력"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
            />
            {errors.password && (
              <p className="join-error-message">{errors.password}</p>
            )}

            <input
              type="password"
              name="confirmPassword"
              placeholder="비밀번호 확인"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "error" : ""}
            />
            {errors.confirmPassword && (
              <p className="join-error-message">{errors.confirmPassword}</p>
            )}
          </div>

          {/* 성별 체크박스 */}
          <div className="checkbox-group">
            {errors.gender && (
              <p className="join-error-message">{errors.gender}</p>
            )}
            <label>성별:</label>

            <label>
              <input
                type="radio"
                name="gender"
                value="남자"
                checked={formData.gender === "남자"}
                onChange={() => handleGenderChange("남자")}
              />{" "}
              남자
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="여자"
                checked={formData.gender === "여자"}
                onChange={() => handleGenderChange("여자")}
              />{" "}
              여자
            </label>
          </div>

          {/* 생년월일 선택 추가 */}

          <div className="join-select-box">
            <div className="birthYear-box">
              <label>생년월일:</label>
              <select
                name="birthYear"
                value={formData.birthYear}
                onChange={handleChange}
                className={errors.birthYear ? "error" : ""}
              >
                <option value="">연도 선택</option>
                {[...Array(45)].map((_, i) => {
                  const year = 1960 + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
                {errors.birthYear && (
                  <p className="join-error-message">{errors.birthYear}</p>
                )}
              </select>
            </div>

            {/* 지역 선택 추가 */}
            <div className="residence-box">
              <label>지역:</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={errors.city ? "error" : ""}
              >
                <option value="">지역 선택</option>
                {[
                  "서울특별시",
                  "부산광역시",
                  "대구광역시",
                  "인천광역시",
                  "광주광역시",
                  "대전광역시",
                  "울산광역시",
                  "세종특별자치시",
                  "경기도",
                  "강원도",
                  "충청북도",
                  "충청남도",
                  "전라북도",
                  "전라남도",
                  "경상북도",
                  "경상남도",
                  "제주특별자치도",
                ].map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              {errors.city && (
                <p className="join-error-message">{errors.residence}</p>
              )}
            </div>
          </div>
          <div className="terms-box">
            <label>
              <input
                type="checkbox"
                name="termsAgree"
                checked={formData.termsAgree}
                onChange={handleChange}
              />
              <span onClick={() => handleOpenTermsModal("terms")}>
                이용약관에 동의합니다.
              </span>
              {errors.termsAgree && (
                <p className="join-error-message">{errors.termsAgree}</p>
              )}
            </label>

            <label>
              <input
                type="checkbox"
                name="privacyAgree"
                checked={formData.privacyAgree}
                onChange={handleChange}
              />
              <span onClick={() => handleOpenTermsModal("privacy")}>
                개인정보 수집, 이용 동의에 동의합니다.
              </span>
              {errors.privacyAgree && (
                <p className="join-error-message">{errors.privacyAgree}</p>
              )}
            </label>

            <label>
              <input
                type="checkbox"
                name="thirdPartyAgree"
                checked={formData.thirdPartyAgree}
                onChange={handleChange}
              />
              <span onClick={() => handleOpenTermsModal("thirdParty")}>
                개인정보 제3자 제공 동의에 동의합니다.
              </span>
              {errors.thirdPartyAgree && (
                <p className="join-error-message">{errors.thirdPartyAgree}</p>
              )}
            </label>
            <label>
              <input
                type="checkbox"
                name="ageConfirm"
                checked={formData.ageConfirm}
                onChange={handleChange}
              />
              저는 만 18세 이상입니다.
              {errors.ageConfirm && (
                <p className="join-error-message">{errors.ageConfirm}</p>
              )}
            </label>
          </div>
          <button type="submit" className="submit-button">
            회원가입
          </button>

          <div className="footer-links">
            <Link to="/login">이미 회원이신가요? 로그인</Link>
          </div>
        </form>
      </div>

      {/* 이용약관 모달 */}
      {showTermsModal && (
        <TermsUse
          selectedContent={showTermsModal}
          onClose={handleCloseTermsModal}
        />
      )}
    </div>
  );
};

export default Join;
