import {AuthContext} from "./AuthProvider";
import React, {useContext} from "react";

const ContratContext = React.createContext(undefined);

const ContratProvider = ({children}) => {
    const {currentToken} = useContext(AuthContext);

    const fetchContrats = async () => {
        try {
            const response = await fetch('/api/contrats', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': currentToken
                },
            });
            if (response.ok) {
                return await response.json();
            }
            return [];
        } catch (error) {
            return [];
        }
    }
    return (
        <ContratContext.Provider value={{
            fetchContrats
        }}>
            {children}
        </ContratContext.Provider>
    );
};

export {ContratProvider, ContratContext};