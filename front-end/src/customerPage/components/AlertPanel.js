import React from 'react';
import styles from '../Navbar.module.css';

/**
 * 알림 패널 컴포넌트
 */
function AlertPanel() {
    return (
        <div className={styles.panel_content}>
            <p>배송 상태</p>
            <p>리뷰 답변</p>
        </div>
    );
}

export default AlertPanel;
