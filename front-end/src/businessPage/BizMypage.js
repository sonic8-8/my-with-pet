import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import styles from './BizMypage.module.css';

function BizMypage() {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = Cookies.get('token'); // 쿠키에서 토큰 가져오기
        if (!token) {
            setError('로그인을 해주세요.');
            setLoading(false);
            return;
        }

        axios
            .get('/api/business/mypage', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                setUserInfo(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log('Failed to fetch user info:', error);
                setError('Failed to fetch user information.');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={styles.my_page}>
            <h1>My Page</h1>
            {userInfo && (
                <div className={styles.user_info}>
                    <p><strong>아이디:</strong> {userInfo.id}</p>
                    <p><strong>이름:</strong> {userInfo.name}</p>
                    <p><strong>전화번호:</strong> {userInfo.phone}</p>
                    <p><strong>역할:</strong> {userInfo.role}</p>
                </div>
            )}
        </div>
    );
}
export default BizMypage;