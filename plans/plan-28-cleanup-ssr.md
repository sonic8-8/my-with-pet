# Plan-28: SSR 제거 및 미사용 코드 정리 (Phase 6C.1, 6C.2)

> **상태**: ✅ 완료  
> **생성일**: 2026-01-16  
> **관련**: ROADMAP.md Phase 6C.1, 6C.2, REVIEW.md

---

## 목표

레거시 SSR(Thymeleaf) 템플릿 파일 및 미사용 코드를 삭제하여 프로젝트를 정리합니다.

---

## 삭제 대상

### 6C.1: SSR(Thymeleaf) 관련 파일 삭제

#### Backend - `templates/` 디렉토리 삭제 (15개 파일)

| 파일 | 설명 |
|------|------|
| `date.html` | 날짜 페이지 |
| `detail.html` | 상세 페이지 |
| `edit.html` | 수정 페이지 |
| `error.html` | 에러 페이지 |
| `index.html` | 메인 페이지 |
| `list.html` | 목록 페이지 |
| `listPagination.html` | 목록 페이지네이션 |
| `login.html` | 로그인 페이지 |
| `mypage.html` | 마이페이지 |
| `nav.html` | 네비게이션 |
| `notice.html` | 공지사항 |
| `ordersDetail.html` | 주문 상세 |
| `register.html` | 회원가입 |
| `searchPagination.html` | 검색 페이지네이션 |
| `write.html` | 글쓰기 |

#### Backend - `static/` 디렉토리 삭제 (3개 파일)

| 파일 | 설명 |
|------|------|
| `cart.css` | 장바구니 (SSR용) |
| `main.css` | 메인 (SSR용) |
| `ordersDetail.css` | 주문상세 (SSR용) |

> **참고**: Thymeleaf 의존성은 `build.gradle`에 이미 없음

---

### 6C.2: 미사용 코드 정리

#### Frontend - 중복 파일 삭제

| 파일 | 이유 |
|------|------|
| `front-end/src/api/Success.js` | `Tosspayments/Success.js`와 중복 |
| `front-end/src/api/Payment.module.css` | 위 파일과 함께 사용되던 CSS |

---

## 수정 계획

### 삭제 명령

```bash
# Backend SSR 파일 삭제
rm -rf back-end/src/main/resources/templates/
rm -rf back-end/src/main/resources/static/

# Frontend 중복 파일 삭제
rm front-end/src/api/Success.js
rm front-end/src/api/Payment.module.css  # 있는 경우
```

---

## 검증 계획

### Backend 빌드 테스트

```bash
cd back-end && ./gradlew build -x test
```

### Frontend 빌드 테스트

```bash
cd front-end && npm run build
```

> **참고**: CRA 빌드 이슈가 있는 경우 `npm start`로 개발 서버 실행 확인

---

## 영향 범위

| 영역 | 삭제 항목 |
|------|----------|
| `back-end/src/main/resources/templates/` | 15개 HTML 파일 |
| `back-end/src/main/resources/static/` | 3개 CSS 파일 |
| `front-end/src/api/Success.js` | 중복 컴포넌트 |

---

## 예상 소요 시간

- 구현: 5분
- 테스트: 10분
