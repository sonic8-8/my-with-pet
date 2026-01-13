import { useState } from 'react';
import axios from 'axios';

// 카테고리 맵핑
const CATEGORY_MAPPING = {
    사료: 0,
    간식: 1,
    영양제: 2,
    장난감: 3,
    도구: 4,
    훈련사: 5,
    산책대행: 6,
    픽업서비스: 7,
    미용: 8,
};

// 전화번호 포맷팅 유틸
const formatPhoneNumber = (value) => {
    const cleaned = ("" + value).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/);
    if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return value;
};

/**
 * 가게 정보 폼 상태 관리 Custom Hook
 * @returns {Object} { formState, handleChange, handlePhoneChange, handleSave }
 */
export function useStoreInfoForm() {
    const [formState, setFormState] = useState({
        notice: "",
        info: "",
        storeName: "",
        storePhone: "",
        storeAddress: "",
        storeCategory: "사료",
        storeStatus: "영업",
        storeHoliday: "",
        storeRunningTime: "",
        storePauseTime: "",
    });

    const handleChange = (field) => (e) => {
        setFormState(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handlePhoneChange = (e) => {
        const formattedPhoneNumber = formatPhoneNumber(e.target.value);
        setFormState(prev => ({
            ...prev,
            storePhone: formattedPhoneNumber
        }));
    };

    const handleSave = async (logoFile) => {
        try {
            const formData = new FormData();
            formData.append(
                "storeInfo",
                new Blob(
                    [
                        JSON.stringify({
                            notice: formState.notice,
                            info: formState.info,
                            name: formState.storeName,
                            tel: formState.storePhone,
                            addr: formState.storeAddress,
                            type: CATEGORY_MAPPING[formState.storeCategory],
                            status: formState.storeStatus,
                            holiday: formState.storeHoliday,
                            runningTime: formState.storeRunningTime,
                            pauseTime: formState.storePauseTime,
                        }),
                    ],
                    { type: "application/json" }
                )
            );

            if (logoFile) {
                formData.append("file", logoFile);
            }

            await axios.post(
                "http://localhost:8085/api/business/storeinfo",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            alert("가게 정보가 성공적으로 저장되었습니다.");
        } catch (error) {
            console.error("가게 정보 저장 실패:", error);
            alert("가게 정보 저장 실패");
        }
    };

    return { formState, handleChange, handlePhoneChange, handleSave };
}

export default useStoreInfoForm;
