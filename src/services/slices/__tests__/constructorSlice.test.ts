import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructorSlice';

const bunMock = {
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
};

const mainMock = {
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
};

describe('constructorSlice ', () => {
  const baseState = {
    bun: null,
    ingredients: []
  };

  it('Корректно добавляет булку', () => {
    const next = reducer(baseState, addIngredient(bunMock));
    expect(next.bun).toEqual(bunMock);
    expect(next.ingredients.length).toBe(0);
  });
  
  it('Корректно добавляет начинку', () => {
    const next = reducer(baseState, addIngredient(mainMock));

    expect(next.ingredients.length).toBe(1);
    const item = next.ingredients[0];

    expect(item._id).toBe(mainMock._id);
    expect(item.name).toBe(mainMock.name);
    expect(item.id).toBeDefined(); // nanoid сгенерировал id
  });

  it('Удаление', () => {
    const stateWithTwo = {
      bun: null,
      ingredients: [
        { ...mainMock, id: '1' },
        { ...mainMock, id: '2' }
      ]
    };

    const next = reducer(stateWithTwo, removeIngredient('1'));
    expect(next.ingredients.length).toBe(1);
    expect(next.ingredients[0].id).toBe('2');
  });

  it('Перемещение ингредиентов', () => {
    const state = {
      bun: null,
      ingredients: [
        { ...mainMock, id: '1' },
        { ...mainMock, id: '2' },
        { ...mainMock, id: '3' }
      ]
    };

    const next = reducer(
      state,
      moveIngredient({ from: 0, to: 1 })
    );

    expect(next.ingredients.map(i => i.id)).toEqual(['2', '1', '3']);
  });

  it('Сброс конструктора', () => {
    const filled = {
      bun: bunMock,
      ingredients: [{ ...mainMock, id: '1' }]
    };

    const next = reducer(filled, clearConstructor());
    expect(next).toEqual({ bun: null, ingredients: [] });
  });
});
