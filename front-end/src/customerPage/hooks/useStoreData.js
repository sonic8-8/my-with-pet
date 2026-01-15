import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * 매장 상세 페이지 데이터를 로드하는 Custom Hook
 * @param {string|number} storeIdx - 매장 ID
 * @returns {Object} { store, items, reviews, isLoading, error }
 */
export function useStoreData(storeIdx) {
    const [store, setStore] = useState(null);
    const [items, setItems] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 매장 정보 로드
    useEffect(() => {
        if (!storeIdx) return;

        axios.get('/api/store-info', {
            params: { idx: storeIdx }
        })
            .then(response => setStore(response.data))
            .catch(err => setError(err.message));
    }, [storeIdx]);

    // 상품 목록 로드
    useEffect(() => {
        if (!storeIdx) return;

        axios.get('/api/shop', {
            params: { idx: storeIdx }
        })
            .then(response => setItems(response.data))
            .catch(err => setError(err.message));
    }, [storeIdx]);

    // 리뷰 목록 로드
    useEffect(() => {
        if (!storeIdx) return;

        const fetchReviews = async () => {
            try {
                const response = await axios.get('/api/review', {
                    params: { idx: storeIdx }
                });
                setReviews(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, [storeIdx]);

    return { store, items, reviews, isLoading, error };
}

export default useStoreData;
