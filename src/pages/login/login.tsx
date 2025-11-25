import { FC, SyntheticEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';
import { LoginUI } from '@ui-pages';
import { useForm } from '../../hooks/useForm';

export const Login: FC = () => {
  const { values, handleChange } = useForm({ email: '', password: '' });
  const { email, password } = values;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const error = useSelector((state) => state.user.error);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={(v: string) => {
        handleChange({
          target: { name: 'email', value: v }
        } as React.ChangeEvent<HTMLInputElement>);
      }}
      password={password}
      setPassword={(v: string) => {
        handleChange({
          target: { name: 'password', value: v }
        } as React.ChangeEvent<HTMLInputElement>);
      }}
      handleSubmit={handleSubmit}
    />
  );
};
