import React, { useState, useEffect, useRef } from "react";
import "./main.css";
import { toast, ToastContainer } from "react-toastify";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import Video4 from "../../video/blackcar.mp4";
import Video3 from "../../video/dealer.mp4";
import Video1 from "../../video/graycar.mp4";
import Video2 from "../../video/redcar.mp4";
import Grandeur from "../../images/grandeur.png";
import Avante from "../../images/avante.png";
import Palisade from "../../images/palisade.png";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

const videos = [Video1, Video2, Video3, Video4];

const carData = [
  {
    image: Grandeur,
    modelName: "Grandeur",
    link: "/MainCarInfo/Grandeur",
  },
  {
    image: Avante,
    modelName: "Avante Hybrid",
    link: "/MainCarInfo/Avante",
  },
  {
    image: Palisade,
    modelName: "Palisade",
    link: "/MainCarInfo/Palisade",
  },
];

const Main = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); // 재생 상태 관리
  const videoRefs = useRef([]); // 각 비디오 요소를 참조할 배열

  // IntersectionObserver 설정
  useEffect(() => {
    const observerOptions = {
      threshold: 0.5, // 50% 이상 보일 때 재생
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;

        if (entry.isIntersecting) {
          // 비디오가 화면에 보이고 재생 중이 아닌 경우만 play() 호출
          if (!isPlaying) {
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch((error) => console.log("비디오 재생 오류:", error));
          }
        } else {
          // 비디오가 화면 밖으로 나가고 재생 중인 경우만 pause() 호출
          if (isPlaying) {
            video.pause();
            setIsPlaying(false);
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, []);

  // 현재 슬라이드 변경 시 비디오 자동 재생 설정
  useEffect(() => {
    if (videoRefs.current[currentSlide]) {
      videoRefs.current[currentSlide].play();
    }
  }, [currentSlide]);

  // 비디오가 끝났을 때 다음 슬라이드로 이동 (마지막 비디오가 끝나면 첫 번째 비디오로 되돌아감)
  const handleVideoEnded = () => {
    setIsPlaying(false); // 비디오가 끝나면 재생 상태를 false로 설정
    setCurrentSlide((prevSlide) => (prevSlide + 1) % videos.length);
  };

  // 다음 슬라이드로 이동
  const handleNext = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % videos.length);
  };

  // 이전 슬라이드로 이동
  const handlePrev = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + videos.length) % videos.length
    );
  };

  // 특정 슬라이드로 이동
  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="main-container">
      <ToastContainer />
      {/* video slider section */}
      <section className="video-section">
        <div className="main-video-slider">
          {videos.map((video, index) => (
            <video
              key={index}
              ref={(el) => (videoRefs.current[index] = el)} // 비디오 요소 참조 저장
              className={`background-video ${
                index === currentSlide ? "active" : ""
              }`}
              autoPlay
              loop={false}
              muted
              playsInline
              onEnded={handleVideoEnded} // 비디오가 끝나면 다음 슬라이드로 이동
              style={{ display: index === currentSlide ? "block" : "none" }}
            >
              <source src={video} type="video/mp4" />
            </video>
          ))}
          <button className="prev-button" onClick={handlePrev}>
            <IoIosArrowBack />
          </button>
          <button className="next-button" onClick={handleNext}>
            <IoIosArrowForward />
          </button>
        </div>

        {/* Dot navigation */}
        <div className="dot-navigation">
          {videos.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </section>

      {/* best-car section */}
      <section className="best-car">
        <p className="bestcar-text">BEST CAR</p>
        <div className="main-car-container">
          {carData.map((car, index) => (
            <div key={index} className="main-card">
              <img src={car.image} alt={`차량 이미지 ${index + 1}`} />
              <div className="main-info">
                <div className="main-model-info">
                  <p>{car.modelName}</p>
                  <p>{car.description}</p>
                </div>
                <Link to={car.link} className="main-links">
                  <button className="main-info-button">자세히 보기</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* car-select section */}
      {/* <div className="main-select-button">
        <Link to="/CarSelect" className="main-links">
          <button>차량 조회</button>
        </Link>
      </div> */}
    </div>
  );
};

export default Main;
