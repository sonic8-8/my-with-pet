# Frontend Review

[Security]
- API key exposure: OpenAI key is read from `REACT_APP_OPENAI_API_KEY` and sent directly from the browser, which exposes it in the client bundle and network calls. See `front-end/src/api/Chatgpt.js:28`, `front-end/src/api/Chatgpt.js:52`.
- API key exposure: Firebase config (including apiKey) is hardcoded in the client, making it publicly visible and increasing abuse risk if backend rules are weak. See `front-end/src/customerPage/Login.js:13`.
- Token storage risk: auth tokens are stored in `localStorage` and JS-accessible cookies (not HttpOnly), so any XSS would leak them. See `front-end/src/api/axiosConfig.js:14`, `front-end/src/customerPage/Login.js:69`, `front-end/src/businessPage/BizLogin.js:32`, `front-end/src/App.js:62`, `front-end/src/Redux/store.js:19`.
- XSS surface check: no `dangerouslySetInnerHTML` usage found; React JSX escaping is relied on. Query params are rendered as text in payment success pages, which is safe under React escaping but should remain text-only. See `front-end/src/Tosspayments/Success.js:28`.
- Payment client key hardcoded in one flow; even if a test key, it is publicly visible and should be treated as non-secret. See `front-end/src/api/Payment.js:32`.


[Readability]
- Fat component: `front-end/src/customerPage/StoreDetail.js` mixes data fetching (store/items/reviews), cart state, tab state, and large JSX with conditional branches; split into `StoreHeader`, `StoreTabs`, `ItemList`/`ItemCard`, `NoticeSection`, `ReviewList`, plus a `useStoreDetailData` hook to isolate API calls.
- Fat component: `front-end/src/Tosspayments/Checkout.js` combines payment widget lifecycle, cart rendering, order form state, total calculation, and submit logic in one file; extract `usePaymentWidget`, `useOrderForm`, `CartItemsList`, and `OrderSummary` components.
- Fat component: `front-end/src/customerPage/Navbar.js` bundles panel open/close logic, auth state, Redux selectors, and multiple panel UIs; split into `NavMenu`, `PanelContainer`, `CartPanel`, `AddressPanel`, `AlertPanel`, and a `usePanelState` hook.
- Fat component: `front-end/src/businessPage/BizInfoEdit.js` contains form state, file preview, formatting helpers, and submit; split into `StoreInfoForm`, `StoreLogoUploader`, `StoreCategorySelect`, `BusinessHoursFields`, and a `useStoreInfoForm` hook.
- Fat component: `front-end/src/App.js` handles routing plus auth state and mode toggling; move auth/session checks to `useAuthSession` hook and lift routes to a `RoutesConfig` component.
- JSX logic density: repeated inline conditionals and map/render blocks in `front-end/src/customerPage/StoreDetail.js` and `front-end/src/customerPage/Navbar.js` make UI flow hard to scan; extract 20-line subcomponents for each tab/panel content to keep JSX linear.


[Testing]
- Test coverage is effectively empty: only default CRA smoke tests exist and they assert a non-existent "learn react" link. See `front-end/src/App.test.js:1`, `front-end/src/api/Tosspay.test.js:1`.
- No component-level or interaction tests for critical flows (login/signup, cart, checkout, store detail, address edit), so UI regressions will not be caught.
- Testing setup is minimal (`@testing-library/jest-dom` only) and lacks mocks for axios, cookies, and payment widgets; current tests do not exercise user events or async effects. See `front-end/src/setupTests.js:1`.


[Performance]
- Hypothesis: `front-end/src/App.js` owns global mode/auth state and renders full routing tree; any state change at this level can cause large subtree re-renders (routes, nav, footer), which may degrade interaction performance as route components grow.
- Hypothesis: `front-end/src/customerPage/StoreDetail.js` performs multiple data fetches and renders large lists inline; the item list and review list will re-render on unrelated state changes (tab switch, cart updates), causing frame drops with large item counts.
- Hypothesis: `front-end/src/customerPage/StoreDetail.js` uses `useEffect` with `itemList` as a dependency while updating `itemList` inside, which risks re-fetch loops and excessive renders/network calls under load.
- Hypothesis: `front-end/src/customerPage/Navbar.js` pulls multiple Redux slices and renders panel contents inline; any cart/address state update can re-render the entire nav and all panels, which scales poorly with frequent updates.
- Hypothesis: `front-end/src/Tosspayments/Checkout.js` mixes cart list rendering, order form state, payment widget lifecycle, and total calculations in one component; state updates (typing inputs, cart quantity changes) will re-render the payment widget container and cart list together, risking jank with larger carts.
- Hypothesis: `front-end/src/Redux/store.js` centralizes unrelated state (cart + address) in a single store without memoized selectors; updates may propagate unnecessarily to components that only need a subset of state, increasing render work.
