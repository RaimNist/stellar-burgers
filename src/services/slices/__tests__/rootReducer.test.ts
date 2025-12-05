import store from '../../store';

describe('root reducer / store initialization', () => {
  it('should initialize store with expected slices', () => {
    const state = store.getState();
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('burgerConstructor');

    expect(state.burgerConstructor).toMatchObject({
      bun: null,
      ingredients: []
    });
  });
});
