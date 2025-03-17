import React from 'react';
import styles from './Footer.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faFacebookSquare, faInstagramSquare, faTwitterSquare } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';

function Footer(props) {

  let navigate = useNavigate();

  return (
    
      <div className={styles.container}>
        <div className={styles.section}>
          <h4 className={styles.heading}>회사 정보</h4>
          <p>회사 소개</p>
          <p className={styles.text}>채용 정보</p>
          <p className={styles.text}>개인정보 처리방침</p>
        </div>

        <div className={styles.section}>
          <h4 className={styles.heading}>고객 지원</h4>
          <p className={styles.text}>FAQ</p>
          <p className={styles.text}>문의하기</p>
        </div>

        <div className={styles.section}>
          <h4 className={styles.heading}>소셜 미디어</h4>
          <div className={styles.socialIcons}>
            <p target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebookSquare} />
            </p>
            <p target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTwitterSquare} />
            </p>
            <p target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagramSquare} />
            </p>
          </div>
        </div>
        <div className={styles.link_container}>
          <p onClick={ () => {
                navigate('/business');
                props.setMode('business');
              }}>펫과함께 비즈니스</p>
          
          <p onClick={ () => {
              navigate('/');
              props.setMode('customer');
          }}>펫과함께</p>
        </div>
      </div>
    
  )
}

export default Footer;
