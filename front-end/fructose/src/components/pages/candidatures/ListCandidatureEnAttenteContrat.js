import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CandidatureContext } from "../../providers/CandidatureProvider";
import { AuthContext } from "../../providers/AuthProvider";

const ViewCandidaturesEtatAccepteApresEntrevue = () => {
	const { t } = useTranslation();
	const { fetchCandidatureByEtatAccepteApresEntrevue } = useContext(CandidatureContext);
	const { currentUser } = useContext(AuthContext);
	const [candidatures, setCandidatures] = useState([]);
	
	useEffect(() => {
		const loadCandidatures = async () => {
			try {
				const fetchedCandidatures = await fetchCandidatureByEtatAccepteApresEntrevue();
				console.log('Fetched Candidatures:', fetchedCandidatures);
				setCandidatures(fetchedCandidatures);
			} catch (error) {
				console.error('Error fetching candidatures:', error);
			}
		};
		loadCandidatures();
	}, [fetchCandidatureByEtatAccepteApresEntrevue]);
	
	
	return (
		<>
			<h1>{t('candidatures')}</h1>
			{candidatures.length === 0 ? (
				<p>No contracts created at the moment.</p>
			) : (
				<ul>
					{candidatures.map((candidature) => (
						<li key={candidature.id}>
							<h2>{candidature.offreStage.titre}</h2>
						</li>
					))}
				</ul>
			)}
		</>
	);
};

export default ViewCandidaturesEtatAccepteApresEntrevue;