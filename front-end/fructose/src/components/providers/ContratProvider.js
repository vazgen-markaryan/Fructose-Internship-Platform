import {AuthContext} from "./AuthProvider";
import React, {useContext} from "react";

const ContratContext = React.createContext(undefined);

const ContratProvider = ({children}) => {
    const {currentToken} = useContext(AuthContext);

    const fetchContratByCandidatureId = async (id) => {
        try {
            const response = await fetch(`/contrats/candidatures/${id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': currentToken
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching contrat:', error);
            throw error;
        }
    };

    const fetchPdf = async (candidatureId) => {
        const response = await fetch(`/contrats/generate/${candidatureId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': currentToken
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const pdfBlob = await response.blob();
        return URL.createObjectURL(pdfBlob);
    };

    const fetchPdfByContratId = async (contratId) => {
        const response = await fetch(`/contrats/${contratId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': currentToken
            },
        });
        const pdfBlob = await response.blob();
        return URL.createObjectURL(pdfBlob);
    }

    const signContract = async (contratId) => {
        const response = await fetch(`/contrats/${contratId}/signer`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': currentToken
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    };

    return (
        <ContratContext.Provider value={{
            fetchContratByCandidatureId,
            fetchPdf,
            fetchPdfByContratId,
            signContract
        }}>
            {children}
        </ContratContext.Provider>
    );
};

export {ContratProvider, ContratContext};