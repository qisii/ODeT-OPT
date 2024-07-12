import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';

const PrivateRoute = ({ path, element }) => {
  const { userToken } = useStateContext();

  return userToken ? (
    <Route path={path} element={element} />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
