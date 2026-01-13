# Plan-05: Phase 1B - Backend 네이밍 개선

> **Phase**: 1B (Backend Readability - Naming)  
> **생성일**: 2026-01-13  
> **완료일**: 2026-01-13  
> **상태**: ✅ 완료

---

## 목표

ROADMAP 1B 항목의 메서드/변수명을 **의도가 명확한 이름**으로 변경합니다.

---

## 작업 체크리스트

### 1. ItemController 네이밍 개선

- [x] **1.1** `mainProduct` → `getProductsByType` ✅
- [x] **1.2** `mainShop` → `getItemsByStoreIdx` ✅
- [x] **1.3** `List<Item> List` → `List<Item> items` ✅
- [x] **추가** System.out.println 6개 제거 ✅
- [x] **추가** Stream API 적용, 변환 메서드 추출 ✅

### 2. StoreController 네이밍 개선

- [x] **2.1** `getStoreListByStoreIdx` → `getStoreById` ✅
- [x] **추가** System.out.println 7개 제거 ✅
- [x] **추가** Stream API/Optional 적용, 변환 메서드 추출 ✅

---

## 리팩토링 결과

### 네이밍 변경
| Before | After |
|--------|-------|
| `mainProduct` | `getProductsByType` |
| `mainShop` | `getItemsByStoreIdx` |
| `List<Item> List` | `items` (Stream 사용으로 변수 제거) |
| `getStoreListByStoreIdx` | `getStoreById` |

### 추가 개선
| 항목 | 수량 |
|------|------|
| System.out.println 제거 | **13개** |
| 헬퍼 메서드 추출 | **6개** |
| Stream API 적용 | **4곳** |
| Optional 처리 적용 | **1곳** |

### 테스트 결과
- 컴파일: BUILD SUCCESSFUL ✅
- 단위 테스트: 12/12 통과 ✅

---

## 완료 기준 달성

1. ✅ 모든 대상 메서드/변수명 변경
2. ✅ 컴파일 성공
3. ✅ 단위 테스트 통과
