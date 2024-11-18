import React, {useContext, useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import Icon from "@mdi/react";
import {
	mdiAccountSchoolOutline,
	mdiArrowLeft,
	mdiBriefcaseCheckOutline,
	mdiBriefcaseRemoveOutline,
	mdiCheckCircleOutline,
	mdiClockOutline,
	mdiClose,
	mdiCloseCircleOutline,
	mdiFileSign,
	mdiHelpCircleOutline,
	mdiPresentation,
	mdiTooltipPlusOutline
} from "@mdi/js";
import {useTranslation} from "react-i18next";
import PdfPreview from "../../../utilities/pdf/PdfPreview";
import {AuthContext} from "../../providers/AuthProvider";
import Modal from "../../../utilities/modal/Modal";
import {CvContext} from "../../providers/CvProvider";
import Swal from "sweetalert2";

const ViewCandidatures = () => {
	
	const {t} = useTranslation();
	const [currentCandidature, setCurrentCandidature] = useState(null);
	const [candidatures, setCandidatures] = useState([]);
	const [filteredCandidaturesIndexes, setFilteredCandidaturesIndexes] = useState([]);
	const {currentToken} = useContext(AuthContext);
	const {getCvContenuById} = useContext(CvContext)
	const [currentCV, setCurrentCV] = useState(null);
	const [isApproveModalOpen, setApproveModalOpen] = useState(false);
	const interviewDateRef = useRef(null);
	const [candidatureCategory, setCandidatureCategory] = useState("nouvelles_candidatures")
	const [isRejectModalOpen, setRejectModalOpen] = useState(false);
	const textareaRef = useRef(null);
	
	const today = new Date();
	const minDate = new Date(today.setDate(today.getDate() + 3)).toISOString().split('T')[0];
	const maxDate = new Date(today.setMonth(today.getMonth() + 1)).toISOString().split('T')[0];
	
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
			.then(data => {
				setCandidatures(data);
			})
			.catch(error => console.error("Error fetching candidatures", error));
	}, [currentToken]);
	
	useEffect(() => {
		loadFilteredCategories(candidatureCategory);
	}, [candidatures, candidatureCategory]);
	
	const fetchCvById = async (cvId) => {
		try {
			const response = await getCvContenuById(cvId);
			const pdfBlob = await response.blob();
			const fileUrl = URL.createObjectURL(pdfBlob);
			const fileSize = pdfBlob.size;
			setCurrentCV({fileUrl: fileUrl, fileSize: fileSize});
			
		} catch (error) {
			console.error("Erreur lors de la récupération du CV:", error);
		}
	};
	
	const handleCandidatureClick = async (candidature, idCv) => {
		await fetchCvById(idCv);
		setCurrentCandidature(candidature);
	};
	
	const handleCategoryChange = (newCategory) => {
		setCandidatureCategory(newCategory)
		loadFilteredCategories(newCategory)
	}
	
	// TODO : ATTACHER CREATION DU CONTRAT ICI CAR C'EST LE BUTTON DE ACCEPTER CANDIDATURE APRES ENTREVUE
	// Principalement dans if(response.ok) { ... } AVANT SWAL.FIRE
	const handleInterviewPassed = async () => {
		Swal.fire({
			title: 'Êtes-vous sûr?',
			text: "Vous êtes sur le point d'accepter la candidature en raison de la réussite de l'entrevue. Voulez-vous continuer?",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Oui, je veux ce stagiaire!',
			cancelButtonText: 'Réviser ma décision'
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const response = await fetch(`/candidatures/modifierEtatCandidature/${currentCandidature.id}?nouvelEtat=ACCEPTE_APRES_ENTREVUE`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': currentToken
						}
					});
					
					if (response.ok) {
						const updatedItems = candidatures.map(item =>
							item.candidature.id === currentCandidature.id
								? {
									...item,
									candidature: {
										...item.candidature,
										etat: "ACCEPTE_APRES_ENTREVUE"
									}
								}
								: item
						);
						setCandidatures(updatedItems);
						loadFilteredCategories(candidatureCategory);
						setCurrentCandidature(null);
						await Swal.fire({
							title: 'Accepté!',
							text: "L'entrevue a été passée avec succès. La candidature a été acceptée.",
							icon: 'success',
							showConfirmButton: false,
							timer: 2000
						});
					} else {
						await Swal.fire({
							title: 'Erreur!',
							text: "Échec de la mise à jour de l'état de l'entrevue.",
							icon: 'error'
						});
					}
				} catch (error) {
					console.error("Error:", error);
					await Swal.fire({
						title: 'Erreur!',
						text: "Une erreur s'est produite lors de la mise à jour de l'état.",
						icon: 'error'
					});
				}
			}
		});
	};
	
	const handleInterviewFail = async () => {
		Swal.fire({
			title: 'Êtes-vous sûr?',
			text: "Vous êtes sur le point de refuser la candidature en raison de l'échec de l'entrevue. Voulez-vous continuer?",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Oui, refuser la candidature!',
			cancelButtonText: 'Reviser ma décision'
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const response = await fetch(`/candidatures/modifierEtatCandidature/${currentCandidature.id}?nouvelEtat=REFUSEE_APRES_ENTREVUE`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': currentToken
						}
					});
					
					if (response.ok) {
						const updatedItems = candidatures.map(item =>
							item.candidature.id === currentCandidature.id
								? {
									...item,
									candidature: {
										...item.candidature,
										etat: "REFUSEE_APRES_ENTREVUE"
									}
								}
								: item
						);
						setCandidatures(updatedItems);
						loadFilteredCategories(candidatureCategory);
						setCurrentCandidature(null);
						await Swal.fire({
							title: 'Refusé!',
							text: "La candidature a été refusée en raison de l'échec de l'entrevue.",
							icon: 'error',
							showConfirmButton: false,
							timer: 2000
						});
					} else {
						await Swal.fire({
							title: 'Erreur!',
							text: "Échec du refus de la candidature.",
							icon: 'error'
						});
					}
				} catch (error) {
					console.error("Error:", error);
					await Swal.fire({
						title: 'Erreur!',
						text: "Une erreur s'est produite...",
						icon: 'error'
					});
				}
			}
		});
	};
	
	const loadFilteredCategories = (category) => {
		let newFilteredCandidatures = []
		for (let i = 0; i < candidatures.length; i++) {
			let candidature = candidatures[i]
			switch (category) {
				case "nouvelles_candidatures":
					if (candidature.candidature.etat === "EN_ATTENTE") {
						newFilteredCandidatures.push(i)
					}
					break
				case "en_entrevue":
					if (candidature.candidature.etat === "ENTREVUE_PROPOSE" ||
						candidature.candidature.etat === "ENTREVUE_ACCEPTE_ETUDIANT") {
						newFilteredCandidatures.push(i)
					}
					break
				case "en_signature":
					if (candidature.candidature.etat === "CONTRAT_SIGNE_EMPLOYEUR" ||
						candidature.candidature.etat === "CONTRAT_SIGNE_ETUDIANT" ||
						candidature.candidature.etat === "ACCEPTE_APRES_ENTREVUE") {
						newFilteredCandidatures.push(i)
					}
					break
				case "accepte_total":
					if (candidature.candidature.etat === "CONTRAT_SIGNE_TOUS") {
						newFilteredCandidatures.push(i)
					}
					break
				case "rejete_total":
					if (candidature.candidature.etat === "REFUSEE" ||
						candidature.candidature.etat === "REFUSEE_APRES_ENTREVUE" ||
						candidature.candidature.etat === "CONTRAT_REFUSE_ETUDIANT" ||
						candidature.candidature.etat === "ENTREVUE_REFUSE_ETUDIANT") {
						newFilteredCandidatures.push(i)
					}
					break
				default:
					break
			}
		}
		setFilteredCandidaturesIndexes(newFilteredCandidatures)
	}
	
	const handleApprove = () => {
		setApproveModalOpen(true);
	};
	
	const handleApproveSubmit = () => {
		const interviewDate = interviewDateRef.current.value;
		
		if (!interviewDate) {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: t("view_candidatures_page.sweetalert.error_date_entrevue"),
			});
			return;
		}
		
		fetch(`/candidatures/approuver/${currentCandidature.id}`, {
			method: 'PUT',
			headers: {
				"Content-Type": "application/json",
				"Authorization": currentToken
			},
			body: JSON.stringify({
				dateEntrevue: interviewDate,
				etat: "ENTREVUE_PROPOSE"
			})
		})
			.then(response => {
				if (response.ok) {
					Swal.fire({
						icon: 'success',
						title: t("view_candidatures_page.sweetalert.approved"),
						showConfirmButton: false,
						timer: 1500
					});
					
					const updatedItems = candidatures.map(item => item.candidature.id === currentCandidature.id ? {
						...item,
						candidature: {
							...item.candidature,
							etat: "ENTREVUE_PROPOSE",
							dateEntrevue: interviewDate
						}
					} : item);
					setCandidatures(updatedItems)
					setCurrentCandidature(null);
					setApproveModalOpen(false);
				}
			})
			.catch(error => {
				console.error("Error approving candidature", error);
			});
	};
	
	const handleRefuse = () => {
		setRejectModalOpen(true);
	};
	
	const handleRejectSubmit = () => {
		const commentaireRefus = textareaRef.current.value.trim();
		if (!commentaireRefus) {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: t("view_candidatures_page.sweetalert.error_commentaire_refus"),
			});
			return;
		}
		
		fetch(`/candidatures/refuser/${currentCandidature.id}?commentaireRefus=${encodeURIComponent(commentaireRefus)}`, {
			method: 'PUT',
			headers: {
				"Content-Type": "application/json",
				"Authorization": currentToken
			}
		})
			.then(response => {
				if (response.ok) {
					setRejectModalOpen(false);
					setCurrentCandidature(null);
					
					Swal.fire({
						icon: 'success',
						title: t("view_candidatures_page.sweetalert.refused"),
						showConfirmButton: false,
						timer: 1500
					});
					
					const updatedItems = candidatures.map(item => item.candidature.id === currentCandidature.id ? {
						...item,
						candidature: {
							...item.candidature,
							etat: "REFUSEE",
							commentaireRefus: commentaireRefus
						}
					} : item);
					setCandidatures(updatedItems)
					setCurrentCandidature(null);
					setRejectModalOpen(false);
				}
			})
			.catch(error => {
				console.error("Error refusing candidature", error);
			});
	};
	
	return (
		<>
			<div className="dashboard-card-toolbar">
				<Link to="/dashboard">
					<button className="btn-icon-dashboard">
						<Icon path={mdiArrowLeft} size={1.4}/>
					</button>
				</Link>
				<h1>Gestion des Candidatures</h1>
			</div>
			<div style={{display: "flex", gap: "20px"}}>
				<div className="dashboard-card" style={{width: "30%"}}>
					<section>
						<button onClick={() => {
							handleCategoryChange("nouvelles_candidatures")
						}}
						        className={"btn-option " + ((candidatureCategory === "nouvelles_candidatures") ? "btn-selected" : "")}>
							<Icon path={mdiTooltipPlusOutline} size={1}/>
							Nouvelles candidatures
						</button>
						<button onClick={() => {
							handleCategoryChange("en_entrevue")
						}} className={"btn-option " + ((candidatureCategory === "en_entrevue") ? "btn-selected" : "")}>
							<Icon path={mdiPresentation} size={1}/>
							En Entrevue
						</button>
						<button onClick={() => {
							handleCategoryChange("en_signature")
						}} className={"btn-option " + ((candidatureCategory === "en_signature") ? "btn-selected" : "")}>
							<Icon path={mdiFileSign} size={1}/>
							En signature Contrat
						</button>
						<button onClick={() => {
							handleCategoryChange("accepte_total")
						}}
						        className={"btn-option " + ((candidatureCategory === "accepte_total") ? "btn-selected" : "")}>
							<Icon path={mdiBriefcaseCheckOutline} size={1}/>
							Poste Accepté
						</button>
						<button onClick={() => {
							handleCategoryChange("rejete_total")
						}} className={"btn-option " + ((candidatureCategory === "rejete_total") ? "btn-selected" : "")}>
							<Icon path={mdiBriefcaseRemoveOutline} size={1}/>
							Candidatures rejetées
						</button>
					</section>
				</div>
				<div className="dashboard-card"
				     style={{width: "70%", maxHeight: "550px", overflowY: "auto", height: "80vh"}}>
					<section>
						<h5>Vos Candidatures</h5>
						<div className="menu-list">
							{
								(filteredCandidaturesIndexes.length > 0) ?
									filteredCandidaturesIndexes.map(index => (
										<div
											key={candidatures[index].candidature.id}
											className={`menu-list-item`}
											onClick={() => handleCandidatureClick(candidatures[index].candidature, candidatures[index].cvId)}
										>
											<Icon path={mdiAccountSchoolOutline} size={1}/>
											<div style={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												width: "100%"
											}}>
												<div>
													<p className="m-0">{candidatures[index].etudiant.fullName}</p>
													<p className="m-0 text-dark">{candidatures[index].candidature.offreStageDTO.nom}</p>
												</div>
												{candidatures[index].candidature.etat === "ENTREVUE_ACCEPTE_ETUDIANT" && (
													<span className="badge bg-dark text-blue" style={{marginLeft: "10px"}}><strong>Action Nécessaire</strong></span>
												)}
											</div>
										</div>
									))
									:
									<>
										<div className="dashboard-placeholder-card" style={{backgroundColor: "transparent"}}>
											<div>
												<Icon path={mdiBriefcaseRemoveOutline} size={2}/>
												<h4>Aucun résultat</h4>
												<p className="text-dark">Les futures candidatures qui répondent à ce critère apparaîtront ici</p>
											</div>
										</div>
									</>
							}
						</div>
					</section>
				</div>
			</div>
			{
				(currentCandidature !== null) ?
					<div className="window-frame">
						<div className="window">
							<div className="window-titlebar">
								<h5>Candidature</h5>
								<span className="toolbar-spacer"></span>
								<button className="btn-icon" onClick={() => setCurrentCandidature(null)}>
									<Icon path={mdiClose} size={1}/>
								</button>
							</div>
							<div className="window-content">
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
											<h4 className="m-0">{currentCandidature.offreStageDTO ? currentCandidature.offreStageDTO.nom : "Loading"}</h4>
											<h6 className="m-0 text-dark">{currentCandidature.offreStageDTO ? currentCandidature.offreStageDTO.compagnie : "Loading"}</h6>
										</div>
										<button className="btn-outline">Voir Offre</button>
									</div>
								</section>
								<hr/>
								<section className="nospace">
									<h5>Profil de l'applicant</h5>
									{
										(currentCV !== null && currentCV.fileUrl !== null ?
												<PdfPreview height={300} file={currentCV.fileUrl}/>
												: null
										)
									}
									<div className="list-bullet">
										<div className="user-profile-section-profile-picture" style={{
											"background": "url('/assets/auth/default-profile.jpg') center / cover",
											width: "36px",
											height: "36px",
											margin: 0
										}}></div>
										<div>
											<h6 className="m-0">{currentCandidature.etudiantDTO ? currentCandidature.etudiantDTO.fullName : "Loading"}</h6>
											<p className="m-0 text-dark">{currentCandidature.etudiantDTO.matricule}</p>
										</div>
										
										<div className="toolbar-spacer"></div>
										<a href={"mailto:"}>
											<button>{t("discover_offers_page.contact")}</button>
										</a>
									</div>
								</section>
								
								<hr/>
								
								<section className="nospace">
									{/*SECTION CANDIDATURE INITIALE VUE EMPLOYEUR*/}
									<h5>Candidature initiale</h5>
									{
										// ÉTAT INITIALE
										(currentCandidature.etat === "EN_ATTENTE")
											?
											<div style={{gap: "10px"}} className="toolbar-items">
												<button
													className="btn-filled toolbar-spacer bg-green"
													onClick={handleApprove}
												>
													{t("manage_users_page.approve")}
												</button>
												<button
													className="btn-filled toolbar-spacer bg-red"
													onClick={handleRefuse}
												>
													Refuser
												</button>
											</div>
											:
											// SI ENTREVUE A ÉTÉ PROPOSÉE
											// SI ENTREVUE A ÉTÉ ACCEPTÉE PAR L'ÉTUDIANT
											// SI CONTRAT A ÉTÉ SIGNÉ PAR L'EMPLOYEUR
											// SI CONTRAT A ÉTÉ SIGNÉ PAR L'ÉTUDIANT
											// SI REFUSÉE APRES ENTREVUE
											// SI CONTRAT A ÉTÉ REFUSÉ PAR L'ÉTUDIANT
											// SI CONTRAT A ÉTÉ SIGNÉ PAR TOUS
											// SI ENTREVUE REFUSE PAR ETUDIANT
											// SI ETUDIANT ACCEPTE_APRES_ENTREVUE
											(currentCandidature.etat === "ENTREVUE_PROPOSE" ||
												currentCandidature.etat === "ENTREVUE_ACCEPTE_ETUDIANT" ||
												currentCandidature.etat === "CONTRAT_SIGNE_EMPLOYEUR" ||
												currentCandidature.etat === "CONTRAT_SIGNE_ETUDIANT" ||
												currentCandidature.etat === "REFUSEE_APRES_ENTREVUE" ||
												currentCandidature.etat === "CONTRAT_REFUSE_ETUDIANT" ||
												currentCandidature.etat === "CONTRAT_SIGNE_TOUS" ||
												currentCandidature.etat === "ENTREVUE_REFUSE_ETUDIANT" ||
												currentCandidature.etat === "ACCEPTE_APRES_ENTREVUE") ?
												<div className="toolbar-items">
													<Icon path={mdiCheckCircleOutline} size={1} className="text-green"/>
													<p className="text-green m-0">Approuvé</p>
												</div>
												:
												// SI CANDIDATURE A ÉTÉ REFUSÉE PAR EMPLOYEUR
												<div className="toolbar-items">
													<Icon path={mdiCloseCircleOutline} size={1} className="text-red"/>
													<p className="text-red m-0">Refusé avec le commentaire : {currentCandidature.commentaireRefus}</p>
												</div>
									}
								</section>
								
								<hr/>
								
								<section className="nospace">
									{/*SECTION ENTREVUE VUE EMPLOYEUR*/}
									<h5>Entrevue</h5>
									{
										// SI ENTREVUE A ÉTÉ PROPOSÉE
										(currentCandidature.etat === "ENTREVUE_PROPOSE") ?
											<>
												<div className="toolbar-items">
													<Icon path={mdiClockOutline} size={1} className="text-orange"/>
													<p className="text-orange m-0">En attente de la confirmation d'étudiant</p>
												</div>
												<br/>
												<p>Date de l'entrevue proposé: {currentCandidature.dateEntrevue}</p>
											</>
											:
											// SI ENTREVUE A ÉTÉ ACCEPTEE PAR ETUDIANT
											// SI CONTRAT A ÉTÉ SIGNÉ PAR L'EMPLOYEUR
											// SI CONTRAT A ÉTÉ SIGNÉ PAR L'ÉTUDIANT
											// SI REFUSÉE APRES ENTREVUE
											// SI CONTRAT A ÉTÉ REFUSÉ PAR L'ÉTUDIANT
											// SI CONTRAT A ÉTÉ SIGNÉ PAR TOUS
											// SI ETUDIANT ACCEPTE_APRES_ENTREVUE
											(currentCandidature.etat === "ENTREVUE_ACCEPTE_ETUDIANT" ||
												currentCandidature.etat === "CONTRAT_SIGNE_EMPLOYEUR" ||
												currentCandidature.etat === "CONTRAT_SIGNE_ETUDIANT" ||
												currentCandidature.etat === "REFUSEE_APRES_ENTREVUE" ||
												currentCandidature.etat === "CONTRAT_REFUSE_ETUDIANT" ||
												currentCandidature.etat === "CONTRAT_SIGNE_TOUS" ||
												currentCandidature.etat === "ACCEPTE_APRES_ENTREVUE") ?
												<>
													<div className="toolbar-items">
														<Icon path={mdiCheckCircleOutline} size={1} className="text-green"/>
														<p className="text-green m-0">Entrevue a été acceptée par l'étudiant</p>
													</div>
													<br/>
													<p>Date de l'entrevue proposé: {currentCandidature.dateEntrevue}</p>
												</>
												:
												// SI CANDIDATURE A ÉTÉ REFUSÉE
												(currentCandidature.etat === "REFUSEE") ?
													<div className="toolbar-items">
														<Icon path={mdiCloseCircleOutline} size={1} className="text-dark"/>
														<p className="text-dark m-0">L'entrevue ne peut être planifiée pour une candidature refusée</p>
													</div>
													:
													// SI ENTREVUE REFUSE PAR ETUDIANT
													(currentCandidature.etat === "ENTREVUE_REFUSE_ETUDIANT") ?
														<>
															<div className="toolbar-items">
																<Icon path={mdiCheckCircleOutline} size={1} className="text-red"/>
																<p className="text-red m-0">Entrevue a été refusée par l'étudiant</p>
															</div>
															<br/>
															<p>Date de l'entrevue proposé: {currentCandidature.dateEntrevue}</p>
														</>
														:
														// TOMBE EN DEFAULT ÉTAT INITIALE
														<div className="toolbar-items">
															<Icon path={mdiHelpCircleOutline} size={1} className="text-dark"/>
															<p className="text-dark m-0">En attente de la candidature initiale</p>
														</div>
									}
								</section>
								
								<hr/>
								
								<section className="nospace">
									{/*SECTION CONTRAT VUE EMPLOYEUR*/}
									<h5>Contrat</h5>
									{
										// SI CANDIDATURE A ÉTÉ REFUSÉE
										(currentCandidature.etat === "REFUSEE") ?
											<>
												<div className={"toolbar-items"}>
													<Icon path={mdiCloseCircleOutline} size={1} className="text-dark"/>
													<p className="text-dark m-0">Le contrat ne peut être signé pour une candidature refusée</p>
												</div>
											</>
											:
											// SI ENTREVUE A ÉTÉ ACCEPTEE PAR ETUDIANT
											(currentCandidature.etat === "ENTREVUE_ACCEPTE_ETUDIANT") ?
												<>
													<div className="toolbar-items" style={{gap: "10px"}}>
														<button className="btn-filled bg-green" onClick={handleInterviewPassed}>
															Accepter
														</button>
														<button className="btn-filled bg-red" onClick={handleInterviewFail}>
															Refuser
														</button>
													</div>
												</>
												:
												// SI CONTRAT A ÉTÉ SIGNÉ PAR L'ÉTUDIANT
												(currentCandidature.etat === "CONTRAT_SIGNE_ETUDIANT") ?
													<>
														<div className="toolbar-items">
															<Icon path={mdiCheckCircleOutline} size={1} className="text-green"/>
															<p className="text-green m-0">Contrat a été bien signé par l'étudiant</p>
														</div>
														<div className="toolbar-items">
															<Icon path={mdiHelpCircleOutline} size={1} className="text-orange"/>
															<p className="text-orange m-0">En attente de la signature du Gestionnaire de Stage</p>
														</div>
													</>
													:
													// SI CONTRAT A ÉTÉ SIGNÉ PAR L'EMPLOYEUR
													(currentCandidature.etat === "CONTRAT_SIGNE_EMPLOYEUR") ?
														<>
															<div className={"toolbar-items"}>
																<Icon path={mdiHelpCircleOutline} size={1} className="text-orange"/>
																<p className="text-orange m-0">En attente de la signature de l'étudiant</p>
															</div>
														</> :
														// SI ETUDIANT ACCEPTE_APRES_ENTREVUE
														(currentCandidature.etat === "ACCEPTE_APRES_ENTREVUE") ?
															<>
																{/*Si contrat pas genere afficher cela*/}
																<div className={"toolbar-items"}>
																	<Icon path={mdiHelpCircleOutline} size={1} className="text-orange"/>
																	<p className="text-orange m-0">En attente de la génération du Contrat par Gestionnaire</p>
																</div>
																{/*SI contrat genere afficher cela*/}
																
																{/*<div className="toolbar-items" style={{gap: "10px"}}>*/}
																{/*	<button className="btn-filled bg-green" onClick={SIGNER}>*/}
																{/*		SIGNER*/}
																{/*	</button>*/}
																{/*	<button className="btn-filled bg-red" onClick={PAS SIGNER}>*/}
																{/*		PAS SIGNER*/}
																{/*	</button>*/}
																{/*</div>*/}
																
																{/*TODO FAIRE MEME SHIT DANS DASHBOARD HOME POUR EMPLOYEUR*/}
															</>
															:
															// SI REFUSÉE APRES ENTREVUE
															(currentCandidature.etat === "REFUSEE_APRES_ENTREVUE") ?
																<>
																	<div className={"toolbar-items"}>
																		<Icon path={mdiHelpCircleOutline} size={1} className="text-red"/>
																		<p className="text-red m-0">Le contrat ne peut être signé. La candidature était refusée après l'entrevue</p>
																	</div>
																</>
																:
																// SI CONTRAT A ÉTÉ REFUSÉ PAR L'ÉTUDIANT
																(currentCandidature.etat === "CONTRAT_REFUSE_ETUDIANT") ?
																	<>
																		<div className={"toolbar-items"}>
																			<Icon path={mdiHelpCircleOutline} size={1} className="text-red"/>
																			<p className="text-red m-0">La signature du contrat a été refusée par Étudiant</p>
																		</div>
																	</>
																	:
																	// SI CONTRAT A ÉTÉ SIGNÉ PAR TOUS
																	(currentCandidature.etat === "CONTRAT_SIGNE_TOUS") ?
																		<>
																			<div className={"toolbar-items"}>
																				<Icon path={mdiHelpCircleOutline} size={1} className="text-green"/>
																				<p className="text-green m-0">Tout le monde a signé le contrat. La candidature a été acceptée</p>
																			</div>
																		</>
																		:
																		// SI ETUDIANT A REFUSÉ L'ENTREVUE
																		(currentCandidature.etat === "ENTREVUE_REFUSE_ETUDIANT") ?
																			<>
																				<div className={"toolbar-items"}>
																					<Icon path={mdiHelpCircleOutline} size={1} className="text-dark"/>
																					<p className="text-dark m-0">Le contrat ne peut être signé. L'entrevue a été refusée par l'étudiant</p>
																				</div>
																			</>
																			:
																			// TOMBE EN DEFAULT ÉTAT INITIALE
																			< div className="toolbar-items">
																				<Icon path={mdiHelpCircleOutline} size={1} className="text-dark"/>
																				<p className="text-dark m-0">En attente des résultats de l'entrevue</p>
																			</div>
									}
									<br></br>
								</section>
							</div>
						</div>
					</div>
					: null
			}
			{isApproveModalOpen && (
				<Modal onClose={() => setApproveModalOpen(false)} onSend={handleApproveSubmit}>
					<h4>{t("view_candidatures_page.interview_date")}</h4>
					<input type="date" ref={interviewDateRef} min={minDate} max={maxDate} style={{
						width: "100%",
						height: "30px"
					}}/>
				</Modal>
			)}
			
			{isRejectModalOpen && (
				<Modal onClose={() => setRejectModalOpen(false)} onSend={handleRejectSubmit}>
					<h4>{t("modal.reject_reason")}</h4>
					<textarea
						ref={textareaRef}
						placeholder={t("modal.reject_reason_placeholder")}
						style={{
							width: "100%",
							height: "100px"
						}}
					/>
				</Modal>
			)}
		</>
	);
}

export {ViewCandidatures};