# Plan-14: ADR-003 OpenAI API Key 보호 (Backend Proxy)

> **Phase**: 3B (Security - Frontend)  
> **생성일**: 2026-01-13  
> **상태**: 🟡 승인 대기  
> **관련 ADR**: [ADR-003](../adr/ADR-003-openai-key-protection.md)

---

## 목표

ADR-003에서 결정된 **Backend Proxy**를 도입하여 OpenAI API Key가 클라이언트에 노출되지 않도록 합니다.

---

## 현재 상태

```javascript
// front-end/src/api/Chatgpt.js
const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
await axios.post('https://api.openai.com/v1/chat/completions', { ... }, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
});
```

**문제**: API 키가 브라우저에서 노출됨 → 탈취 시 과금 피해

---

## 구현 체크리스트

### 1. Backend ChatController 생성

- [ ] **1.1** `ChatController.java` 생성
  ```java
  @RestController
  @RequestMapping("/api")
  public class ChatController {
      @PostMapping("/chat")
      public ResponseEntity<?> chat(@RequestBody ChatRequest request) {
          // OpenAI API 호출
      }
  }
  ```

- [ ] **1.2** `ChatRequest` DTO 생성

- [ ] **1.3** `application.properties`에 API Key 추가
  ```
  openai.api-key=${OPENAI_API_KEY}
  ```

### 2. Frontend 수정

- [ ] **2.1** `Chatgpt.js`에서 OpenAI 직접 호출 제거
- [ ] **2.2** `/api/chat` 엔드포인트 호출로 변경

### 3. 환경변수 정리

- [ ] **3.1** Frontend `.env`에서 `REACT_APP_OPENAI_API_KEY` 제거

---

## 검증 계획

### 자동 테스트
```bash
cd back-end && .\gradlew compileJava --no-daemon -q
cd ../front-end && npx eslint src/api/Chatgpt.js
```

---

## 완료 기준

1. ✅ Backend ChatController 생성
2. ✅ Frontend OpenAI 직접 호출 제거
3. ✅ API Key Backend로 이동
4. ✅ 컴파일/ESLint 통과
