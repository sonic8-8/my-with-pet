# ADR-009: 민감 정보 응답 DTO 분리

## 날짜
2026-01-19

## 상태
✅ 채택

## 맥락 (Context)
`Member`, `StoreMember` 엔티티를 API 응답으로 직접 반환하여 `pw` 필드가 노출될 위험이 있었습니다.
- `/api/memberinfo` 응답에 비밀번호 포함
- `/api/business/me` 응답에 비밀번호 포함

## 결정 (Decision)
- `MemberResponseDTO`, `StoreMemberResponseDTO` 생성
- 엔티티의 `pw` 필드에 `@JsonIgnore` 추가 (이중 방어)
- Controller에서 엔티티 대신 DTO 반환

## 결과 (Consequences)
### 장점
- 비밀번호 필드가 API 응답에 포함되지 않음
- 직렬화 시 민감 정보 노출 방지
- 응답 스키마 명확화

### 단점
- DTO 클래스 추가로 코드량 증가
- 엔티티 ↔ DTO 변환 로직 필요

## 관련 Plan
- Plan-31
- REVIEW_3.md (민감 정보 노출 이슈)
