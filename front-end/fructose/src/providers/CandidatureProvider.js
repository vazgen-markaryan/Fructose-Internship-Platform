import React, {createContext, useContext, useState} from 'react';
import {AuthContext} from "./AuthProvider";

const CandidatureContext = createContext(undefined);

const CandidatureProvider = ({children}) => {

    const {currentToken} = useContext(AuthContext);

    const ApplyOffreStage = async (id) => {
        try {
            const response = await fetch(`/get-offre-stage/${id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': currentToken
                },
            });
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error("Erreur: ", error);
        }
    };



    return (
        <CandidatureContext.Provider value={{
            ApplyOffreStage
        }}>
            {children}
        </CandidatureContext.Provider>
    );
};

export {CandidatureProvider, CandidatureContext};