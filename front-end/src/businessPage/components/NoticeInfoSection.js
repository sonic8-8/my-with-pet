import React from 'react';
import styles from '../BizInfoEdit.module.css';

/**
 * 공지사항 및 원산지 정보 입력 섹션
 */
function NoticeInfoSection({ formState, handleChange }) {
    return (
        <div className={styles.left_info_box}>
            <div className={styles.left_up}>
                <h3>공지사항</h3>
                <textarea
                    value={formState.notice}
                    onChange={handleChange('notice')}
                    placeholder="내용을 입력해주세요"
                />
            </div>

            <div className={styles.left_down}>
                <h3>원산지 정보</h3>
                <textarea
                    value={formState.info}
                    onChange={handleChange('info')}
                    placeholder="내용을 입력해주세요"
                />
            </div>
        </div>
    );
}

export default NoticeInfoSection;
