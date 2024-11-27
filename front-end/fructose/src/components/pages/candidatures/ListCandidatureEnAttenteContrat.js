import React, {useContext, useEffect, useState} from 'react';
import {CandidatureContext} from '../../providers/CandidatureProvider';
import {AuthContext} from '../../providers/AuthProvider';
import GeneratePdfModal from '../../../utilities/modal/GeneratePdfModal';
import {mdiBriefcasePlusOutline} from "@mdi/js";
import Icon from "@mdi/react";
import {t} from "i18next";

const ListCandidatureEnAttenteContrat = () => {
	const {fetchCandidatureByEtatAccepteApresEntrevue} = useContext(CandidatureContext);
	const {currentToken} = useContext(AuthContext);
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
	}, [selectedCandidature]);
	
	const handleClick = (candidature) => {
		setSelectedCandidature(candidature);
		setModalOpen(true);
	};
	
	const handleSaveContrat = async () => {
		const response = await fetch(`/contrats`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': currentToken
				},
				body: JSON.stringify(selectedCandidature)
			}
		);
		if (response.ok) {
			console.log('Contrat created successfully');
			const response = await fetch(`/candidatures/modifierEtatCandidature/${selectedCandidature.id}?nouvelEtat=CONTRAT_CREE_PAR_GESTIONNAIRE`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': currentToken
				}
			});
		} else {
			console.error('Error creating contrat');
		}
		setModalOpen(false);
		setSelectedCandidature(null);
	};
	
	return (
		<section style={{padding: 0}}>
			<h4 className={"m-0 toolbar-spacer"}>{t("manage_contract_en_attente.title")}</h4>
			{filteredCandidatures.length === 0 ? (
				<div style={{
					width: "400px",
					display: "flex",
					alignItems: "center",
					backgroundColor: "#eee",
					borderRadius: "5px",
					gap: "5px",
					padding: "10px"
				}}>
					<Icon path={mdiBriefcasePlusOutline} size={1}/>
					<p className="m-0">{t("manage_offre_stage.messages.no_offre_stages_contracts")}</p>
				</div>
			) : (
				<section className="menu-list" style={{padding: 0, marginTop: 15}}>
					{filteredCandidatures.map((candidature, index) => (
						<div key={index} onClick={() => handleClick(candidature)}
						     className={`menu-list-item ${selectedCandidature && candidature.id === selectedCandidature.id ? "menu-list-item-selected" : ""}`}>
							<Icon path={mdiBriefcasePlusOutline} size={1}/>
							<div>
								<p className="m-0">{candidature.etudiantDTO.fullName} - {candidature.offreStageDTO.ownerDTO.fullName} - {candidature.offreStageDTO.nom}</p>
							</div>
						</div>
					))}
				</section>
			)}
			{isModalOpen && (
				<GeneratePdfModal
					onClose={() => setModalOpen(false)}
					onSave={handleSaveContrat}
					candidatureId={selectedCandidature.id}
				/>
			)}
		</section>
	);
};

export default ListCandidatureEnAttenteContrat;