import React, {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {AuthContext} from "../../providers/AuthProvider";

const RoleRoute = ({element: Component, roles}) => {
    const {isSignedIn, currentUser} = useContext(AuthContext);
    if (!isSignedIn() || !currentUser) {return <Navigate to="/dashboard"/>;}
    return roles.includes(currentUser.role) ? Component : <Navigate to="/dashboard"/>;
};

export {RoleRoute};