import React, {createContext, useContext} from 'react';
import {AuthContext} from "./AuthProvider";

const CandidatureContext = createContext(undefined);

const CandidatureProvider = ({children}) => {
	
	const {currentToken} = useContext(AuthContext);
	
	const ApplyOffreStage = async (id, cvId) => {
		return await fetch(`/candidatures/postuler`, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				'Authorization': currentToken
			},
			body: JSON.stringify({
				offreStageId: id,
				cvId: cvId
			})
		});
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