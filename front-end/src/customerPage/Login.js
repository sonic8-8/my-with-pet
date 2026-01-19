import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import styles from './Login.module.css';
// Plan-31: Firebase CDN ESM import를 npm 패키지로 변경 (CRA 빌드 호환)
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

function StoreLogin() {
    const firebaseConfig = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyA84xPtsglofD_O6n71ZUTUFSeA95IVbU0",
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "flowing-code-427002-h8.firebaseapp.com",
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "flowing-code-427002-h8",
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "flowing-code-427002-h8.appspot.com",
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "218939777301",
        appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:218939777301:web:77f3f41f478558eddcc91c",
        measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-CTLHYS0E6M"
    };
    const provider = new GoogleAuthProvider();
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const auth = getAuth();
    const btn1 = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                console.log(result);
            }).catch((error) => {

                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    }

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
        // Plan-31: /login → /api/login 경로 통일 (프록시 설정과 일치)
        const formData = new URLSearchParams();
        formData.append('id', MemberId);
        formData.append('pw', MemberPw);

        axios
            .post('/api/login', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .then((response) => {
                // LoginFilter는 Header에 Authorization 반환
                const authHeader = response.headers['authorization'];
                if (authHeader && authHeader.startsWith('Bearer ')) {
                    const token = authHeader.substring(7);
                    Cookies.set('token', token, {
                        expires: 7, // 쿠키에 토큰 저장 (7일 유효)
                        // TODO(Plan-31): HttpOnly Cookie 전환 필요 - XSS 취약점
                        path: '/'
                    });
                    Cookies.set('MemberId', MemberId, { expires: 7 });
                    alert('로그인 성공');
                    nav('/');
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
            <h1>로그인</h1>

            <label>아이디</label>
            <input type="text" value={MemberId} onChange={(e) => setMemberId(e.target.value)}
                placeholder='아이디를 입력해주세요.' /><br />
            {errors.MemberId && <div className={styles.error}>{errors.MemberId}</div>}
            {message && <div className={styles.error}>{message}</div>}

            <label>비밀번호</label>
            <input type="password" value={MemberPw} onChange={(e) => setMemberPw(e.target.value)}
                placeholder='비밀번호를 입력해주세요.' /><br />
            {errors.MemberPw && <div className={styles.error}>{errors.MemberPw}</div>}

            <button onClick={login}>로그인</button>

            <div className={styles.box} />

            <button onClick={btn1}>구글 로그인</button>
        </div>
    );
};
export default StoreLogin;