import reducer, {
  setUser,
  loginUser,
  registerUser,
  getUser,
  updateUser,
  logoutUser
} from '../userSlice';

const mockUser = {
  email: 'test@mail.ru',
  name: 'Тест'
};

describe('userSlice', () => {
  const initialState = {
    isLoading: false,
    user: null,
    error: null,
    isAuth: false
  };

  describe('setUser', () => {
    it('setUser', () => {
      const next = reducer(initialState, setUser(mockUser));
      expect(next.user).toEqual(mockUser);
      expect(next.isAuth).toBe(true);
    });

    it('setUser(null)', () => {
      const state = { ...initialState, user: mockUser, isAuth: true };
      const next = reducer(state, setUser(null));
      expect(next.user).toBeNull();
      expect(next.isAuth).toBe(false);
    });
  });

  describe('loginUser', () => {
    it('pending', () => {
      const next = reducer(initialState, loginUser.pending('', { email: '', password: '' }));
      expect(next.isLoading).toBe(true);
      expect(next.error).toBeNull();
    });

    it('fulfilled', () => {
      const next = reducer(initialState, loginUser.fulfilled(mockUser, '', { email: '', password: '' }));
      expect(next.isLoading).toBe(false);
      expect(next.user).toEqual(mockUser);
      expect(next.isAuth).toBe(true);
    });

    it('rejected', () => {
      const next = reducer(initialState, loginUser.rejected(new Error('err'), '', { email: '', password: '' }, 'err'));
      expect(next.isLoading).toBe(false);
      expect(next.error).toBe('err');
    });
  });

  describe('registerUser', () => {
    it('pending', () => {
      const next = reducer(initialState, registerUser.pending('', { email: '', password: '', name: '' }));
      expect(next.isLoading).toBe(true);
    });

    it('fulfilled', () => {
      const next = reducer(initialState, registerUser.fulfilled(
        mockUser,
        '',
        { email: '', password: '', name: '' }
      ));
      expect(next.user).toEqual(mockUser);
      expect(next.isAuth).toBe(true);
    });

    it('rejected', () => {
      const next = reducer(initialState, registerUser.rejected(
        new Error('err'),
        '',
        { email: '', password: '', name: '' },
        'err'
      ));
      expect(next.error).toBe('err');
    });
  });

  describe('getUser', () => {
    it('pending', () => {
      const next = reducer(initialState, getUser.pending(''));
      expect(next.isLoading).toBe(true);
    });

      it('fulfilled', () => {
      const next = reducer(initialState, getUser.fulfilled(mockUser, '', undefined));
      expect(next.user).toEqual(mockUser);
      expect(next.isAuth).toBe(true);
    });

      it('rejected', () => {
      const next = reducer(initialState, getUser.rejected(new Error('err'), '', undefined, 'err'));
      expect(next.error).toBe('err');
    });
  });

  describe('updateUser', () => {
    it('pending', () => {
      const next = reducer(initialState, updateUser.pending('', {}));
      expect(next.isLoading).toBe(true);
    });

    it('fulfilled', () => {
      const start = { ...initialState, user: { email: 'old', name: 'old' } };
      const next = reducer(start, updateUser.fulfilled(mockUser, '', {}));
      expect(next.user).toEqual(mockUser);
    });

    it('rejected', () => {
      const next = reducer(initialState, updateUser.rejected(new Error('err'), '', {}, 'err'));
      expect(next.error).toBe('err');
    });
  });

  describe('logoutUser', () => {
    it('pending', () => {
      const next = reducer(initialState, logoutUser.pending(''));
      expect(next.isLoading).toBe(true);
    });

    it('fulfilled', () => {
      const start = { ...initialState, user: mockUser, isAuth: true };
      const next = reducer(start, logoutUser.fulfilled(undefined, '', undefined));
      expect(next.user).toBeNull();
      expect(next.isAuth).toBe(false);
  });

    it('rejected', () => {
      const next = reducer(initialState, logoutUser.rejected(new Error('err'), '', undefined, 'err'));
      expect(next.error).toBe('err');
    });
  }); 
});
