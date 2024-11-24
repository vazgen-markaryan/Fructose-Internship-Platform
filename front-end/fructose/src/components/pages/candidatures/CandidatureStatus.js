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
	                           handleInterviewFail
                           }) => {
	
	const {currentUser} = useContext(AuthContext);
	const isEmployeur = currentUser.role === 'EMPLOYEUR';
	
	return (
		<div>
			{/* SECTION CANDIDATURE INITIALE */}
			<section className="nospace">
				<h5>{t("view_candidatures_page.initial_application")}</h5>
				{/* SI EN ATTENTE*/}
				{currentCandidature.etat === "EN_ATTENTE" ? (
					// SI EMPLLOYEUR
					isEmployeur ? (
							<div style={{gap: "10px"}} className="toolbar-items">
								<button className="btn-filled toolbar-spacer bg-green" onClick={handleApprove}>
									{t("manage_users_page.approve")}
								</button>
								<button className="btn-filled toolbar-spacer bg-red" onClick={handleRefuse}>
									{t("view_candidatures_page.refuse")}
								</button>
							</div>
						) :
						// SI ETUDIANT
						(
							<div className="toolbar-items">
								<Icon path={mdiClockOutline} size={1} className="text-orange"/>
								<p className="text-orange m-0">{t("dashboard_home_page.waiting_employer_response")}</p>
							</div>
						
						)
				// SI PAS REFUSEE NI EN ATTENTE
				) : ["ENTREVUE_PROPOSE", "ENTREVUE_ACCEPTE_ETUDIANT", "ENTREVUE_REFUSE_ETUDIANT", "CONTRAT_SIGNE_EMPLOYEUR", "CONTRAT_REFUSE_ETUDIANT", "CONTRAT_SIGNE_ETUDIANT", "CONTRAT_REFUSE_TOUS", "REFUSEE_APRES_ENTREVUE", "ACCEPTE_APRES_ENTREVUE"].includes(currentCandidature.etat) ? (
					// SI EMPLOYEUR ET ETUDIANT
					<div className="toolbar-items">
						<Icon path={mdiCheckCircleOutline} size={1} className="text-green"/>
						<p className="text-green m-0">{t("view_candidatures_page.approved")}</p>
					</div>
				) :
				// SI REFUSEE
				(
					<div className="toolbar-items">
						<Icon path={mdiCloseCircleOutline} size={1} className="text-red"/>
						<p className="text-red m-0">{t("view_candidatures_page.refused_with_comment", {comment: currentCandidature.commentaireRefus})}</p>
					</div>
				)}
			</section>
			<hr/>
			{/*// TODO ARRETE ICI*/}
			{/* SECTION ENTREVUE */}
			<section className="nospace">
				<h5>{t("view_candidatures_page.interview")}</h5>
				{currentCandidature.etat === "ENTREVUE_PROPOSE" ? (
					<>
						<div className="toolbar-items">
							<Icon path={mdiClockOutline} size={1} className="text-orange"/>
							<p className="text-orange m-0">{t("view_candidatures_page.waiting_for_student_confirmation")}</p>
						</div>
						<br/>
						<p>{t("view_candidatures_page.proposed_interview_date", {date: currentCandidature.dateEntrevue})}</p>
					</>
				) : ["ENTREVUE_ACCEPTE_ETUDIANT", "CONTRAT_SIGNE_EMPLOYEUR", "CONTRAT_SIGNE_ETUDIANT", "REFUSEE_APRES_ENTREVUE", "CONTRAT_REFUSE_ETUDIANT", "CONTRAT_SIGNE_TOUS", "ACCEPTE_APRES_ENTREVUE"].includes(currentCandidature.etat) ? (
					<>
						<div className="toolbar-items">
							<Icon path={mdiCheckCircleOutline} size={1} className="text-green"/>
							<p className="text-green m-0">{t("view_candidatures_page.interview_accepted_by_student")}</p>
						</div>
						<br/>
						<p>{t("view_candidatures_page.proposed_interview_date", {date: currentCandidature.dateEntrevue})}</p>
					</>
				) : currentCandidature.etat === "REFUSEE" ? (
					<div className="toolbar-items">
						<Icon path={mdiCloseCircleOutline} size={1} className="text-dark"/>
						<p className="text-dark m-0">{t("view_candidatures_page.interview_not_planned_for_refused_application")}</p>
					</div>
				) : currentCandidature.etat === "ENTREVUE_REFUSE_ETUDIANT" ? (
					<>
						<div className="toolbar-items">
							<Icon path={mdiCheckCircleOutline} size={1} className="text-red"/>
							<p className="text-red m-0">{t("view_candidatures_page.interview_refused_by_student")}</p>
						</div>
						<br/>
						<p>{t("view_candidatures_page.proposed_interview_date", {date: currentCandidature.dateEntrevue})}</p>
					</>
				) : (
					<div className="toolbar-items">
						<Icon path={mdiHelpCircleOutline} size={1} className="text-dark"/>
						<p className="text-dark m-0">{t("view_candidatures_page.waiting_for_initial_application")}</p>
					</div>
				)}
			</section>
			<hr/>
			
			{/* SECTION CONTRAT */}
			<section className="nospace">
				<h5>{t("view_candidatures_page.contract")}</h5>
				{currentCandidature.etat === "REFUSEE" ? (
					<div className="toolbar-items">
						<Icon path={mdiCloseCircleOutline} size={1} className="text-dark"/>
						<p className="text-dark m-0">{t("view_candidatures_page.contract_not_signed_for_refused_application")}</p>
					</div>
				) : currentCandidature.etat === "ENTREVUE_PROPOSE" ? (
					<div className="toolbar-items">
						<Icon path={mdiHelpCircleOutline} size={1} className="text-dark"/>
						<p className="text-dark m-0">{t("view_candidatures_page.waiting_for_interview_results")}</p>
					</div>
				) : currentCandidature.etat === "ENTREVUE_ACCEPTE_ETUDIANT" ? (
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
				) : currentCandidature.etat === "CONTRAT_SIGNE_ETUDIANT" ? (
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
				) : currentCandidature.etat === "CONTRAT_SIGNE_EMPLOYEUR" ? (
					<div className="toolbar-items">
						<Icon path={mdiHelpCircleOutline} size={1} className="text-orange"/>
						<p className="text-orange m-0">{t("view_candidatures_page.waiting_for_student_signature")}</p>
					</div>
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
				) : currentCandidature.etat === "ENTREVUE_REFUSE_ETUDIANT" ? (
					<div className="toolbar-items">
						<Icon path={mdiHelpCircleOutline} size={1} className="text-dark"/>
						<p className="text-dark m-0">{t("view_candidatures_page.contract_not_signed_after_interview_refusal")}</p>
					</div>
				) : (
					<div className="toolbar-items">
						<Icon path={mdiHelpCircleOutline} size={1} className="text-dark"/>
						<p className="text-dark m-0">{t("view_candidatures_page.waiting_for_initial_application")}</p>
					</div>
				)}
				<br></br>
			</section>
		</div>
	);
};

export default CandidatureStatus;