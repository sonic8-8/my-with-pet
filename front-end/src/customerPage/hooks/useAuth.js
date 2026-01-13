import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

/**
 * 인증 상태 관리 Custom Hook
 * @returns {Object} { isLoggedIn, memberId, handleLogout }
 */
export function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [memberId, setMemberId] = useState('');

    useEffect(() => {
        const token = Cookies.get('token');
        const storedMemberId = Cookies.get('MemberId');
        if (token && storedMemberId) {
            setIsLoggedIn(true);
            setMemberId(storedMemberId);
        }
    }, []);

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('MemberId');
        setIsLoggedIn(false);
        setMemberId('');
        alert('로그아웃 되었습니다.');
    };

    return { isLoggedIn, memberId, handleLogout };
}

export default useAuth;
