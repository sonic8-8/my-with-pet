import React from 'react';
import styles from '../BizInfoEdit.module.css';

/**
 * 이미지 업로드 및 미리보기 컴포넌트
 */
function StoreLogoUploader({ previewUrl, onImageChange }) {
    return (
        <>
            <label>가게 로고</label>
            <input type="file" accept="image/*" onChange={onImageChange} />
            {previewUrl && (
                <img src={previewUrl} alt="Preview" style={{ maxWidth: "200px" }} />
            )}
        </>
    );
}

export default StoreLogoUploader;
