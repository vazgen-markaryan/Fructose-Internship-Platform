import {AuthContext} from "./AuthProvider";
import React, {useContext} from "react";

const ContratContext = React.createContext(undefined);

const ContratProvider = ({children}) => {
    const {currentToken} = useContext(AuthContext);

        const fetchContratByCandidatureId = async (id) => {
        return await fetch(`/contrats/candidatures/${id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': currentToken
            }
        });
    }

    const fetchPdf = async (candidatureId) => {
        const response = await fetch(`/contrats/generate/${candidatureId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': currentToken
            },
        });
        const pdfBlob = await response.blob();
        return URL.createObjectURL(pdfBlob);
    };

    return (
        <ContratContext.Provider value={{
            fetchContratByCandidatureId,
            fetchPdf
        }}>
            {children}
        </ContratContext.Provider>
    );
};

export {ContratProvider, ContratContext};