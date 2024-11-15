import React, {useContext, useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import Icon from "@mdi/react";
import {
	mdiAccountSchoolOutline,
	mdiArrowLeft,
	mdiBriefcaseCheckOutline,
	mdiBriefcaseRemoveOutline,
	mdiClose,
	mdiDownloadOutline,
	mdiFileSign,
	mdiPresentation,
	mdiTooltipPlusOutline
} from "@mdi/js";
import {useTranslation} from "react-i18next";
import PdfPreview from "../../../utilities/pdf/PdfPreview";
import {AuthContext} from "../../providers/AuthProvider";
import Modal from "../../../utilities/modal/Modal";
import {CvContext} from "../../providers/CvProvider";

const ViewCandidatures = () => {
	
	const {t} = useTranslation();
	const [currentCandidature, setCurrentCandidature] = useState(null);
	const [candidatures, setCandidatures] = useState([]);
	const {currentToken} = useContext(AuthContext);
	const {getCvContenuById} = useContext(CvContext)
	const [currentCV, setCurrentCV] = useState(null);
	const [isApproveModalOpen, setApproveModalOpen] = useState(false);
	const interviewDateRef = useRef(null);
	
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
				const filteredData = data.filter(c => c.candidature.etat !== "ATTEND_ENTREVUE");
				setCandidatures(filteredData);
			})
			.catch(error => console.error("Error fetching candidatures", error));
	}, [currentToken]);
	
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
	
	const handleCandidatureClick = (candidature, idCv) => {
		setCurrentCandidature(candidature);
		fetchCvById(idCv);
	};
	
	const handleApprove = () => {
		setApproveModalOpen(true);
	};
	
	const handleApproveSubmit = () => {
		const interviewDate = interviewDateRef.current.value;
		fetch(`/candidatures/approuver/${currentCandidature.id}`, {
			method: 'PUT',
			headers: {
				"Content-Type": "application/json",
				"Authorization": currentToken
			},
			body: JSON.stringify({
				dateEntrevue: interviewDate,
				etat: "ATTEND_ENTREVUE"
			})
		})
			.then(response => {
				if (response.ok) {
					console.log("Candidature approved successfully");
					setCandidatures(prevCandidatures => prevCandidatures.filter(c => c.candidature.id !== currentCandidature.id));
					setCurrentCandidature(null);
					setApproveModalOpen(false);
				} else {
					console.error("Error approving candidature");
				}
			})
			.catch(error => {
				console.error("Error approving candidature", error);
			});
	};
	
	const handleRefuse = () => {
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
						<button className="btn-option btn-selected">
							<Icon path={mdiTooltipPlusOutline} size={1}/>
							Nouvelles candidatures
						</button>
						<button className="btn-option">
							<Icon path={mdiPresentation} size={1}/>
							En Entrevue
						</button>
						<button className="btn-option">
							<Icon path={mdiFileSign} size={1}/>
							En signature Contrat
						</button>
						<button className="btn-option">
							<Icon path={mdiBriefcaseCheckOutline} size={1}/>
							Poste Accepté
						</button>
						<button className="btn-option">
							<Icon path={mdiBriefcaseRemoveOutline} size={1}/>
							Candidatures rejetées
						</button>
					</section>
				</div>
				<div className="dashboard-card" style={{width: "70%", minHeight: "70vh", maxHeight:"700px", overflowY:"auto"}}>
					<section>
						<h5>Vos Candidatures</h5>
						<div className="menu-list">
							{candidatures.map(candidature => (
								<div
									key={candidature.candidature.id}
									className={`menu-list-item`}
									onClick={() => handleCandidatureClick(candidature.candidature, candidature.cvId)}
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
			</div>
			{
				(currentCandidature !== null)?
					<div className="window-frame">
						<div className="window">
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
									(currentCV !== null && currentCV.fileUrl !== null
											?
											<PdfPreview height={300} file={currentCV.fileUrl}/>
											:
											null
									)
								}
								<br/>
								<button className="btn-option">
									<Icon path={mdiDownloadOutline} size={1}/>{t('manage_cv.buttons.download')}
								</button>
							</section>
							<hr/>
							<section className="nospace">
								<h5>Actions</h5>
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
										<h6 className="m-0">{currentCandidature.etudiantDTO ? currentCandidature.etudiantDTO.fullName : "Loading"}</h6>
									</div>

									<div className="toolbar-spacer"></div>
									<a href={"mailto:"}>
										<button>{t("discover_offers_page.contact")}</button>
									</a>
								</div>
							</section>
						</div>
					</div>
					:
					null
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
		</>
	)
}

export {ViewCandidatures};