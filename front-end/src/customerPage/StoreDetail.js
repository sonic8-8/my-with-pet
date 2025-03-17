import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from './StoreDetail.module.css';
import { useParams } from "react-router-dom";
import { addItemToCart } from "../Redux/store";
import { useSelector } from "react-redux";
import { removeItem, updateItemQuantity, addItem } from "../Redux/store";
import { asyncAddCart } from "../Redux/store";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { updateItemQuantity2 } from "../Redux/store";
import Map from "../api/Map";


function StoreDetail() {

    // ----------------------------------------------------------------------
    // URL 파라미터 사용 관련

    let { idx } = useParams();

    // ----------------------------------------------------------------------
    // 가게 정보 요청 관련

    let [store, setStore] = useState('');

    useEffect( () => {
        axios.get('http://localhost:8085/api/store-info',
            {params: { idx : idx }}
        )
        .then( (response) => {
            setStore(response.data)
            console.log(response.data);
        })
        .catch( () => { 
            console.error('통신 이상하거나 데이터가 없음');
        })
    }, [idx]);


    // ----------------------------------------------------------------------
    // 상품 목록 요청 관련

    let [itemList, setItemList] = useState([]);

    useEffect( () => {
        axios.get('http://localhost:8085/api/shop',
            {params: { idx : idx }}
        )
        .then ( (response) => {
            setItemList(response.data);
        })
        .catch ( () => {
            console.error('통신이 이상하거나 데이터가 없습니다.');
        })
    }, [itemList])

    // ----------------------------------------------------------------------
    // 탭 변경 관련

    let [tabState, setTabState] = useState(0);

    // ----------------------------------------------------------------------
    // 리뷰 관련

    const [reviewList, setReviewList] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

    useEffect(() => {
        const fetchReviews = async () => { // async/await 사용
            try {
                const response = await axios.get('http://localhost:8085/api/review', {
                    params: { idx: idx }
                });
                setReviewList(response.data);
            } catch (error) {
                console.error('리뷰를 불러오는 중 오류가 발생했습니다:', error);
            } finally {
                setIsLoading(false); // 로딩 완료
            }
        };

        fetchReviews(); // 함수 호출
    }, [idx]); // idx 값이 변경될 때마다 다시 요청


    // ----------------------------------------------------------------------
    // 장바구니 상태 관련

    const [cart, setCart] = useState([]);

    const handleAddToCart = ( (item) => {
        setCart(prevCart => [...prevCart, item]);
        dispatch(addItem(item));
        dispatch(asyncAddCart(item))
    })

    const handleRemoveItem = (itemId) => {
        dispatch(removeItem(itemId));
      };

      const handleQuantityChange = (itemId, newQuantity) => {
        dispatch(updateItemQuantity({ id: itemId, quantity: newQuantity }));
      };

    // ----------------------------------------------------------------------
    // redux 관련

    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);
    const [cookies, setCookie] = useCookies(['MemberId']);


    const incrementButton = document.createElement('button');
    incrementButton.textContent = '+'; // 또는 아이콘 사용
    const decrementButton = document.createElement('button');
    decrementButton.textContent = '-'; // 또는 아이콘 사용
    
    // ----------------------------------------------------------------------

    return (
        
        <div className={styles.container}>

            <div className={styles.box}/>
            
            {/* 가게 소개 */}
            <div className={styles.store_container}>
                {
                    store != '' ? (
                            <div className={styles.store}>
                                <div className={styles.storeContent}>
                                    <img src={store.logo} alt={store.name} className={styles.storeImage} />
                                <div className={styles.storeInfo}>
                                    {store.auth == true ? <FontAwesomeIcon icon={faCircleCheck} size="xl" style={{color: "#477ce6"}} />
                                    : <p></p>}
                                    <h4>{store.name}</h4>
                                    <p>
                                    <FontAwesomeIcon icon={faStar} style={{color: "#FFD43B",}} />
                                    {store.star}점</p>
                                    <p>배달비 {store.deliveryFee}원</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>로딩중입니다</p>
                    )
                }
            </div>

            {/* 탭 */}
            <div>
                <div className={styles.tap_container}>
                    <p 
                    onClick={() => setTabState(0)}
                    className={tabState === 0 ? styles.tap_active : styles.tap}
                        >상품</p>                
                    <p 
                    onClick={() => setTabState(1)}
                    className={tabState === 1 ? styles.tap_active : styles.tap}
                    >공지사항</p>
                    <p 
                    onClick={() => setTabState(2)}
                    className={tabState === 2 ? styles.tap_active : styles.tap}
                    >리뷰</p>
                </div>
            </div>

            {/* 상품목록*/}
            {
                tabState == 0 ? (
                <div className={styles.item_container}>
                    {
                        itemList.length > 0 ? (
                            itemList.map( (item, index) => {
                                return (
                                    <div key={index} className={styles.item}>
                                        <div className={styles.itemContent}>
                                        <img src={item.img} className={styles.itemImage}/>
                                        </div>
                                        <div className={styles.itemInfo}>
                                        <h4>{item.name}</h4>
                                        <p>{item.price}원</p>
                                        <p>{item.info}</p>


                                        {/* <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.idx, parseInt(e.target.value, 10))}
                                          /> */}

                                          <input
                                            value= {cookies.MemberId}
                                            onChange={(e) => item.memberId = e}
                                            className={styles.hidden}
                                          />
                                        <button onClick={ () => {
                                            handleAddToCart(item);
                                        }
                                        }>장바구니 담기</button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : 
                            <p>로딩중입니다</p>
                    }
                </div>
                ) : (
                    ''
                )
            }

            {/* 공지사항 */}
            {
                tabState == 1 ? (
                    <div className={styles.notice_container}>
                        <h5>공지사항</h5>
                        <p>{store.notice}</p>
                        <h5>가게 전화번호</h5>
                        <p>{store.tel}</p>
                        <h5>가게정보</h5>
                        <p>{store.info}</p>
                        <h5>영업시간</h5>
                        <p>{store.runningTime}</p>
                        <h5>브레이크 타임</h5>
                        <p>{store.pauseTime}</p>
                        <h5>휴무일</h5>
                        <p>{store.holiday}</p>
                        <h5>가게 주소</h5>
                        <Map />
                        <p>{store.addr}</p>
                    </div>
                    ) : (
                    ''
                )

            }

            {/* 리뷰 */}
            {
                tabState === 2 && ( // tabState가 2일 때만 렌더링
                    isLoading ? ( // 로딩 중일 때
                        <p>리뷰를 불러오는 중입니다...</p>
                    ) : (
                        <div className={styles.review_container}>
                            
                            {reviewList.map((review) => ( // 리뷰 데이터 렌더링
                            <div className={styles.review}>
                                    <div key={review.idx}>
                                        <p>{review.title}</p>
                                        <p>ID : {review.memberId}</p>
                                        <p>별점 : {review.ratings}점</p>
                                        <p>리뷰</p>
                                        <p>{review.content}</p>
                                    </div>
                                </div>
                            ))}
                            
                        </div>
                    )
                )
            }

        </div>
    )
}

export default StoreDetail;

function TabContent({탭}) {

    let [fade, setFade] = useState('');

    useEffect( () => {
      
      // 타이머를 붙여줘야함 ( automatic batching 때문에 붙어있는 state 변경 함수를 한 번에 랜더링 해버리려고 함 )
      let a = setTimeout( () => { setFade('end') }, 100 )

      return () => {
        clearTimeout(a);
        setFade('');
      }
    }, [탭] )

    return ( 
      <div className={'start ' + fade}> {/*원할때 부착*/}
       { [<div>내용0</div>, <div>{}</div>, <div>내용2</div>][탭] }
      </div>
    )

  }