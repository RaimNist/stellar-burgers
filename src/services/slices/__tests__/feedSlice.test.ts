import reducer, { fetchFeed, initialState } from '../feedSlice';

// мок ответа сервера
const mockFeedData = {
  success: true,
  orders: [
    {
      _id: 'order-1',
      name: 'Бургер 1',
      status: 'done',
      ingredients: ['1', '2'],
      createdAt: '01-01-2025',
      updatedAt: '01-01-2025',
      number: 111111
    },
    {
      _id: 'order-2',
      name: 'Бургер 2',
      status: 'pending',
      ingredients: ['3'],
      createdAt: '02-01-2025',
      updatedAt: '02-01-2025',
      number: 222222
    }
  ],
  total: 999999,
  totalToday: 42
};

describe('feedSlice', () => {
  it('pending', () => {
    const next = reducer(initialState, fetchFeed.pending('', undefined));

    expect(next.isLoading).toBe(true);
    expect(next.error).toBe(null);
    expect(next.orders.length).toBe(0);
  });

  it('fulfilled', () => {
    const next = reducer(
      initialState,
      fetchFeed.fulfilled(mockFeedData, '', undefined)
    );

    expect(next.isLoading).toBe(false);
    expect(next.orders.length).toBe(2);
    expect(next.orders[0]._id).toBe('order-1');
    expect(next.total).toBe(999999);
    expect(next.totalToday).toBe(42);
  });

  it('rejected', () => {
    const next = reducer(
      initialState,
      fetchFeed.rejected(new Error('fail'), '', undefined, 'ERROR')
    );

    expect(next.isLoading).toBe(false);
    expect(next.error).toBe('ERROR');
  });
});
