import React, {createContext, useContext, useEffect, useState} from 'react';
import {AuthContext} from "./AuthProvider";

const OffreStageContext = createContext(undefined);

const OffreStageProvider = ({ children }) => {

    const { currentToken } = useContext(AuthContext)


    return (
        <OffreStageContext.Provider value={{}}>
            {children}
        </OffreStageContext.Provider>
    );
};

export { OffreStageProvider, OffreStageContext };