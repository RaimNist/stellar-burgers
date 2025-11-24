import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '../../services/slices/feedSlice';

import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const feed = useSelector((state) => state.feed);
  const ingredientsLoaded = useSelector(
    (state) => state.ingredients.items.length
  );

  const getFeeds = useCallback(() => {
    dispatch(fetchFeed());
    if (!ingredientsLoaded) {
      dispatch(fetchIngredients());
    }
  }, [dispatch]);

  useEffect(() => {
    getFeeds();
  }, [getFeeds]);

  const orders: TOrder[] = feed.orders;

  if (feed.isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={getFeeds} />;
};
