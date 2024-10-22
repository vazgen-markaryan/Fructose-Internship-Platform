import React, {createContext, useContext, useEffect, useState} from 'react';
import {AuthContext} from "./AuthProvider";

const OffreStageContext = createContext(undefined);

const OffreStageProvider = ({ children }) => {

    const { currentToken } = useContext(AuthContext);

    const GetOffresStage = async () => {
        return fetch("get-offre-stage", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': currentToken
            },
        })
    };



    return (
        <OffreStageContext.Provider value={{ GetOffresStage }}>
            {children}
        </OffreStageContext.Provider>
    );
};

export { OffreStageProvider, OffreStageContext };