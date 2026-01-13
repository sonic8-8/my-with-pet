import React from 'react';
import styles from '../BizInfoEdit.module.css';
import StoreLogoUploader from './StoreLogoUploader';

/**
 * 가게 정보 입력 섹션 컴포넌트
 */
function StoreInfoSection({ formState, handleChange, handlePhoneChange, previewUrl, onImageChange, onSave }) {
    return (
        <div className={styles.right_info_box}>
            <h3>가게 정보</h3>

            <label>가게 이름</label>
            <input
                type="text"
                value={formState.storeName}
                onChange={handleChange('storeName')}
            />

            <label>가게 전화번호</label>
            <input
                type="text"
                value={formState.storePhone}
                onChange={handlePhoneChange}
            />

            <label>가게 주소</label>
            <input
                type="text"
                value={formState.storeAddress}
                onChange={handleChange('storeAddress')}
            />

            <StoreLogoUploader previewUrl={previewUrl} onImageChange={onImageChange} />

            <label>가게 카테고리</label>
            <select
                className={styles.select}
                value={formState.storeCategory}
                onChange={handleChange('storeCategory')}
            >
                <option>사료</option>
                <option>간식</option>
                <option>영양제</option>
                <option>장난감</option>
                <option>도구</option>
                <option>훈련사</option>
                <option>산책대행</option>
                <option>픽업서비스</option>
                <option>미용</option>
            </select>

            <label>가게 상태</label>
            <select
                className={styles.select}
                value={formState.storeStatus}
                onChange={handleChange('storeStatus')}
            >
                <option value="영업">영업</option>
                <option value="휴업">휴업</option>
            </select>

            <label>휴무일</label>
            <input
                type="text"
                value={formState.storeHoliday}
                onChange={handleChange('storeHoliday')}
            />

            <label>영업시간</label>
            <input
                type="text"
                value={formState.storeRunningTime}
                onChange={handleChange('storeRunningTime')}
            />

            <label>휴게 시간</label>
            <input
                type="text"
                value={formState.storePauseTime}
                onChange={handleChange('storePauseTime')}
            />

            <button onClick={onSave} className={styles.button}>
                저장
            </button>
        </div>
    );
}

export default StoreInfoSection;
