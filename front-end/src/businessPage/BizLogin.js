import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import styles from './BizLogin.module.css';

function BizLogin() {
    const nav = useNavigate();
    const [MemberId, setMemberId] = useState('');
    const [MemberPw, setMemberPw] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const login = () => {
        let newErrors = {};
        if (!MemberId) newErrors.MemberId = '*아이디를 입력해주세요.';
        if (!MemberPw) newErrors.MemberPw = '*비밀번호를 입력해주세요.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // LoginFilter 방식: form-urlencoded로 전송, Header에서 토큰 추출
        const formData = new URLSearchParams();
        formData.append('id', MemberId);
        formData.append('pw', MemberPw);

        axios
            .post('/api/business/login', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .then((response) => {
                // LoginFilter는 Header에 Authorization 반환
                const authHeader = response.headers['authorization'];
                if (authHeader && authHeader.startsWith('Bearer ')) {
                    const token = authHeader.substring(7);
                    Cookies.set('token', token, { expires: 7 });
                    Cookies.set('MemberId', MemberId, { expires: 7 });
                    alert('로그인 성공');
                    nav('/business');
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                } else {
                    setMessage('로그인 응답에서 토큰을 찾을 수 없습니다.');
                }
            })
            .catch((error) => {
                console.log('로그인 실패', error);
                if (error.response && error.response.status === 401) {
                    setMessage('아이디 또는 비밀번호가 올바르지 않습니다.');
                } else {
                    alert('로그인 실패');
                }
            });
    };

    return (
        <div className={styles.login_form}>
            <h1>사업자 로그인</h1>

            <label>아이디</label>
            <input type="text" value={MemberId} onChange={(e) => setMemberId(e.target.value)}
                placeholder='아이디를 입력해주세요.' /><br />
            {errors.MemberId && <div className={styles.error}>{errors.MemberId}</div>}
            {message && <div className={styles.error}>{message}</div>}

            <label>비밀번호</label>
            <input type="password" value={MemberPw} onChange={(e) => setMemberPw(e.target.value)}
                placeholder='비밀번호를 입력해주세요.' /><br />
            {errors.MemberPw && <div className={styles.error}>{errors.MemberPw}</div>}

            <button onClick={login}>로그인하기</button>
        </div>
    );
};
export default BizLogin;