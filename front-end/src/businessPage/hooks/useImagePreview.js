import { useState } from 'react';

/**
 * 이미지 미리보기 Custom Hook
 * @returns {Object} { previewUrl, imageFile, handleImageChange }
 */
export function useImagePreview() {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return { previewUrl, imageFile, handleImageChange };
}

export default useImagePreview;
