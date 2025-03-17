import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './BizNumAuth.module.css';

function BizNumAuth() {
    const navigate = useNavigate();
    const [businessNumber, setBusinessNumber] = useState('');
    const [message, setMessage] = useState('');

    const verifyBusinessNumber = () => {
      axios.post(`http://localhost:8085/api/business/verify`, {
        b_no: [businessNumber]
    })
    .then((response) => {
        if (response.data.valid) {
            // navigate('/');
        } else {
            setMessage('유효하지 않은 사업자등록번호입니다.');
        }
    })
    .catch((error) => {
        console.log('사업자등록번호 조회 실패', error);
        setMessage('사업자등록번호 조회 실패');
    });
};

  return (
    <div className={styles.container}>
        <h1>사업자번호 인증</h1>
        <input
            type="text"
            value={businessNumber}
            onChange={(e) => setBusinessNumber(e.target.value)}
            placeholder="사업자등록번호를 입력해주세요."
        /><br/>
        <button onClick={verifyBusinessNumber}>사업자 인증</button>
        {message && <div className={styles.error}>{message}</div>}
    </div>
);
}

export default BizNumAuth;
