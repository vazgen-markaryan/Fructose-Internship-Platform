import React, { useContext, useEffect, useState } from 'react';
import { CandidatureContext } from '../../providers/CandidatureProvider';
import { AuthContext } from '../../providers/AuthProvider';
import {isRouteErrorResponse} from "react-router-dom";

const ListCandidatureEnAttenteContrat = () => {
	const { fetchCandidatureByEtatAccepteApresEntrevue, candidatures } = useContext(CandidatureContext);
	const { currentUser } = useContext(AuthContext);
	const [filteredCandidatures, setFilteredCandidatures] = useState([]);
	
	useEffect(() => {
		const fetchData = async () => {
			const response = await fetchCandidatureByEtatAccepteApresEntrevue();
			if (response === undefined) {
				return;
			}
			setFilteredCandidatures(response);
		};
		fetchData();
	}, [currentUser]);
	
	return (
		<div>
			<h2>Candidatures en attente de contrat</h2>
			{filteredCandidatures.length === 0 ? (
				<p>No candidatures created at the moment.</p>
			) : (
				<ul>
					{filteredCandidatures.map((candidature) => (
						<li key={candidature.id}>
							{candidature.etudiantDTO.fullName} - {candidature.offreStageDTO.description}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default ListCandidatureEnAttenteContrat;