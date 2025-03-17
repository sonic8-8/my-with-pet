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

        axios
            .post('http://localhost:8085/api/business/login', {
                id: MemberId,
                pw: MemberPw,
            })
            .then((response) => {
                console.log(response.data);
                if (response.data.message === '로그인 성공') {
                    const token = response.data.token;
                    Cookies.set('token', token, { expires: 7 }); // 쿠키에 토큰 저장 (7일 유효)
                    Cookies.set('MemberId', MemberId, { expires: 7 }); // 쿠키에 사용자 이름 저장 (7일 유효)
                    alert('로그인 성공');
                    nav('/business');
                } else {
                    setMessage(response.data.message);
                }
            })
            .catch((error) => {
                console.log('통신 실패', error);
                alert('로그인 실패');
            });
    };

    return (
        <div className={styles.login_form}>
            <h1>Member 로그인</h1>

            <label>아이디</label>
            <input type="text" value={MemberId} onChange={(e) => setMemberId(e.target.value)} 
                placeholder='아이디를 입력해주세요.' /><br/>
            {errors.MemberId && <div className={styles.error}>{errors.MemberId}</div>}
            {message && <div className={styles.error}>{message}</div>}

            <label>비밀번호</label>
            <input type="password" value={MemberPw} onChange={(e) => setMemberPw(e.target.value)}
                placeholder='비밀번호를 입력해주세요.' /><br/>
            {errors.MemberPw && <div className={styles.error}>{errors.MemberPw}</div>}

            <button onClick={login}>로그인하기</button>
        </div>
    );
};
export default BizLogin;