import React, {useContext} from 'react';
import Icon from '@mdi/react';
import {mdiCheckCircleOutline, mdiClockOutline, mdiCloseCircleOutline, mdiHelpCircleOutline} from '@mdi/js';
import {AuthContext} from "../../providers/AuthProvider";

const CandidatureStatus = ({
	                           currentCandidature,
	                           t,
	                           handleApprove,
	                           handleRefuse,
	                           handleInterviewPassed,
	                           handleInterviewFail,
	                           handleAcceptInterview,
	                           handleRefuseInterview,
	                           handleSignerContrat,
	                           handleRefuserContrat
                           }) => {
	
	const {currentUser} = useContext(AuthContext);
	const isEmployeur = currentUser.role === 'EMPLOYEUR';
	
	return (
		<div>
			{/* SECTION CANDIDATURE INITIALE */}
			<section className="nospace">
				<h5>{t("view_candidatures_page.initial_application")}</h5>
				{
					// SI CANDIDATURE EST EN ATTENTE
					currentCandidature.etat === "EN_ATTENTE" ? (
							// VUE EMPLOYEUR
							isEmployeur ? (
									<div style={{gap: "10px"}} className="toolbar-items">
										<button className="btn-filled toolbar-spacer bg-green" onClick={handleApprove}>
											{t("manage_users_page.approve")}
										</button>
										<button className="btn-filled toolbar-spacer bg-red" onClick={handleRefuse}>
											{t("view_candidatures_page.refuse")}
										</button>
									</div>
								)
								: // VUE ETUDIANT
								(
									<div className="toolbar-items">
										<Icon path={mdiClockOutline} size={1} className="text-orange"/>
										<p className="text-orange m-0">{t("dashboard_home_page.waiting_employer_response")}</p>
									</div>
								
								)
						)
						: // SI TOUS CES CAS QUE TU VOIS ENTRE [ ... ]
						["ENTREVUE_PROPOSE", "ENTREVUE_ACCEPTE_ETUDIANT", "ENTREVUE_REFUSE_ETUDIANT", "CONTRAT_SIGNE_EMPLOYEUR", "CONTRAT_REFUSE_ETUDIANT", "CONTRAT_SIGNE_ETUDIANT", "CONTRAT_REFUSE_TOUS", "REFUSEE_APRES_ENTREVUE", "ACCEPTE_APRES_ENTREVUE"].includes(currentCandidature.etat) ? (
								// VUE EMPLOYEUR ET ETUDIANT
								<div className="toolbar-items">
									<Icon path={mdiCheckCircleOutline} size={1} className="text-green"/>
									<p className="text-green m-0">{t("view_candidatures_page.approved")}</p>
								</div>
							)
							: // SI CANDIDATURE A ÉTÉ REFUSÉE
							(
								<div className="toolbar-items">
									<Icon path={mdiCloseCircleOutline} size={1} className="text-red"/>
									<p className="text-red m-0">{t("view_candidatures_page.refused_with_comment", {comment: currentCandidature.commentaireRefus})}</p>
								</div>
							)}
			</section>
			<hr/>
			
			{/* SECTION ENTREVUE */}
			<section className="nospace">
				<h5>{t("view_candidatures_page.interview")}</h5>
				{
					// SI CANDIDATURE EST EN ATTENTE
					currentCandidature.etat === "EN ATTENTE" ? (
							
							// VUE EMPLOYEUR ET ETUDIANT
							<div className="toolbar-items">
								<Icon path={mdiHelpCircleOutline} size={1} className="text-dark"/>
								<p className="text-dark m-0">{t("view_candidatures_page.waiting_for_initial_application")}</p>
							</div>
						)
						: // SI ENTREVUE PROPOSÉE
						currentCandidature.etat === "ENTREVUE_PROPOSE" ? (
								// VUE EMPLOYEUR
								isEmployeur ? (
										<>
											<div className="toolbar-items">
												<Icon path={mdiClockOutline} size={1} className="text-orange"/>
												<p className="text-orange m-0">{t("view_candidatures_page.waiting_for_student_confirmation")}</p>
											</div>
											<br/>
											<p>{t("view_candidatures_page.proposed_interview_date", {date: currentCandidature.dateEntrevue})}</p>
										</>
									)
									: // VUE ETUDIANT
									(
										<>
											<div className="toolbar-items">
												<Icon path={mdiClockOutline} size={1} className="text-blue"/>
												<p className="text-blue m-0">{t("dashboard_home_page.waiting_interview_acceptance")}</p>
											</div>
											<br/>
											<p>{t("dashboard_home_page.interview_date")}: {currentCandidature.dateEntrevue}</p>
											<div className="toolbar-items" style={{gap: "10px"}}>
												<button className="btn-filled bg-green" onClick={handleAcceptInterview}>
													{t("dashboard_home_page.accept")}
												</button>
												<button className="btn-filled bg-red" onClick={handleRefuseInterview}>
													{t("dashboard_home_page.refuse")}
												</button>
											</div>
										</>
									)
							)
							: // SI TOUS CES CAS QUE TU VOIS ENTRE [ ... ]
							["ENTREVUE_ACCEPTE_ETUDIANT", "CONTRAT_SIGNE_EMPLOYEUR", "CONTRAT_REFUSE_ETUDIANT", "CONTRAT_SIGNE_ETUDIANT", "REFUSEE_APRES_ENTREVUE", "CONTRAT_SIGNE_TOUS", "ACCEPTE_APRES_ENTREVUE"].includes(currentCandidature.etat) ? (
									// VUE EMPLOYEUR
									isEmployeur ? (
											<>
												<div className="toolbar-items">
													<Icon path={mdiCheckCircleOutline} size={1} className="text-green"/>
													<p className="text-green m-0">{t("view_candidatures_page.interview_accepted_by_student")}</p>
												</div>
												<br/>
												<p>{t("view_candidatures_page.proposed_interview_date", {date: currentCandidature.dateEntrevue})}</p>
											</>
										)
										: // VUE ETUDIANT
										(
											<>
												<div className="toolbar-items">
													<Icon path={mdiCheckCircleOutline} size={1} className="text-green"/>
													<p className="text-green m-0">{t("dashboard_home_page.interview_accepted_by_student")}</p>
												</div>
												<br/>
												<p>{t("dashboard_home_page.interview_date")}: {currentCandidature.dateEntrevue}</p>
											</>
										)
								)
								: // SI ENTREVUE REFUSÉE PAR ETUDIANT
								currentCandidature.etat === "ENTREVUE_REFUSE_ETUDIANT" ? (
										// VUE EMPLOYEUR ET ETUDIANT
										<>
											<div className="toolbar-items">
												<Icon path={mdiCheckCircleOutline} size={1} className="text-red"/>
												<p className="text-red m-0">{t("view_candidatures_page.interview_refused_by_student")}</p>
											</div>
											<br/>
											<p>{t("view_candidatures_page.proposed_interview_date", {date: currentCandidature.dateEntrevue})}</p>
										</>
									)
									:  // SI CANDIDATURE A ÉTÉ REFUSÉE
									(
										// VUE EMPLOYEUR ET ETUDIANT
										<div className="toolbar-items">
											<Icon path={mdiCloseCircleOutline} size={1} className="text-dark"/>
											<p className="text-dark m-0">{t("view_candidatures_page.interview_not_planned_for_refused_application")}</p>
										</div>
									)
				}
			</section>
			<hr/>
			
			{/* SECTION CONTRAT */}
			<section className="nospace">
				<h5>{t("view_candidatures_page.contract")}</h5>
				{
					// SI CANIDATURE REFUSÉE PAR EMPLOYEUR
					currentCandidature.etat === "REFUSEE" ? (
							<div className="toolbar-items">
								<Icon path={mdiCloseCircleOutline} size={1} className="text-dark"/>
								<p className="text-dark m-0">{t("view_candidatures_page.contract_not_signed_for_refused_application")}</p>
							</div>
						)
						: // SI ENTREVUE PROPOSÉE PAR EMPLOYEUR
						currentCandidature.etat === "ENTREVUE_PROPOSE" ? (
								<div className="toolbar-items">
									<Icon path={mdiHelpCircleOutline} size={1} className="text-dark"/>
									<p className="text-dark m-0">{t("view_candidatures_page.waiting_for_interview_results")}</p>
								</div>
							)
							: // SI  ETUDIANT A ACCEPTE L'ENTREVUE
							currentCandidature.etat === "ENTREVUE_ACCEPTE_ETUDIANT" ? (
									// VUE EMPLOYEUR
									isEmployeur ? (
											<>
												<div className="toolbar-items" style={{gap: "10px"}}>
													<button className="btn-filled bg-green" onClick={handleInterviewPassed}>
														{t("view_candidatures_page.accept")}
													</button>
													<button className="btn-filled bg-red" onClick={handleInterviewFail}>
														{t("view_candidatures_page.refuse")}
													</button>
												</div>
											</>
										)
										: // VUE ETUDIANT
										(
											<div className="toolbar-items">
												<Icon path={mdiHelpCircleOutline} size={1} className="text-orange"/>
												<p className="text-orange m-0">{t("dashboard_home_page.waiting_interview_results")}</p>
											</div>
										)
								)
								: // SI  ETUDIANT A REFUSÉ L'ENTREVUE
								currentCandidature.etat === "ENTREVUE_REFUSE_ETUDIANT" ? (
										// VUE EMPLOYEUR
										isEmployeur ? (
												<div className="toolbar-items">
													<Icon path={mdiHelpCircleOutline} size={1} className="text-dark"/>
													<p className="text-dark m-0">{t("view_candidatures_page.contract_not_signed_after_interview_refusal_by_student")}</p>
												</div>
											)
											: // VUE ETUDIANT
											(
												<div className="toolbar-items">
													<Icon path={mdiCloseCircleOutline} size={1} className="text-dark"/>
													<p className="text-dark m-0">{t("view_candidatures_page.contract_cannot_be_signed_entrevue_rejected_by_student")}</p>
												</div>
											)
									)
									: // SI CONTRAT SIGNÉ PAR EMPLOYEUR
									currentCandidature.etat === "CONTRAT_SIGNE_EMPLOYEUR" ? (
											// VUE EMPLOYEUR
											isEmployeur ? (
													<div className="toolbar-items">
														<Icon path={mdiHelpCircleOutline} size={1} className="text-orange"/>
														<p className="text-orange m-0">{t("view_candidatures_page.waiting_for_student_signature")}</p>
													</div>
												)
												: // VUE ETUDIANT
												(
													<>
														<div className="toolbar-items">
															<Icon path={mdiCheckCircleOutline} size={1} className="text-green"/>
															<p className="text-green m-0">{t("dashboard_home_page.contract_signed_by_employer")}</p>
														</div>
														<br></br>
														<div className="toolbar-items" style={{gap: "10px"}}>
															<button className="btn-filled bg-green" onClick={handleSignerContrat}>
																{t("dashboard_home_page.sign")}
															</button>
															<button className="btn-filled bg-red" onClick={handleRefuserContrat}>
																{t("dashboard_home_page.refuse")}
															</button>
														</div>
													</>
												)
										)
										:
										
										// TODO DIVISION
										currentCandidature.etat === "CONTRAT_SIGNE_ETUDIANT" ? (
											<>
												<div className="toolbar-items">
													<Icon path={mdiCheckCircleOutline} size={1} className="text-green"/>
													<p className="text-green m-0">{t("view_candidatures_page.contract_signed_by_student")}</p>
												</div>
												<div className="toolbar-items">
													<Icon path={mdiHelpCircleOutline} size={1} className="text-orange"/>
													<p className="text-orange m-0">{t("view_candidatures_page.waiting_for_manager_signature")}</p>
												</div>
											</>
										) : currentCandidature.etat === "ACCEPTE_APRES_ENTREVUE" ? (
											<div className="toolbar-items">
												<Icon path={mdiHelpCircleOutline} size={1} className="text-orange"/>
												<p className="text-orange m-0">{t("view_candidatures_page.waiting_for_contract_generation")}</p>
											</div>
										) : currentCandidature.etat === "REFUSEE_APRES_ENTREVUE" ? (
											<div className="toolbar-items">
												<Icon path={mdiHelpCircleOutline} size={1} className="text-red"/>
												<p className="text-red m-0">{t("view_candidatures_page.contract_not_signed_after_interview_refusal")}</p>
											</div>
										) : currentCandidature.etat === "CONTRAT_REFUSE_ETUDIANT" ? (
											<div className="toolbar-items">
												<Icon path={mdiHelpCircleOutline} size={1} className="text-red"/>
												<p className="text-red m-0">{t("view_candidatures_page.contract_refused_by_student")}</p>
											</div>
										) : currentCandidature.etat === "CONTRAT_SIGNE_TOUS" ? (
											<div className="toolbar-items">
												<Icon path={mdiHelpCircleOutline} size={1} className="text-green"/>
												<p className="text-green m-0">{t("view_candidatures_page.contract_signed_by_all")}</p>
											</div>
										) : (
											<div className="toolbar-items">
												<Icon path={mdiHelpCircleOutline} size={1} className="text-dark"/>
												<p className="text-dark m-0">{t("view_candidatures_page.waiting_for_initial_application")}</p>
											</div>
										)
				}
				<br></br>
			</section>
		</div>
	);
};

export default CandidatureStatus;