import React, {useContext} from 'react';
import Icon from '@mdi/react';
import {mdiCheckCircleOutline, mdiClockOutline, mdiCloseCircleOutline} from '@mdi/js';
import {AuthContext} from "../../providers/AuthProvider";
import ViewContrat from "../contrat/ViewContrat";

const CandidatureStatus = ({
	                           contrat,
	                           t,
	                           handleRefuse,
	                           handleApprove,
	                           currentCandidature,
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
					currentCandidature.etat === "EN_ATTENTE" ?
						(
							// VUE EMPLOYEUR
							isEmployeur ?
								(
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
						["ENTREVUE_PROPOSE", "ENTREVUE_ACCEPTE_ETUDIANT", "ENTREVUE_REFUSE_ETUDIANT", "CONTRAT_SIGNE_EMPLOYEUR", "CONTRAT_REFUSE_ETUDIANT", "CONTRAT_SIGNE_ETUDIANT", "CONTRAT_REFUSE_TOUS", "REFUSEE_APRES_ENTREVUE", "ACCEPTE_APRES_ENTREVUE", "CONTRAT_CREE_PAR_GESTIONNAIRE"].includes(currentCandidature.etat) ?
							(
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
							)
				}
			</section>
			<hr/>
			
			{/* SECTION ENTREVUE */}
			<section className="nospace">
				<h5>{t("view_candidatures_page.interview")}</h5>
				{
					// SI CANDIDATURE EST EN ATTENTE
					currentCandidature.etat === "EN_ATTENTE" ?
						(
							// VUE EMPLOYEUR ET ETUDIANT
							<div className="toolbar-items">
								<Icon path={mdiClockOutline} size={1} className="text-dark"/>
								<p className="text-dark m-0">{t("view_candidatures_page.waiting_for_initial_application")}</p>
							</div>
						)
						: // SI ENTREVUE PROPOSÉE
						currentCandidature.etat === "ENTREVUE_PROPOSE" ?
							(
								// VUE EMPLOYEUR
								isEmployeur ?
									(
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
							["ENTREVUE_ACCEPTE_ETUDIANT", "CONTRAT_SIGNE_EMPLOYEUR", "CONTRAT_REFUSE_ETUDIANT", "CONTRAT_SIGNE_ETUDIANT", "REFUSEE_APRES_ENTREVUE", "CONTRAT_SIGNE_TOUS", "ACCEPTE_APRES_ENTREVUE", "CONTRAT_CREE_PAR_GESTIONNAIRE"].includes(currentCandidature.etat) ?
								(
									// VUE EMPLOYEUR
									isEmployeur ?
										(
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
								currentCandidature.etat === "ENTREVUE_REFUSE_ETUDIANT" ?
									(
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
					currentCandidature.etat === "REFUSEE" ?
						(
							<div className="toolbar-items">
								<Icon path={mdiCloseCircleOutline} size={1} className="text-dark"/>
								<p className="text-dark m-0">{t("view_candidatures_page.contract_not_signed_for_refused_application")}</p>
							</div>
						)
						: // SI ENTREVUE PROPOSÉE PAR EMPLOYEUR
						currentCandidature.etat === "ENTREVUE_PROPOSE" ?
							(
								<div className="toolbar-items">
									<Icon path={mdiClockOutline} size={1} className="text-dark"/>
									<p className="text-dark m-0">{t("view_candidatures_page.waiting_for_interview_results")}</p>
								</div>
							)
							: // SI  ETUDIANT A ACCEPTE L'ENTREVUE
							currentCandidature.etat === "ENTREVUE_ACCEPTE_ETUDIANT" ?
								(
									// VUE EMPLOYEUR
									isEmployeur ?
										(
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
												<Icon path={mdiClockOutline} size={1} className="text-orange"/>
												<p className="text-orange m-0">{t("dashboard_home_page.waiting_interview_results")}</p>
											</div>
										)
								)
								: // SI  ETUDIANT A REFUSÉ L'ENTREVUE
								currentCandidature.etat === "ENTREVUE_REFUSE_ETUDIANT" ?
									(
										// VUE EMPLOYEUR
										isEmployeur ?
											(
												<div className="toolbar-items">
													<Icon path={mdiCloseCircleOutline} size={1} className="text-dark"/>
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
									: // SI ETUDIANNT A ÉTÉ ACCEPTÉ APRÈS L'ENTREVUE
									currentCandidature.etat === "ACCEPTE_APRES_ENTREVUE" ?
										(
											// VUE EMPLOYEUR ET ETUDIANT
											<>
												<div className="toolbar-items">
													<Icon path={mdiCheckCircleOutline} size={1} className="text-green"/>
													<p className="text-green m-0">
														{/*SI VUE EMPLOYEUR */}
														{isEmployeur ?
															t("view_candidatures_page.student_passed_entrevue")
															: // SI VUE ETUDIANT
															t("view_candidatures_page.you_passed_entrevue")
														}
													</p>
												</div>
												
												<div className={"toolbar-items"}>
													<Icon path={mdiClockOutline} size={1} className="text-orange"/>
													<p className="text-orange m-0">
														{t("view_candidatures_page.waiting_for_contract_generation")}
													</p>
												</div>
											</>
										)
										: // SI CANDIDATURE A ÉTÉ REFUSÉE APRÈS L'ENTREVUE
										currentCandidature.etat === "REFUSEE_APRES_ENTREVUE" ?
											(
												// VUE EMPLOYEUR ET ETUDIANT
												(
													<div className="toolbar-items">
														<Icon path={mdiClockOutline} size={1} className="text-red"/>
														<p className="text-red m-0">{t("view_candidatures_page.contract_not_signed_after_interview_refusal")}</p>
													</div>
												)
											)
											
											
											
											
											
											// TODO PAS A CA PLACE
											: // SI CONTRAT A ÉTÉ CRÉÉ PAR GESTIONNAIRE ET NON SIGNÉ PAR EMPLOYEUR
											currentCandidature.etat === "CONTRAT_CREE_PAR_GESTIONNAIRE" && contrat ?
												(
													<>
														{/*// SI CONTRAT N'EST PAS ENCORE SIGNÉ PAR EMPLOYEUR*/}
														{contrat.signatureEmployeur === "Non signe" &&
															(
																<div className="toolbar-items">
																	<Icon path={mdiClockOutline} size={1} className={isEmployeur ? "text-blue" : "text-orange"}/>
																	<p className={isEmployeur ? "text-blue m-0" : "text-orange m-0"}>
																		{
																			isEmployeur ?
																				t("view_candidatures_page.waiting_for_your_signature")
																				:
																				t("view_candidatures_page.waiting_for_employer_signature")
																		}
																	</p>
																</div>
															)
														}
														
														{/*// SI CONTRAT N'EST PAS ENCORE SIGNÉ PAR ETUDIANT*/}
														{contrat.signatureEtudiant === "Non signe" &&
															(
																<div className="toolbar-items">
																	<Icon path={mdiClockOutline} size={1} className={isEmployeur ? "text-orange" : "text-blue"}/>
																	<p className={isEmployeur ? "text-orange m-0" : "text-blue m-0"}>
																		{
																			isEmployeur ?
																				t("view_candidatures_page.waiting_for_student_signature")
																				:
																				t("view_candidatures_page.waiting_for_your_signature")
																		}
																	</p>
																</div>
															)
														}
														
														{/*SI CONTRAT A ÉTÉ SIGNÉ PAR TOUS*/}
														{
															contrat.signatureEmployeur !== "Non signe" &&
															contrat.signatureEtudiant !== "Non signe" &&
															contrat.signatureGestionnaire !== "Non signe" &&
															contrat.signatureEmployeur !== "Refuse" &&
															contrat.signatureEtudiant !== "Refuse" &&
															contrat.signatureGestionnaire !== "Refuse" &&
															(
																<div className="toolbar-items">
																	<Icon path={mdiCheckCircleOutline} size={1} className="text-green"/>
																	<p className="text-green m-0">{t("view_candidatures_page.contract_signed_by_all")}</p>
																</div>
															)
														}
														
														{/*SI CONTRAT A ÉTÉ REFUSÉ PAR QUELQU'UN*/}
														{
															contrat.signatureEmployeur === "Refuse" ||
															contrat.signatureEtudiant === "Refuse" ||
															contrat.signatureGestionnaire === "Refuse" ?
																(
																	<div className="toolbar-items">
																		<Icon path={mdiCloseCircleOutline} size={1} className="text-red"/>
																		<p className="text-red m-0">
																			{contrat.signatureEmployeur === "Refuse" && t("view_candidatures_page.contract_refused_by_employer")}
																			{contrat.signatureEtudiant === "Refuse" && t("view_candidatures_page.contract_refused_by_student")}
																		</p>
																	</div>
																)
																: null
														}
														
														{/*SI CONTRAT N'EST PAS ENCORE SIGNÉ PAR EMPLOYEUR OU ETUDIANT*/}
														
														
														<br/>
														
														{/* PDF DU CONTRAT*/}
														<div>
															{contrat &&
																<ViewContrat contrat={contrat} handleSign={handleSignerContrat} handleNoSign={handleRefuserContrat}/>}
														</div>
													</>
												)
												: // TODO NULL POUR L'INSTANT
												null
				}
				<br></br>
			</section>
		</div>
	)
}

export default CandidatureStatus;

// TODO REVOIR LES CONDITIONS
//TODO TOUT CELA EST VUE EMOLOYEUR
// : currentCandidature.etat === "CONTRAT_REFUSE_ETUDIANT" ? (
// 		<div className="toolbar-items">
// 			<Icon path={mdiClockOutline} size={1} className="text-red"/>
// 			<p className="text-red m-0">{t("view_candidatures_page.contract_refused_by_student")}</p>
// 		</div>
// 	)
// 	:
// 	(
// 		// EN ATTENTE
// 		<div className="toolbar-items">
// 			<Icon path={mdiClockOutline} size={1} className="text-dark"/>
// 			<p className="text-dark m-0">{t("view_candidatures_page.waiting_for_initial_application")}</p>
// 		</div>
// 	)