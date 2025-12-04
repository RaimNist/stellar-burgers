import { Navigate, useLocation } from 'react-router-dom';
import React from 'react';

import { useSelector } from '../../services/store';
import path from 'path';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth
}: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuth = useSelector((state) => state.user.isAuth);

  if (!isAuth && !onlyUnAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (isAuth && onlyUnAuth) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  return children;
};
