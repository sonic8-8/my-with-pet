import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import styles from './StoreDetail.module.css';

// Redux actions
import { addItem, removeItem, updateItemQuantity, asyncAddCart } from "../Redux/store";

// Custom Hook
import { useStoreData } from "./hooks/useStoreData";

// Components
import StoreHeader from "./components/StoreHeader";
import StoreItemList from "./components/StoreItemList";
import StoreNotice from "./components/StoreNotice";
import StoreReviews from "./components/StoreReviews";

/**
 * 매장 상세 페이지 컴포넌트
 */
function StoreDetail() {
    const { idx } = useParams();
    const dispatch = useDispatch();
    const [cookies] = useCookies(['MemberId']);
    const [tabState, setTabState] = useState(0);

    // Custom Hook으로 데이터 로딩
    const { store, items, reviews, isLoading } = useStoreData(idx);

    // 장바구니 추가 핸들러
    const handleAddToCart = (item) => {
        dispatch(addItem(item));
        dispatch(asyncAddCart(item));
    };

    return (
        <div className={styles.container}>
            <div className={styles.box} />

            {/* 가게 소개 */}
            <div className={styles.store_container}>
                <StoreHeader store={store} />
            </div>

            {/* 탭 네비게이션 */}
            <div className={styles.tap_container}>
                <p
                    onClick={() => setTabState(0)}
                    className={tabState === 0 ? styles.tap_active : styles.tap}
                >
                    상품
                </p>
                <p
                    onClick={() => setTabState(1)}
                    className={tabState === 1 ? styles.tap_active : styles.tap}
                >
                    공지사항
                </p>
                <p
                    onClick={() => setTabState(2)}
                    className={tabState === 2 ? styles.tap_active : styles.tap}
                >
                    리뷰
                </p>
            </div>

            {/* 탭 콘텐츠 */}
            {tabState === 0 && (
                <StoreItemList
                    items={items}
                    onAddToCart={handleAddToCart}
                    memberId={cookies.MemberId}
                />
            )}

            {tabState === 1 && <StoreNotice store={store} />}

            {tabState === 2 && (
                <StoreReviews reviews={reviews} isLoading={isLoading} />
            )}
        </div>
    );
}

export default StoreDetail;