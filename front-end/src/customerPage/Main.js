import axios from 'axios';
import { useState, useEffect } from 'react';
import styles from './Main.module.css';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Main() {

  // ----------------------------------------------------------------------
  // 카테고리 이동 관련

  const navigate = useNavigate();

  const handleCategoryClick = (type) => {
    navigate(`/store-list/${type}`); // type에 따라 페이지 이동
  };

  // ----------------------------------------------------------------------
  // 비디오 재생 관련

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const videoSources = [
    "/videos/walk.mp4",
    "/videos/paprika.mp4",
    "/videos/dogfood.mp4"
  ];

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoSources.length);
  };

  // ----------------------------------------------------------------------
  // 상품 목록 애니메이션 관련

  const [productList, setProductList] = useState([]);

  useEffect(() => {
    axios.get('/api/product-list')
      .then((response) => {
        setProductList(response.data);
      })
      .catch(() => {
        console.error('Error fetching product list'); //
      });
  }, []);


  // ----------------------------------------------------------------------
  // 상품 애니메이션 효과 관련

  const productListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % productList.length);
    }, 3000); // 3초마다 슬라이드 변경

    return () => clearInterval(interval);
  }, [productList.length]);

  useEffect(() => {
    if (productListRef.current) {
      productListRef.current.style.transform = `translateX(-${currentIndex * (100 / 3)
        }%)`;
    }
  }, [currentIndex]);


  return (
    <div className={styles.container}>

      {/* 영상 */}
      <div className={styles.video_container}>
        <video
          key={videoSources[currentVideoIndex]}
          muted
          autoPlay
          loop
          className={styles.video}
        >
          <source src={videoSources[currentVideoIndex]} type="video/mp4" />
        </video>
        <button onClick={handleNextVideo} className={styles.nextButton}>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

      <div className={styles.box} />

      {/* 카테고리 */}
      <div className={styles.category_container}>
        <button onClick={() => handleCategoryClick(0)} className={styles.category}>사료</button>
        <button onClick={() => handleCategoryClick(1)} className={styles.category}>간식</button>
        <button onClick={() => handleCategoryClick(2)} className={styles.category}>영양제</button>
        <button onClick={() => handleCategoryClick(3)} className={styles.category}>장난감</button>
        <button onClick={() => handleCategoryClick(4)} className={styles.category}>도구</button>
        <button onClick={() => handleCategoryClick(5)} className={styles.category}>훈련사</button>
        <button onClick={() => handleCategoryClick(6)} className={styles.category}>산책대행</button>
        <button onClick={() => handleCategoryClick(7)} className={styles.category}>픽업서비스</button>
        <button onClick={() => handleCategoryClick(8)} className={styles.category}>미용</button>
      </div>

      <div className={styles.box} />

      {/* 상품(화식) 목록 애니메이션 */}
      <div className={styles.product_container}>
        <ul ref={productListRef}>
          {
            productList.length > 0 ? (
              productList.map((product, index) => {
                return (
                  <div key={index} className={styles.product}>
                    <img src={product.img} alt={product.name} />
                    <h5>{product.name}</h5>
                    <p>{product.price}원</p>
                  </div>
                )
              })
            ) : (
              <p>로딩중입니다</p>
            )
          }
        </ul>
      </div>

    </div>
  );
}

export default Main;