import React, {createContext, useContext, useEffect, useState} from 'react';
import {AuthContext} from "./AuthProvider";

const AdminContext = createContext(undefined);

const AdminProvider = ({children}) => {
    const {currentToken} = useContext(AuthContext)

    const GetUnapprovedUsers = async () => {
        return fetch('/non-approved-users', {
            method: 'GET',
            headers: {
                'Authorization': currentToken
            },
        })
    };


    return (
        <AdminContext.Provider value={{GetUnapprovedUsers, }}>
            {children}
        </AdminContext.Provider>
    );
};

export {AdminProvider, AdminContext};