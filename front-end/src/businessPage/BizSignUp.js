import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import styles from './BizSignUp.module.css';

function BizSignUp() {

    const nav = useNavigate();
    const [MemberId, setMemberId] = useState('');
    const [MemberPw, setMemberPw] = useState('');
    const [MemberName, setMemberName] = useState('');
    const [MemberPhone, setMemberPhone] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const formatPhoneNumber = (value) => {
        const cleaned = ('' + value).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return value;
    };

    const handlePhoneChange = (e) => {
        const formattedPhoneNumber = formatPhoneNumber(e.target.value);
        setMemberPhone(formattedPhoneNumber);
    };

    const register = () => {
        let newErrors = {};
        if (!MemberId) newErrors.MemberId = '*아이디를 입력해주세요.';
        if (!MemberPw) newErrors.MemberPw = '*비밀번호를 입력해주세요.';
        if (!MemberName) newErrors.MemberName = '*이름을 입력해주세요.';
        if (!MemberPhone) newErrors.MemberPhone = '*전화번호를 입력해주세요.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        axios
            .post('/api/business/sign-up', {
                id: MemberId,
                pw: MemberPw,
                name: MemberName,
                phone: MemberPhone,
            })
            .then((response) => {
                console.log(response.data);
                if (response.data === '회원가입 성공') {
                    alert('회원가입 성공');
                    nav('/business');
                } else {
                    setMessage(response.data);
                }
            })
            .catch((error) => {
                console.log('통신 실패', error);
                alert('회원가입 실패');
            });

    };

    return (
        <div className={styles.register_form}>
            <h1>Member 회원가입</h1>

            <label>아이디</label>
            <input type="text" value={MemberId} onChange={(e) => setMemberId(e.target.value)}
                placeholder='아이디를 입력해주세요.' /><br />
            {errors.MemberId && <div className="error">{errors.MemberId}</div>}
            {message && <div className={styles.error}>{message}</div>}

            <label>비밀번호</label>
            <input type="password" value={MemberPw} onChange={(e) => setMemberPw(e.target.value)}
                placeholder='비밀번호를 입력해주세요.' /><br />
            {errors.MemberPw && <div className={styles.error}>{errors.MemberPw}</div>}


            <label>이름</label>
            <input type="text" value={MemberName} onChange={(e) => setMemberName(e.target.value)}
                placeholder='이름을 입력해주세요.' /><br />
            {errors.MemberName && <div className={styles.error}>{errors.MemberName}</div>}


            <label>전화번호</label>
            <input type="text" value={MemberPhone} onChange={handlePhoneChange}
                placeholder='전화번호를 입력해주세요.' /><br />
            {errors.MemberPhone && <div className={styles.error}>{errors.MemberPhone}</div>}


            <button onClick={register}>회원가입하기</button>
        </div>
    );
};

export default BizSignUp;