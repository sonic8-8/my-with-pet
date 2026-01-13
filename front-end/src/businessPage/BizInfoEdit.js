import styles from "./BizInfoEdit.module.css";

// Custom Hooks
import { useStoreInfoForm } from './hooks/useStoreInfoForm';
import { useImagePreview } from './hooks/useImagePreview';

// Components
import NoticeInfoSection from './components/NoticeInfoSection';
import StoreInfoSection from './components/StoreInfoSection';

/**
 * 사업자 가게 정보 편집 페이지
 */
function BizInfoEdit() {
  // Custom Hooks
  const { formState, handleChange, handlePhoneChange, handleSave } = useStoreInfoForm();
  const { previewUrl, imageFile, handleImageChange } = useImagePreview();

  // 저장 핸들러
  const onSave = () => handleSave(imageFile);

  return (
    <div className={styles.container}>
      <div className={styles.top_box} />

      <div className={styles.info_container}>
        {/* 공지사항 및 원산지 정보 */}
        <NoticeInfoSection
          formState={formState}
          handleChange={handleChange}
        />

        {/* 가게 정보 */}
        <StoreInfoSection
          formState={formState}
          handleChange={handleChange}
          handlePhoneChange={handlePhoneChange}
          previewUrl={previewUrl}
          onImageChange={handleImageChange}
          onSave={onSave}
        />
      </div>
    </div>
  );
}

export default BizInfoEdit;
