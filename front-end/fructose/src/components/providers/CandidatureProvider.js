import React, {createContext, useContext, useState} from 'react';
import {AuthContext} from "./AuthProvider";

const CandidatureContext = createContext(undefined);

const CandidatureProvider = ({children}) => {
	const {currentToken} = useContext(AuthContext);
	const [candidatures, setCandidatures] = useState([]);
	
	const fetchCandidaturesById = async (id) => {
		try {
			const response = await fetch(`/candidatures/etudiant/${id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': currentToken
				},
			});
			if (response.ok) {
				const data = await response.json();
				setCandidatures(data);
			} else {
				throw new Error('Failed to fetch candidatures');
			}
		} catch (error) {
			console.error("Erreur " + error);
		}
	};
	
	
	return (
		<CandidatureContext.Provider value={{candidatures, fetchCandidaturesById}}>
			{children}
		</CandidatureContext.Provider>
	);
};

export {CandidatureProvider, CandidatureContext};