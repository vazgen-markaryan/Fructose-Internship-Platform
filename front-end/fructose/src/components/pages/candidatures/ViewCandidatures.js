import {Link} from "react-router-dom";
import Icon from "@mdi/react";
import {mdiAccountSchoolOutline, mdiArrowLeft, mdiClose, mdiDownloadOutline} from "@mdi/js";
import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import PdfPreview from "../../../utilities/pdf/PdfPreview";
import {AuthContext} from "../../providers/AuthProvider";

const ViewCandidatures = () => {
	const {t} = useTranslation();
	const [currentCandidature, setCurrentCandidature] = useState({});
	const [candidatures, setCandidatures] = useState([]);
	const {currentToken} = useContext(AuthContext);
	
	useEffect(() => {
		fetch("/candidatures/candidaturesEmployeur", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": currentToken
			}
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then(data => setCandidatures(data))
			.catch(error => console.error("Error fetching candidatures", error));
	}, [currentToken]);
	
	return (
		<>
			<div className="dashboard-card-toolbar">
				<Link to="/dashboard">
					<button className="btn-icon-dashboard">
						<Icon path={mdiArrowLeft} size={1.4}/>
					</button>
				</Link>
				<h1>Vos Candidatures</h1>
			</div>
			<div style={{display: "flex", gap: "20px"}}>
				<div className="dashboard-card" style={{width: "60%"}}>
					<section>
						<h5>Vos Candidatures</h5>
						<div className="menu-list">
							{candidatures.map(candidature => (
								<div
									key={candidature.candidature.id}
									className={`menu-list-item ${currentCandidature.id === candidature.candidature.id ? 'menu-list-item-selected' : ''}`}
									onClick={() => setCurrentCandidature(candidature.candidature)}
								>
									<Icon path={mdiAccountSchoolOutline} size={1}/>
									<div>
										<p className="m-0">{candidature.etudiant.fullName}</p>
										<p className="m-0">{candidature.etudiant.matricule}</p>
										</div>
								</div>
							))}
						</div>
					</section>
				</div>
				<div className="dashboard-card" style={{width: "40%"}}>
					<div className="toolbar-items" style={{padding: "10px 10px 10px 16px"}}>
						<span className="toolbar-spacer"></span>
						<button className="btn-icon" onClick={() => setCurrentCandidature(null)}>
							<Icon path={mdiClose} size={1}/>
						</button>
					</div>
					
					<section className="nospace">
						<div className="toolbar-items" style={{gap: "8px"}}>
							<div className="user-profile-section-profile-picture" style={{
								"background": "url('/assets/offers/default-company.png') center / cover",
								width: "52px",
								height: "52px",
								borderRadius: "5px",
								margin: 0
							}}></div>
							<div className="toolbar-spacer">
								<h4 className="m-0">{currentCandidature.nom}</h4>
								<h6 className="m-0 text-dark">{currentCandidature.compagnie}</h6>
							</div>
							<button className="btn-outline">Voir Offre</button>
						</div>
					</section>
					<hr/>
					<section className="nospace">
						<h5>Profil de l'applicant</h5>
						<PdfPreview height={300} file={null}/>
						<br/>
						<button className="btn-option">
							<Icon path={mdiDownloadOutline} size={1}/>{t('manage_cv.buttons.download')}
						</button>
					</section>
					<hr/>
					<section className="nospace">
						<h5>Actions</h5>
						<div style={{
							gap: "10px"
						}}
						     className="toolbar-items">
							<button
								className="btn-filled toolbar-spacer bg-green"
								onClick={() => {
									fetch(`/candidatures/approuver/${currentCandidature.id}`, {
										method: 'PUT',
										headers: {
											"Content-Type": "application/json",
											"Authorization": currentToken
										}
									})
										.then(response => {
											if (response.ok) {
												console.log("Candidature approved successfully");
											} else {
												console.error("Error approving candidature");
											}
										})
										.catch(error => {
											console.error("Error approving candidature", error);
										});
								}}
							>
								{t("manage_users_page.approve")}
							</button>
							<button
								className="btn-filled toolbar-spacer bg-red"
								onClick={() => {
									const commentaireRefus = prompt("Please enter the refusal comment:");
									if (commentaireRefus) {
										fetch(`/candidatures/refuser/${currentCandidature.id}?commentaireRefus=${encodeURIComponent(commentaireRefus)}`, {
											method: 'PUT',
											headers: {
												"Content-Type": "application/json",
												"Authorization": currentToken
											}
										})
											.then(response => {
												if (response.ok) {
													console.log("Candidature refused successfully");
												} else {
													console.error("Error refusing candidature");
												}
											})
											.catch(error => {
												console.error("Error refusing candidature", error);
											});
									}
								}}
							>
								Refuser
							</button>
						</div>
					</section>
					<hr/>
					<section className="nospace">
						<div className="list-bullet">
							<div className="user-profile-section-profile-picture" style={{
								"background": "url('/assets/auth/default-profile.jpg') center / cover",
								width: "36px",
								height: "36px",
								margin: 0
							}}></div>
							<div>
								<h6 className="m-0">{currentCandidature.nom}</h6>
								<p className="m-0 text-dark">{currentCandidature.id}</p>
							</div>
							
							<div className="toolbar-spacer"></div>
							<a href={"mailto:"}>
								<button>{t("discover_offers_page.contact")}</button>
							</a>
						</div>
					</section>
				</div>
			</div>
		</>
	)
}

export {ViewCandidatures};