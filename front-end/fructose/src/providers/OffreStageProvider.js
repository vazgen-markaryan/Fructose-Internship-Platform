import React, {createContext, useContext, useEffect, useState} from 'react';
import {AuthContext} from "./AuthProvider";

const OffreStageContext = createContext(undefined);

const OffreStageProvider = ({ children }) => {
    const {currentToken} = useContext(AuthContext);
    const [offreStage, setOffreStage] = useState({
        nom: '',
        poste: '',
        description: '',
        compagnie: '',
        departementDTO: '',
        tauxHoraire: 0.0,
        typeEmploi: '',
        adresse: '',
        modaliteTravail: '',
        dateDebut: new Date(),
        dateFin: new Date(),
        nombreHeuresSemaine: 1,
        nombrePostes: 1,
        dateLimiteCandidature: new Date(),
    });
    const [errors, setErrors] = useState({});

    const fetchOffresStage = async () => {
        try {
            const response = await fetch('/get-offre-stage', {
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

    const fetchOffreStage = async (id) => {
        try {
            const response = await fetch(`/get-offre-stage/${id}`, {
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
    };

    const deleteOffreStage = async (id) => {
        return await fetch(`/delete-offre-stage/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': currentToken
            },
        });
    }

    const updateOffreStage = async (updatedData) => {
        console.log(updatedData);
        const response = await fetch(`/modifier-offre-stage`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': currentToken
            },
            body: JSON.stringify(updatedData)
        });

        // Check if the response is OK (status 2xx)
        if (response.ok) {
            // If successful, return the JSON response data
            return response.json(); // <-- No need to throw an error here
        } else {
            // If the response is not OK, handle the error
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                throw new Error(errorData.message || "An error occurred while updating the offer.");
            } else {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
        }
    };




    return (
        <OffreStageContext.Provider value={{
            offreStage,
            setOffreStage,
            errors,
            setErrors,
            fetchOffresStage,
            deleteOffreStage,
            fetchOffreStage,
            updateOffreStage
        }}>
            {children}
        </OffreStageContext.Provider>
    );
};

export { OffreStageProvider, OffreStageContext };