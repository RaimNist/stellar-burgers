import reducer, { fetchIngredients, initialState } from '../ingredientsSlice';

// лёгкий мок под ингры (взято с твоих данных, но не 1-в-1)
const mockItems = [
  {
    _id: 'bun-id',
    name: 'Булка',
    type: 'bun',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 100,
    image: '',
    image_mobile: '',
    image_large: ''
  },
  {
    _id: 'ingredient-id',
    name: 'Ингредиент',
    type: 'main',
    proteins: 1,
    fat: 2,
    carbohydrates: 3,
    calories: 4,
    price: 200,
    image: '',
    image_mobile: '',
    image_large: ''
  }
];

describe('ingredientsSlice', () => {
  it('pending', () => {
    const next = reducer(initialState, fetchIngredients.pending('', undefined));

    expect(next.isLoading).toBe(true);
    expect(next.error).toBeNull();
    expect(next.items.length).toBe(0);
  });

  it('fulfilled', () => {
    const next = reducer(
      initialState,
      fetchIngredients.fulfilled(mockItems, '', undefined)
    );

    expect(next.isLoading).toBe(false);
    expect(next.items.length).toBe(2);
    expect(next.items[0]._id).toBe('bun-id');
  });

  it('rejected', () => {
    const next = reducer(
      initialState,
      fetchIngredients.rejected(new Error('x'), '', undefined, 'ERROR')
    );

    expect(next.isLoading).toBe(false);
    expect(next.error).toBe('ERROR');
  });
});
