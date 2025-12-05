import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrdersApi } from '../../utils/burger-api';
import { clearConstructor } from './constructorSlice';
import { TOrder } from '../../utils/types';

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredientIds: string[], { rejectWithValue, dispatch }) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      try {
        dispatch(clearConstructor());
      } catch (e) {
        // ignore
      }
      return response.order;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Ошибка при создании заказа');
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrdersApi();
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Ошибка при загрузке заказов');
    }
  }
);

interface OrdersState {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
}

export const initialState: OrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export default ordersSlice.reducer;
