import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useSelector, useDispatch } from '../../services/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { createOrder } from '../../services/slices/ordersSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);
  const orders = useSelector((state) => state.orders);
  const isAuth = useSelector((state) => state.user.isAuth);

  const constructorItems = {
    bun: bun,
    ingredients: ingredients || []
  };

  const orderRequest = orders.isLoading;

  const orderModalData = orders.orders.length
    ? orders.orders[orders.orders.length - 1]
    : null;

  const onOrderClick = () => {
    if (!isAuth) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (!bun) {
      return;
    }

    const ids: string[] = [];
    ids.push(bun._id);
    ingredients.forEach((it: TConstructorIngredient) => ids.push(it._id));
    ids.push(bun._id);

    dispatch(createOrder(ids));

    navigate(location.pathname, {
      state: { ...location.state, showOrderModal: true }
    });
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  const closeOrderModal = () => {
    navigate(location.pathname, {
      state: { ...location.state, showOrderModal: false }
    });
  };

  const shouldShowModal = location.state?.showOrderModal;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={shouldShowModal ? orderModalData : null}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
