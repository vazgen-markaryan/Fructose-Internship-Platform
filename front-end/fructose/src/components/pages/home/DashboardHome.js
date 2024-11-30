import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../providers/AuthProvider";
import {Link, useNavigate} from "react-router-dom";
import Icon from "@mdi/react";
import {
	mdiAlertCircleOutline,
	mdiBriefcasePlusOutline,
	mdiBriefcaseRemoveOutline,
	mdiCheck,
	mdiChevronRight,
	mdiClockOutline,
	mdiClose,
	mdiCloseCircleOutline,
	mdiFileDocumentOutline,
	mdiPlus
} from "@mdi/js";
import {OffreStageContext} from "../../providers/OffreStageProvider";
import {CvContext} from "../../providers/CvProvider";
import {useTranslation} from "react-i18next";
import DashboardAdmin from "../admin/DashboardAdmin";
import OfferPreview from "../offre-stage/OfferPreview";
import {CandidatureContext} from "../../providers/CandidatureProvider";
import Swal from "sweetalert2";
import CandidatureStatus from "../candidatures/CandidatureStatus";
import {ContratContext} from "../../providers/ContratProvider";

const DashboardHome = () => {
	
	const {t} = useTranslation();
	const {currentUser} = useContext(AuthContext);
	const {GetCvs} = useContext(CvContext);
	const [cvs, setCvs] = useState([]);
	const [offresStage, setOffresStage] = useState([]);
	const [currentOffer, setCurrentOffer] = useState(null);
	const {fetchOffresStage} = useContext(OffreStageContext);
	const {deleteOffreStage} = useContext(OffreStageContext);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const {candidatures, fetchCandidaturesById, setCandidatures} = useContext(CandidatureContext);
	const [currentCandidature, setCurrentCandidature] = useState(null);
	const navigate = useNavigate();
	const {currentToken} = useContext(AuthContext)
	const {
		fetchContratByCandidatureId,
		handleSignerContrat,
		handleRefuseSignerContrat
	} = useContext(ContratContext);
	const [contrat, setContrat] = useState(null);
	
	const handleCvClick = (cv) => {
		navigate("/dashboard/manage-cvs", {state: {selectedCv: cv}});
	};
	
	const handleAcceptInterview = async () => {
		Swal.fire({
			title: t('dashboard_home_page.are_you_sure'),
			html: `${t('dashboard_home_page.proposed_interview_date_employeur')}:<br><strong>${new Date(currentCandidature.dateEntrevue).toLocaleDateString('fr-FR', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric'
			})}<br></strong> ${t('dashboard_home_page.acceptance_irreversible')}`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: t('dashboard_home_page.yes_accept'),
			cancelButtonText: t('dashboard_home_page.cancel')
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const response = await fetch(`/candidatures/modifierEtatCandidature/${currentCandidature.id}?nouvelEtat=ENTREVUE_ACCEPTE_ETUDIANT`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': currentToken
						}
					});
					if (response.ok) {
						setCurrentCandidature({
							...currentCandidature,
							etat: 'ENTREVUE_ACCEPTE_ETUDIANT'
						});
						setCandidatures(prevCandidatures => prevCandidatures.map(candidature =>
							candidature.id === currentCandidature.id ? {
								...candidature,
								etat: 'ENTREVUE_ACCEPTE_ETUDIANT'
							} : candidature
						));
						Swal.fire({
							title: t('dashboard_home_page.accepted'),
							text: t('dashboard_home_page.interview_accepted'),
							icon: 'success',
							showConfirmButton: false,
							timer: 2000
						})
					} else {
						Swal.fire({
							title: t('dashboard_home_page.error'),
							text: t('dashboard_home_page.interview_refusal_failed_acceptation'),
							icon: 'error'
						});
					}
				} catch (error) {
					Swal.fire({
						title: t('dashboard_home_page.error'),
						text: t('dashboard_home_page.interview_refusal_error_acceptation'),
						icon: 'error'
					});
				}
			}
		});
	};
	
	const handleRefuseInterview = async () => {
		Swal.fire({
			title: t('dashboard_home_page.are_you_sure'),
			text: t('dashboard_home_page.refuse_interview_warning'),
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: t('dashboard_home_page.yes_refuse'),
			cancelButtonText: t('dashboard_home_page.cancel')
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const response = await fetch(`/candidatures/modifierEtatCandidature/${currentCandidature.id}?nouvelEtat=ENTREVUE_REFUSE_ETUDIANT`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': currentToken
						}
					});
					if (response.ok) {
						setCurrentCandidature({
							...currentCandidature,
							etat: 'ENTREVUE_REFUSE_ETUDIANT'
						});
						setCandidatures(prevCandidatures => prevCandidatures.map(candidature =>
							candidature.id === currentCandidature.id ? {
								...candidature,
								etat: 'ENTREVUE_REFUSE_ETUDIANT'
							} : candidature
						));
						await Swal.fire({
							title: t('dashboard_home_page.refused'),
							text: t('dashboard_home_page.interview_refused'),
							icon: 'error',
							showConfirmButton: false,
							timer: 2000
						})
					} else {
						await Swal.fire({
							title: t('dashboard_home_page.error'),
							text: t('dashboard_home_page.interview_refusal_failed'),
							icon: 'error'
						});
					}
				} catch (error) {
					console.error("Error refusing interview:", error);
					Swal.fire({
						title: t('dashboard_home_page.error'),
						text: t('dashboard_home_page.interview_refusal_error'),
						icon: 'error'
					});
				}
			}
		});
	};
	
	const handleSignerContratClick = () => {
		handleSignerContrat(contrat, setCurrentCandidature);
	};
	
	const handleRefuseSignerContratClick = () => {
		handleRefuseSignerContrat(contrat, setCurrentCandidature);
	}
	
	useEffect(() => {
		if (currentUser) {
			(async function () {
				if (currentUser.role === "ETUDIANT") {
					try {
						const response = await GetCvs();
						const data = await response.json();
						setCvs(data);
					} catch (error) {
						console.log("Erreur lors de la récupération des CVs : " + error);
					}
					fetchCandidaturesById(currentUser.id);
				}
				
				if (currentUser.role === "EMPLOYEUR" || currentUser.role === "ETUDIANT" || currentUser.role === "PROFESSEUR") {
					try {
						const response = await fetchOffresStage();
						setOffresStage(response);
					} catch (error) {
						console.log("error" + error);
					}
				}
			})();
		}
		// TODO: Ici il donne WARNING: React Hook useEffect has a missing dependency: 'fetchCandidaturesById'.
		// Mais si le faire il va envoyer 9999 requêtes dans Inspect -> Network
	}, [currentUser, GetCvs, fetchOffresStage]);
	
	useEffect(() => {
		if (currentCandidature && currentCandidature.etat === "CONTRAT_CREE_PAR_GESTIONNAIRE") {
			const fetchContrat = async () => {
				try {
					const data = await fetchContratByCandidatureId(currentCandidature.id);
					setContrat(data);
				} catch (error) {
					console.error("Erreur " + error);
				}
			};
			fetchContrat();
		}
	}, [currentCandidature]);
	
	const handleDeleteOffreStage = async (offreStageId) => {
		try {
			const response = await deleteOffreStage(offreStageId);
			if (response.ok) {
				setOffresStage((prevOffreStages) => prevOffreStages.filter((offreStage) => offreStage.id !== offreStageId));
				setCurrentOffer(null);
			} else {
				console.error("Error deleting offre stage:", response.statusText);
			}
		} catch (error) {
			console.error("Error deleting offre stage:", error);
		}
	};
	
	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};
	
	const startIndex = (currentPage - 1) * itemsPerPage;
	const selectedOffresStage = offresStage.slice(startIndex, startIndex + itemsPerPage);
	const totalPages = Math.ceil(offresStage.length / itemsPerPage);
	
	const GetOffreStageSection = () => {
		if (currentUser != null) {
			if (currentUser.role === "ETUDIANT") {
				if (offresStage.length !== 0) {
					return (
						<section>
							<div className={"toolbar-items"}>
								<h4 className={"m-0 toolbar-spacer"}>{t("dashboard_home_page.my_offers")}</h4>
								<Link to="/dashboard/discover-offers">
									<button>{t("dashboard_home_page.explore")}
										<Icon path={mdiChevronRight} size={1}/>
									</button>
								</Link>
							</div>
							<div style={{
								"padding": "10px 0",
								display: "flex",
								gap: "10px",
								width: "100%"
							}}>
								{offresStage.reverse().slice(0, 3).map((item, index) => (
									<Link to={`/dashboard/discover-offers?offer=${item.id}`} key={index} style={{
										textDecoration: "none",
										flex: 1
									}}>
										<div className="card">
											<div className="card-image">
												<h5>{item.poste}</h5>
											</div>
											<div className="card-content">
												<p style={{
													fontSize: "11px",
													textTransform: "uppercase"
												}} className="text-dark">
													{t("programme." + item.departementDTO.nom)}
												</p>
												<p>{item.ownerDTO.companyName}</p>
												{
													(item.nombrePostes <= 5) ?
														<span className="badge text-mini"><Icon
															path={mdiAlertCircleOutline}
															size={0.5}/>{t("dashboard_home_page.limited_places")}
														</span>
														:
														<></>
												}
											</div>
										</div>
									</Link>
								))}
							</div>
						</section>
					);
				} else {
					return (
						<section>
							<div className={"toolbar-items"}>
								<h4 className={"m-0 toolbar-spacer"}>{t("dashboard_home_page.my_offers")}</h4>
								<Link to="/dashboard/discover-offers">
									<button>{t("dashboard_home_page.explore")}
										<Icon path={mdiChevronRight} size={1}/>
									</button>
								</Link>
							</div>
							<div style={{"padding": "10px 0"}}>
								<div style={{
									"width": "400px",
									"height": "320px",
									"display": "flex",
									"alignItems": "center",
									"justifyContent": "center",
									"backgroundColor": "#eee",
									"borderRadius": "5px"
								}}>
									<div style={{"textAlign": "center"}}>
										<Icon path={mdiBriefcaseRemoveOutline} size={1}/>
										<p>{t("dashboard_home_page.no_offers")}</p>
									</div>
								</div>
							</div>
						</section>
					);
				}
			} else if (currentUser.role === "EMPLOYEUR" || currentUser.role === "PROFESSEUR") {
				const startIndex = (currentPage - 1) * itemsPerPage;
				const selectedOffresStage = offresStage.slice(startIndex, startIndex + itemsPerPage);
				
				return (
					<section>
						<div className={"toolbar-items"}>
							<h4 className={"m-0 toolbar-spacer"}>{t("dashboard_home_page.offers")}</h4>
							{currentUser.role === "EMPLOYEUR" && (
								<Link to="/dashboard/creer-offre-stage">
									<button className={"btn-filled"}>
										<Icon path={mdiBriefcasePlusOutline} size={1}/>
										{t("dashboard_home_page.add_offer")}
									</button>
								</Link>
							)}
						</div>
						<div style={{"padding": "10px 0"}}>
							{offresStage.length === 0 ? (
								<div style={{
									"width": "400px",
									"display": "flex",
									"alignItems": "center",
									"backgroundColor": "#eee",
									"borderRadius": "5px",
									"gap": "5px",
									"padding": "10px"
								}}>
									<Icon path={mdiBriefcasePlusOutline} size={1}/>
									<p className="m-0">{t("dashboard_home_page.no_offers")}</p>
								</div>
							) : (
								<div style={{
									"width": "auto",
									"backgroundColor": "#eee",
									"borderRadius": "5px",
									"padding": "10px"
								}}>
									<div style={{display: "flex", gap: "20px"}}>
										<div className="menu-list" style={{
											flex: 1,
											backgroundColor: "#f9f9f9",
											borderRadius: "5px",
											padding: "10px"
										}}>
											{selectedOffresStage.map((offreStage, index) => (
												<div key={index}
												     style={{
													     display: "flex",
													     alignItems: "center",
													     gap: "10px",
													     padding: "5px",
													     borderBottom: "1px solid #ddd",
													     cursor: "pointer",
													     backgroundColor: currentOffer && currentOffer.id === offreStage.id ? "#e0e0e0" : "transparent"
												     }}
												     onClick={() => setCurrentOffer(currentOffer && currentOffer.id === offreStage.id ? null : offreStage)}>
													<Icon path={mdiBriefcasePlusOutline} size={1}/>
													{currentUser.role === "EMPLOYEUR" && offreStage && (
														<div>
															{offreStage.isApproved ? (
																<Icon path={mdiCheck} size={1} color="green"/>
															) : offreStage.isRefused ? (
																<Icon path={mdiClose} size={1} color="red"/>
															) : (
																<Icon path={mdiClockOutline} size={1} color="orange"/>
															)}
														</div>
													)}
													<p className="m-0">{offreStage.nom}</p>
												</div>
											))}
										</div>
										{currentOffer &&
											<OfferPreview
												currentOffer={currentOffer}
												handleDeleteOffreStage={handleDeleteOffreStage}
												style={{
													flex: 2,
													padding: "10px",
													backgroundColor: "#fff",
													borderRadius: "5px",
													boxShadow: "0 0 10px rgba(0,0,0,0.1)"
												}}/>}
									</div>
								</div>
							)}
							{offresStage.length > itemsPerPage && (
								<div style={{
									display: "flex",
									justifyContent: "center",
									gap: "5px",
									marginTop: "20px"
								}}>
									{Array.from({length: totalPages}, (_, index) => (
										<button
											key={index}
											className={(currentPage === index + 1) ? "btn-filled" : ""}
											onClick={() => {
												handlePageChange(index + 1);
												setCurrentOffer(null);
											}}
										>
											{index + 1}
										</button>
									))}
								</div>
							)}
						</div>
					</section>
				);
			} else if (currentUser.role === "ADMIN") {
				return (
					<DashboardAdmin/>
				);
			}
		}
	}
	
	const GetCandidatureManagementSection = () => {
		if (currentUser != null) {
			if (currentUser.role === "EMPLOYEUR") {
				return (
					<section>
						<div className={"toolbar-items"}>
							<h4 className={"m-0 toolbar-spacer"}>{t("dashboard_home_page.application")}</h4>
							<Link to="/dashboard/view-candidatures">
								<button>{t("dashboard_home_page.see")}
									<Icon path={mdiChevronRight} size={1}/>
								</button>
							</Link>
						</div>
					</section>
				);
			}
		}
	};
	
	const GetPortfolioSection = () => {
		if (currentUser != null) {
			if (currentUser.role === "ETUDIANT") {
				return (
					<section>
						<div className={"toolbar-items"}>
							<h4 className={"m-0 toolbar-spacer"}>{t("dashboard_home_page.portfolio")}</h4>
							<Link to="/dashboard/manage-cvs">
								<button>{t("dashboard_home_page.manage")}
									<Icon path={mdiChevronRight} size={1}/>
								</button>
							</Link>
							<Link to="/dashboard/upload-cv">
								<button>{t("dashboard_home_page.add_cv")}
									<Icon path={mdiPlus} size={1}/>
								</button>
							</Link>
						</div>
						<div style={{"padding": "10px 0"}}>
							{cvs.length === 0 ? (
								<div style={{
									"width": "400px",
									"display": "flex",
									"alignItems": "center",
									"backgroundColor": "#eee",
									"borderRadius": "5px",
									"gap": "5px",
									"padding": "10px"
								}}>
									<Icon path={mdiFileDocumentOutline} size={1}/>
									<p className="m-0">{t("dashboard_home_page.no_cv")}</p>
								</div>
							) : (
								<div style={{
									"display": "flex",
									"flexDirection": "column",
									"gap": "5px"
								}}>
									{cvs.map((cv, index) => (
										<div key={index} style={{
											"width": "400px",
											"display": "flex",
											"alignItems": "center",
											"backgroundColor": "#eee",
											"borderRadius": "5px",
											"padding": "10px",
											"marginBottom": "5px",
											"cursor": "pointer"
										}} onClick={() => handleCvClick(cv)}>
											<p style={{
												"margin": "0",
												"display": "flex",
												"alignItems": "center",
												"flexGrow": 1
											}}>
												<Icon path={mdiFileDocumentOutline} size={1}/>
												{cv.filename}
											</p>
											{cv.isApproved &&
												<Icon path={mdiCheck} size={1} color="green" style={{marginLeft: "5px"}}/>}
											{cv.isRefused &&
												<Icon path={mdiClose} size={1} color="red" style={{marginLeft: "5px"}}/>}
											{!cv.isApproved && !cv.isRefused &&
												<Icon path={mdiClockOutline} size={1} color="orange" style={{marginLeft: "5px"}}/>}
										</div>
									))}
								</div>
							)}
						</div>
					</section>
				)
			}
		}
	}
	
	const handleCandidatureClick = (candidature) => {
		setCurrentCandidature(candidature)
	};
	
	const GetCandidaturesWindow = () => {
		if (currentCandidature) {
			return (
				<div className="window-frame">
					<div className="window">
						<div className="window-titlebar">
							<h5>{t("dashboard_home_page.application")}</h5>
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
										<h4 className="m-0">{currentCandidature.nomOffre ? currentCandidature.nomOffre : "N/A"}</h4>
										<h6 className="m-0 text-dark">{currentCandidature.compagnie ? currentCandidature.compagnie : "N/A"}</h6>
									</div>
									<button className="btn-outline">{t("dashboard_home_page.view_offer")}</button>
								</div>
							</section>
							
							<hr/>
							
							<CandidatureStatus
								t={t}
								contrat={contrat}
								currentCandidature={currentCandidature}
								handleAcceptInterview={handleAcceptInterview}
								handleRefuseInterview={handleRefuseInterview}
								handleSignerContrat={handleSignerContratClick}
								handleRefuserContrat={handleRefuseSignerContratClick}
							/>
						
						</div>
					</div>
				</div>
			)
		}
	}
	
	const GetCandidaturesSection = () => {
		if (currentUser && currentUser.role === "ETUDIANT") {
			const sortedCandidatures = [...candidatures].sort((a, b) => {
				const statusOrder = {
					"CONTRAT_CREE_PAR_GESTIONNAIRE": 1,
					"ACCEPTE_APRES_ENTREVUE": 2,
					"ENTREVUE_ACCEPTE_ETUDIANT": 3,
					"ENTREVUE_PROPOSE": 4,
					"EN_ATTENTE": 5,
					"ENTREVUE_REFUSE_ETUDIANT": 6,
					"REFUSEE_APRES_ENTREVUE": 7,
					"REFUSEE": 8
				};
				return statusOrder[a.etat] - statusOrder[b.etat];
			});
			
			return (
				<section>
					<h4>{t("dashboard_home_page.my_applications")}</h4>
					<div>
						{sortedCandidatures.length !== 0 ? (
							<div style={{
								display: "flex",
								flexDirection: "column",
								gap: "5px"
							}}>
								{sortedCandidatures.map((candidature, index) => (
									<div key={index} style={{
										width: "400px",
										display: "flex",
										alignItems: "center",
										backgroundColor: "#eee",
										borderRadius: "5px",
										padding: "10px",
										marginBottom: "5px",
										cursor: "pointer"
									}} onClick={() => handleCandidatureClick(candidature)}>
										<p style={{
											margin: "0",
											display: "flex",
											alignItems: "center",
											flexGrow: 1
										}}>
											<b><em>{candidature.nomOffre}</em></b>&nbsp;{t("dashboard_home_page.at")}&nbsp;{candidature.compagnie}
										</p>
										{(candidature.etat === "ENTREVUE_ACCEPTE_ETUDIANT") &&
											<Icon path={mdiClockOutline} size={1} color="orange" style={{marginLeft: "5px"}}/>}
										{(candidature.etat === "ENTREVUE_PROPOSE") &&
											<Icon path={mdiClockOutline} size={1} color="blue" style={{marginLeft: "5px"}}/>}
										{(candidature.etat === "EN_ATTENTE") &&
											<Icon path={mdiClockOutline} size={1} color="orange" style={{marginLeft: "5px"}}/>}
										{(candidature.etat === "ENTREVUE_REFUSE_ETUDIANT") &&
											<Icon path={mdiCloseCircleOutline} size={1} color="red" style={{marginLeft: "5px"}}/>}
										{(candidature.etat === "REFUSEE" || candidature.etat === "REFUSEE_APRES_ENTREVUE") &&
											<Icon path={mdiCloseCircleOutline} size={1} color="red" style={{marginLeft: "5px"}}/>}
										{(candidature.etat === "ACCEPTE_APRES_ENTREVUE") &&
											<Icon path={mdiClockOutline} size={1} color="orange" style={{marginLeft: "5px"}}/>}
										{(candidature.etat === "CONTRAT_CREE_PAR_GESTIONNAIRE") &&
											<Icon path={mdiCheck} size={1} color="green" style={{marginLeft: "5px"}}/>}
									</div>
								))}
							</div>
						) : <div style={{
							width: "400px",
							display: "flex",
							alignItems: "center",
							backgroundColor: "#eee",
							borderRadius: "5px",
							gap: "5px",
							padding: "10px"
						}}>
							<Icon path={mdiFileDocumentOutline} size={1}/>
							<p className="m-0">{t("dashboard_home_page.no_applications")}</p>
						</div>}
					</div>
				</section>
			);
		}
		return null;
	};
	
	return (
		<>
			<div className="dashboard-card-titlebar">
				<h1>{t("dashboard_home_page.home")}</h1>
				<h5>{t("dashboard_home_page.hello")} {(currentUser != null) ? currentUser.fullName :
					<div className={"loading-placeholder"}></div>}
				</h5>
			</div>
			
			<div style={{"display": "flex", "gap": "20px"}}>
				<div style={{"width": "70%"}}>
					<div className="dashboard-card">
						{GetOffreStageSection()}
						{GetCandidaturesSection()}
						{GetCandidaturesWindow()}
						{GetPortfolioSection()}
						{GetCandidatureManagementSection()}
						<div style={{"height": "520px"}}>
						</div>
					</div>
				</div>
				<div style={{"width": "30%"}}>
					<div className="dashboard-card">
						<section>
							<h4>{t("dashboard_home_page.user_info")}</h4>
							<ul>
								<li>
									<p>{t("dashboard_home_page.full_name")}: {(currentUser != null) ? currentUser.fullName :
										<span className={"loading-placeholder"}></span>}
									</p>
								</li>
								<li>
									<p>{t("dashboard_home_page.email")}: {(currentUser != null) ? currentUser.email :
										<span className={"loading-placeholder"}></span>}
									</p>
								</li>
								{currentUser && currentUser.role === "ETUDIANT" && (
									<li>
										<p>{t("dashboard_home_page.studentID")}: {currentUser.matricule}</p>
									</li>
								)}
								{currentUser && currentUser.role === "PROFESSEUR" && (
									<li>
										<p>{t("dashboard_home_page.employeID")}: {currentUser.matricule}</p>
									</li>
								)}
								<li>
									<p>{t("dashboard_home_page.role")}: {(currentUser != null) ? t(`bd_role_traduction.${currentUser.role}`) :
										<span className={"loading-placeholder"}></span>}
									</p>
								</li>
							</ul>
						</section>
					</div>
				</div>
			</div>
		</>
	);
}

export default DashboardHome;