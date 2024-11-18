import React, { useContext, useEffect, useState } from 'react';
import { CandidatureContext } from '../../providers/CandidatureProvider';
import { AuthContext } from '../../providers/AuthProvider';
import GeneratePdfModal from '../../../utilities/modal/GeneratePdfModal';

const ListCandidatureEnAttenteContrat = () => {
	const { fetchCandidatureByEtatAccepteApresEntrevue, candidatures } = useContext(CandidatureContext);
	const { currentUser } = useContext(AuthContext);
	const [filteredCandidatures, setFilteredCandidatures] = useState([]);
	const [isModalOpen, setModalOpen] = useState(false);
	const [selectedCandidature, setSelectedCandidature] = useState(null);

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

	const handleSavePdf = async (candidatureId) => {
		try {
			await saveContrat(candidatureId);
			alert('PDF saved successfully!');
		} catch (error) {
			console.error('Error saving PDF:', error);
			alert('Failed to save PDF.');
		}
	};

	const handleClick = (candidature) => {
		setSelectedCandidature(candidature);
		setModalOpen(true);
	};

	const saveContrat = async (candidatureId) => {
		console.log('Saving contrat for candidature:', candidatureId);
	};

	return (
		<div>
			<h2>Candidatures en attente de contrat</h2>
			{filteredCandidatures.length === 0 ? (
				<p>No candidatures created at the moment.</p>
			) : (
				<ul>
					{filteredCandidatures.map((candidature) => (
						<button key={candidature.id} onClick={() => handleClick(candidature)}>
							{candidature.etudiantDTO.fullName} - {candidature.offreStageDTO.ownerDTO.fullName} - {candidature.offreStageDTO.nom}
						</button>
					))}
				</ul>
			)}
			{isModalOpen && (
				<GeneratePdfModal
					onClose={() => setModalOpen(false)}
					onSave={handleSavePdf}
					candidature={selectedCandidature}
				/>
			)}
		</div>
	);
};

export default ListCandidatureEnAttenteContrat;