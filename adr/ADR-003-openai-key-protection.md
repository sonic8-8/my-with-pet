# ADR-003: OpenAI API Key 보호

> **상태**: 🟡 승인 대기  
> **생성일**: 2026-01-13  
> **결정자**: [사용자 승인 필요]

---

## 컨텍스트

현재 `Chatgpt.js`에서 OpenAI API를 **Frontend에서 직접 호출**하고 있습니다.

```javascript
// front-end/src/api/Chatgpt.js
const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
// ...
const response = await axios.post('https://api.openai.com/v1/chat/completions', { ... }, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
});
```

### 문제점
- **API 키가 브라우저 개발자 도구에서 노출됨**
- 공격자가 API 키를 탈취하여 무단 사용 가능
- OpenAI 과금 피해 발생 위험
- `.env` 파일이 빌드 시 번들에 포함됨

### 심각도
🔴 **CRITICAL** - 즉시 대응 필요

---

## 결정 옵션

### 옵션 A: Backend Proxy 도입 ⭐ 권장

**Frontend** → **Backend** → **OpenAI API**

```
Frontend                    Backend                     OpenAI
   |                           |                           |
   |--- POST /api/chat ------->|                           |
   |                           |--- POST openai.com ------>|
   |                           |<-- Response --------------|
   |<-- Response --------------|                           |
```

**Backend 구현**:
```java
@RestController
@RequestMapping("/api")
public class ChatController {
    
    @Value("${openai.api-key}")
    private String apiKey;
    
    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody ChatRequest request) {
        // OpenAI API 호출
        // API 키는 서버에만 존재
    }
}
```

**장점**:
- API 키가 서버에만 존재
- 요청 로깅/제한 가능
- 비용 모니터링 용이

**단점**:
- Backend 개발 필요
- 응답 지연 (약간)

---

### 옵션 B: Serverless Function 활용

Vercel/Netlify Functions를 통한 API 프록시

**장점**:
- Backend 변경 최소화
- 빠른 배포

**단점**:
- 별도 인프라 관리 필요
- 기존 아키텍처와 분리

---

## 권장 결정

**옵션 A: Backend Proxy 도입**

기존 Spring Boot 백엔드에 ChatController 추가.

### 구현 계획

1. **Backend**:
   - `ChatController` 생성
   - `application.properties`에 OpenAI API 키 추가
   - Rate limiting 적용 (선택)

2. **Frontend**:
   - `Chatgpt.js`에서 OpenAI 직접 호출 제거
   - `/api/chat` 엔드포인트 호출로 변경

3. **환경변수**:
   - Frontend `.env`에서 `REACT_APP_OPENAI_API_KEY` 제거
   - Backend `.env` 또는 `application.properties`로 이동

---

## 승인 요청

> [!CAUTION]
> 승인 시 Frontend에서 OpenAI 직접 호출이 제거됩니다.
> Backend에 새로운 엔드포인트가 추가됩니다.

**승인 시 구현을 진행하겠습니다.**
