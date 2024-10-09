import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from "../../providers/AuthProvider";

const PrivateRoute = ({ element: Component, ...rest }) => {
    const { isSignedIn } = useContext(AuthContext);
    return isSignedIn() ? Component : <Navigate to="/connexion" />;
};

export default PrivateRoute;