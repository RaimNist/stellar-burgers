import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

import { useSelector, useDispatch } from '../../services/store';
import { useParams } from 'react-router-dom';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id } = useParams();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.ingredients.items);
  const ingredientData = items.find((item) => item._id === id);

  useEffect(() => {
    if (!items || items.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, items]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
