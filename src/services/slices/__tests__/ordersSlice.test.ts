import reducer, {
  createOrder,
  fetchOrders,
  initialState
} from '../ordersSlice';

// Лёгкие моки под заказ
const mockOrder = {
  _id: 'order-id-1',
  name: 'Бургер-1',
  ingredients: ['id1', 'id2'],
  status: 'done',
  createdAt: '01-01-2025',
  updatedAt: '01-01-2025',
  number: 111111
};

const mockOrdersArray = [
  mockOrder,
  {
    _id: 'order-id-2',
    name: 'Бургер-2',
    ingredients: ['id3', 'id4'],
    status: 'pending',
    createdAt: '02-01-2025',
    updatedAt: '02-01-2025',
    number: 222222
  }
];

describe('ordersSlice', () => {
  describe('createOrder', () => {
    it('pending', () => {
      const next = reducer(initialState, createOrder.pending('', ['id1']));

      expect(next.isLoading).toBe(true);
      expect(next.error).toBeNull();
      expect(next.orders.length).toBe(0);
    });

    it('fulfilled', () => {
      const next = reducer(
        initialState,
        createOrder.fulfilled(mockOrder, '', ['id1', 'id2'])
      );

      expect(next.isLoading).toBe(false);
      expect(next.orders.length).toBe(1);
      expect(next.orders[0]._id).toBe('order-id-1');
    });

    it('rejected', () => {
      const next = reducer(
        initialState,
        createOrder.rejected(new Error('x'), '', ['id1'], 'ERROR')
      );

      expect(next.isLoading).toBe(false);
      expect(next.error).toBe('ERROR');
    });
  });

  describe('fetchOrders', () => {
    it('pending', () => {
      const next = reducer(initialState, fetchOrders.pending('', undefined));

      expect(next.isLoading).toBe(true);
      expect(next.error).toBeNull();
    });

    it('fulfilled', () => {
      const next = reducer(
        initialState,
        fetchOrders.fulfilled(mockOrdersArray, '', undefined)
      );

      expect(next.isLoading).toBe(false);
      expect(next.orders.length).toBe(2);
      expect(next.orders[1].number).toBe(222222);
    });

    it('rejected', () => {
      const next = reducer(
        initialState,
        fetchOrders.rejected(new Error('x'), '', undefined, 'ERROR')
      );

      expect(next.isLoading).toBe(false);
      expect(next.error).toBe('ERROR');
    });
  });
});
