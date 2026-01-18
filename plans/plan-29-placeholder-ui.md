# Plan-29: 미완성 화면 Placeholder UI 적용

> **상태**: ✅ 완료  
> **작성일**: 2026-01-18  
> **완료일**: 2026-01-18  
> **연관 ROADMAP**: 6C.3

---

## 목표

미완성 화면에 **"서비스 준비 중" Placeholder UI**를 적용하여 사용자에게 해당 기능이 개발 중임을 명확하게 안내합니다.

---

## 배경

현재 9개 컴포넌트가 빈 div 또는 placeholder 텍스트만 있는 상태:

| 영역 | 컴포넌트 | 현재 상태 |
|------|----------|-----------|
| Business | `BizLikeList.js` | 빈 div |
| Business | `BizOrderList.js` | 빈 div |
| Business | `BizOrderStatus.js` | 빈 div |
| Business | `BizReview.js` | 빈 div |
| Business | `BizTempClose.js` | 빈 div |
| MyPage | `DeleteId.js` | 빈 div |
| MyPage | `Mypage.js` | 빈 div |
| MyPage | `MyPet.js` | 빈 div |
| MyPage | `LikeList.js` | "좋아요한가게 페이지" 텍스트 |

---

## 구현 계획

### 1. 공통 컴포넌트 생성

#### [NEW] `src/common/ComingSoon.js`
재사용 가능한 Placeholder UI 컴포넌트:

```jsx
import styles from './ComingSoon.module.css';

/**
 * 서비스 준비 중 Placeholder 컴포넌트
 * @param {string} title - 페이지 제목 (예: "주문 내역")
 * @param {string} description - 추가 설명 (선택사항)
 */
function ComingSoon({ title, description }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>🚧</div>
        <h2 className={styles.title}>서비스 준비 중</h2>
        <p className={styles.subtitle}>{title} 기능을 준비하고 있습니다</p>
        {description && <p className={styles.description}>{description}</p>}
        <p className={styles.notice}>빠른 시일 내에 찾아뵙겠습니다!</p>
      </div>
    </div>
  );
}

export default ComingSoon;
```

#### [NEW] `src/common/ComingSoon.module.css`
```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
}

.content {
  text-align: center;
  max-width: 400px;
}

.icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.125rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.description {
  font-size: 0.875rem;
  color: #888;
  margin-bottom: 1rem;
}

.notice {
  font-size: 0.875rem;
  color: #999;
  font-style: italic;
}
```

---

### 2. 대상 컴포넌트 수정

각 컴포넌트에서 `ComingSoon` 컴포넌트를 import하고 적절한 title 전달:

#### [MODIFY] Business 컴포넌트

| 파일 | title prop |
|------|------------|
| `BizLikeList.js` | "찜 목록" |
| `BizOrderList.js` | "주문 내역" |
| `BizOrderStatus.js` | "주문 상태 관리" |
| `BizReview.js` | "리뷰 관리" |
| `BizTempClose.js` | "임시 휴무 설정" |

#### [MODIFY] MyPage 컴포넌트

| 파일 | title prop |
|------|------------|
| `DeleteId.js` | "회원 탈퇴" |
| `Mypage.js` | "마이페이지" |
| `MyPet.js` | "반려동물 정보" |
| `LikeList.js` | "찜한 가게" |

---

## 체크리스트

- [x] `src/common/` 디렉토리 생성
- [x] `ComingSoon.js` 컴포넌트 생성
- [x] `ComingSoon.module.css` 스타일 생성
- [x] `BizLikeList.js` 수정
- [x] `BizOrderList.js` 수정
- [x] `BizOrderStatus.js` 수정
- [x] `BizReview.js` 수정
- [x] `BizTempClose.js` 수정
- [x] `DeleteId.js` 수정
- [x] `Mypage.js` 수정
- [x] `MyPet.js` 수정
- [x] `LikeList.js` 수정
- [x] 프론트엔드 빌드 테스트
- [x] HISTORY.md 업데이트
- [x] ROADMAP.md 6C.3 완료 표시

---

## 검증 방법

1. `npm run build` 성공 확인
2. 대상 페이지 접속 시 Placeholder UI 정상 표시 확인

---

## 예상 영향

- **신규 파일**: 2개 (`ComingSoon.js`, `ComingSoon.module.css`)
- **수정 파일**: 9개 (대상 컴포넌트)
- **기능 변경**: 없음 (UI만 추가)
- **라우팅**: 기존 라우팅 유지
