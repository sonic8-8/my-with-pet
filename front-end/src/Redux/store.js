import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { useCookies } from 'react-cookie';
import Cookies from 'js-cookie';


// 비동기 처리 방법으로 주소를 저장
export const asyncAddAddress = createAsyncThunk('addressSlice/asyncAddAddress',

  async (data) => {

    try {
    const loginedId = Cookies.get('MemberId');
    const addressData = {
      address : data.address,
      memberId : loginedId
    }

    const token = Cookies.get('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const response = axios.post('http://localhost8085/api/address-add',
      JSON.stringify(addressData), {
        headers : {
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 200) {
        console.log('주소 저장 성공!');
      } else {
        console.log('주소 저장 실패');
        console.error('response.data');
      }
    } catch (error) {
      console.error('주소 불러오기 실패', error.message);
      throw error;
    }
  }
)

// -------------------------------------------------------------------
// 비동기 처리 방식으로 주소 가져오기

export const asyncLoadAddress = createAsyncThunk(
  'addressSlice/asyncLoadAddress',

  async () => {

    try {
    const loginedId = Cookies.get('MemberId');
    const response = await axios.get(
      `http://localhost8085/api/address?memberId=${loginedId}`
      )

      if (response.status === 200) {
        console.log('주소 불러오기 성공');
      } else {
        console.log('주소 불러오기 실패');
        console.error(response.data);
      }
    } catch (error) {
      console.error('주소 불러오기 실패', error.message);
      throw error;
    }
  }
)


// -------------------------------------------------------------------

// 장바구니 아이템 추가 비동기 액션 생성
// 어떤 정보를 가져올지 여기서 선택하면 됨
export const asyncAddCart = createAsyncThunk('cartSlice/asyncAxiosCart', 
  
  async (item) => {

    // 여기서 item은 장바구니에서 담은 item을 의미함
    // storeIdx에 대응하는 item 정보를 모두 갖고 있음

    const cartData = {
      itemIdx: item.idx,
      type: item.type,
      name: item.name,
      price: item.price,
      img: item.img,
      storeIdx: item.storeIdx,
      quantity: item.quantity,
      memberId: item.memberId // 쿠키에서 로그인한 사람의 Id를 찾아왔음
    }

    const response = await axios.post('http://localhost:8085/api/cart/add',
    JSON.stringify(cartData), {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) { // 성공하면 관례적으로 200 띄워줌
      console.log('장바구니에 물건을 담았습니다.');
    // 주문 완료 후 처리 (예: 페이지 이동, 장바구니 비우기 등)
    } else {
      console.log('물건담기에 실패했습니다.');
      console.error('물건담기 실패:', response.data);
    };

    return response.data; // 서버 응답 데이터 반환
  });

// -------------------------------------------------------------------
// 생성하는 곳
const addressSlice = createSlice({
  name: 'address',
  initialState: {
    addresses: [],
    status: '',
    error: null
  },
  // 동기 처리
  reducers: {
    addAddress: (state, action) => {},
    removeAddress: (state, action) => {},
    updateAddress: (state, action) => {}
  },

  // 비동기 처리
  extraReducers: ( (builder) => 
    builder
      .addCase( asyncAddAddress.pending, (state, action) => {
        state.status = '로딩중'
      })
      .addCase( asyncAddAddress.fulfilled, (state, action) => {
        state.status = '성공'
        state.addresses.push(action.payload);
      })
      .addCase( asyncAddAddress.rejected, (state, action) => {
        state.status = '실패'
        state.error = action.error.message;
      })
  ),

  extraReducers: ( (builder) =>
    builder
      .addCase( asyncLoadAddress.pending, (state, action) => {
        state.status = '로딩중';
      })
      .addCase( asyncLoadAddress.fulfilled, (state, action) => {
        state.status = '성공';
        state.addresses = action.payload;
      })
      .addCase( asyncLoadAddress.rejected, (state, action) => {
        state.status = '실패';
        state.error = action.error.message;
      })
)
})

// 만든 함수 export
export const { addAddress, removeAddress, updateAddress } = addressSlice.actions;

// -------------------------------------------------------------------

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
      items: [],
      status: '',
      error: null
    },
    // 동기 처리 함수
    reducers: {
      addItem: (state, action) => {
        const existingItem = state.items.find(item => item.idx === action.payload.idx);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.items.push({ ...action.payload, quantity: 1 });
        }
      },
      removeItem: (state, action) => {
        state.items = state.items.filter(item => item.idx !== action.payload);
      },
      updateItemQuantity: (state, action) => {
        const item = state.items.find(item => item.idx === action.payload.idx);
        if (item) {
          item.quantity = action.payload.quantity;
        }
      },
    },
    // 비동기 처리 메서드
    extraReducers: ( (builder) => {
        builder
          .addCase(asyncAddCart.pending, (state, action) => {
            state.status = '로딩중';
          })
          .addCase(asyncAddCart.fulfilled, (state, action) => {
            state.status = '성공';
            state.items.push(action.payload);
          })
          .addCase(asyncAddCart.rejected, (state, action) => {
            state.status = '실패';
            state.error = action.error.message;
          });
      })
  });

// 만든 함수 export
export const { addItem, removeItem, updateItemQuantity } = cartSlice.actions;


// -----------------------------------------------------------------
// 등록하는 곳
export default configureStore({
reducer: {
    cart : cartSlice.reducer,
    address : addressSlice.reducer
    }
});