import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import styles from './Login.module.css';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { useCookies } from 'react-cookie';


function StoreLogin() {
    const firebaseConfig = {
        apiKey: "AIzaSyA84xPtsglofD_O6n71ZUTUFSeA95IVbU0",
        authDomain: "flowing-code-427002-h8.firebaseapp.com",
        projectId: "flowing-code-427002-h8",
        storageBucket: "flowing-code-427002-h8.appspot.com",
        messagingSenderId: "218939777301",
        appId: "1:218939777301:web:77f3f41f478558eddcc91c",
        measurementId: "G-CTLHYS0E6M"
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
    const [token, setToken] = useCookies('token');

    const login = () => {
        let newErrors = {};
        if (!MemberId) newErrors.MemberId = '*아이디를 입력해주세요.';
        if (!MemberPw) newErrors.MemberPw = '*비밀번호를 입력해주세요.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        axios
            .post('http://localhost:8085/api/login', {
                id: MemberId,
                pw: MemberPw,
            })
            .then((response) => {
                console.log(response.data);
                if (response.data.message === '로그인 성공') {
                    const token = response.data.token;
                    Cookies.set('token', token, {
                        expires: 7, // 쿠키에 토큰 저장 (7일 유효)
                        path: '/'
                    });
                    Cookies.set('MemberId', MemberId, { expires: 7 }); // 쿠키에 사용자 이름 저장 (7일 유효)
                    alert('로그인 성공');
                    nav('/');
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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