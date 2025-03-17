import styles from "./BizInfoEdit.module.css";
import { useState } from "react";
import axios from "axios";


function BizInfoEdit() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [notice, setNotice] = useState("");
  const [info, setinfo] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [storeCategory, setStoreCategory] = useState("1");
  const [storeStatus, setStoreStatus] = useState("");
  const [storeHoliday, setStoreHoliday] = useState("");
  const [storeRunningTime, setStoreRunningTime] = useState("");
  const [storePauseTime, setStorePauseTime] = useState("");
  const [storeLogo, setStoreLogo] = useState(null);

  // 카테고리 맵핑////////////////////////////////////
  const categoryMapping = {
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
  /////////////////////////////////////////////////////

  // status 업데이트
  const handleStoreStatusChange = (e) => {
    const newStatus = e.target.value;
    setStoreStatus(newStatus);
  };

  //전화번호 - 만들기////////////////////////////////
  const formatPhoneNumber = (value) => {
    const cleaned = ("" + value).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return value;
  };

  const handlePhoneChange = (e) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setStorePhone(formattedPhoneNumber);
  };
  ////////////////////////////////////////////////////

  //이미지 미리보기////////////////////////////////////
  const previewImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStoreLogo(file); // 선택된 파일을 상태로 저장
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  /////////////////////////////////////////////////

  const saveStoreInfo = async () => {
    try {
      const formData = new FormData();
      formData.append(
        "storeInfo",
        new Blob(
          [
            JSON.stringify({
              notice,
              info,
              name: storeName,
              tel: storePhone,
              addr: storeAddress,
              type: categoryMapping[storeCategory],
              status: storeStatus,
              holiday: storeHoliday,
              runningTime: storeRunningTime,
              pauseTime: storePauseTime,
            }),
          ],
          { type: "application/json" }
        )
      );

      if (storeLogo) {
        formData.append("file", storeLogo);
      }

      await axios.post(
        "http://localhost:8085/api/business/storeinfo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("가게 정보가 성공적으로 저장되었습니다.");
    } catch (error) {
      console.log("통신 실패", error);
      alert("가게 정보 저장 실패");
    }
  };

  return (
    <div className={styles.container}>

      {/* 공간 띄우기 용 */}
      <div className={styles.top_box} />
      
      <div className={styles.info_container}>

        <div className={styles.left_info_box}>

          <div className={styles.left_up}>
            <h3>공지사항</h3>
            <textarea
              type="text"
              value={notice}
              onChange={(e) => setNotice(e.target.value)}
              placeholder="내용을 입력해주세요"
            />
          </div>

          <div className={styles.left_down}>
            <h3>원산지 정보</h3>
            <textarea
              type="text"
              value={info}
              onChange={(e) => setinfo(e.target.value)}
              placeholder="내용을 입력해주세요"
            />
          </div>

        </div>

        <div className={styles.right_info_box}>
          <h3>가게 정보</h3>
          <label>가게 이름</label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />

          <label>가게 전화번호</label>
          <input type="text" value={storePhone} onChange={handlePhoneChange} />

          <label>가게 주소</label>
          <input
            type="text"
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
          />

          <label>가게 로고</label>
          {/* 파일 등록하고 미리보기 */}
          <input type="file" accept="image/*" onChange={previewImg} />
          {previewUrl && (
            <img src={previewUrl} alt="Preview" style={{ maxWidth: "200px" }} />
          )}

          <label>가게 카테고리</label>
          <select
            className={styles.select}
            value={storeCategory}
            onChange={(e) => setStoreCategory(e.target.value)}
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
            value={storeStatus}
            onChange={handleStoreStatusChange}
          >
            <option value="영업">영업</option>
            <option value="휴업">휴업</option>
          </select>

          <label>휴무일</label>
          <input
            type="text"
            value={storeHoliday}
            onChange={(e) => setStoreHoliday(e.target.value)}
          />

          <label>영업시간</label>
          <input
            type="text"
            value={storeRunningTime}
            onChange={(e) => setStoreRunningTime(e.target.value)}
          />

          <label>휴게 시간</label>
          <input
            type="text"
            value={storePauseTime}
            onChange={(e) => setStorePauseTime(e.target.value)}
          />

          <button onClick={saveStoreInfo} className={styles.button}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
export default BizInfoEdit;





