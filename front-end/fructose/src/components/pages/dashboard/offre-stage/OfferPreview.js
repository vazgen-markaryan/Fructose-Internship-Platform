import React, {useContext, useState} from "react";
import Icon from "@mdi/react";
import {
	mdiBriefcaseOutline,
	mdiCalendarOutline,
	mdiCashMultiple,
	mdiCheck,
	mdiDeleteOutline,
	mdiDomain,
	mdiMapMarkerOutline
} from "@mdi/js";
import {useTranslation} from "react-i18next";
import {differenceInMonths, endOfMonth, format} from "date-fns";
import {AuthContext} from "../../../../providers/AuthProvider";
import {useNavigate} from "react-router-dom";
import {OffreStageContext} from "../../../../providers/OffreStageProvider";

const OfferPreview = ({currentOffer, handleDeleteOffreStage}) => {
	const {t} = useTranslation();
	const {currentUser} = useContext(AuthContext);
	const navigate = useNavigate();
	
	if (currentOffer) {
		const dateDebut = new Date(currentOffer.dateDebut);
		const dateFin = new Date(currentOffer.dateFin);
		
		// Ajoute 1 jour à la date de début pour l'afficher correctement
		dateDebut.setDate(dateDebut.getDate() + 1);
		dateFin.setDate(dateFin.getDate() + 1);
		
		const formattedDateDebut = format(dateDebut, 'dd-MM-yyyy');
		const formattedDateFin = format(endOfMonth(dateFin), 'dd-MM-yyyy');
		const monthsDifference = differenceInMonths(endOfMonth(dateFin), dateDebut);
		
		return (
			<>
				<div className="dashboard-card" style={{
					width: "55%",
					position: "sticky",
					top: "70px",
					height: "90vh",
					display: "flex",
					flexDirection: "column"
				}}>
					<div className="user-profile-section">
						<div className="company-profile-section-banner" style={{borderRadius: "5px 5px 0 0"}}></div>
						<div className="user-profile-section-profile-picture radius-normal"
						     style={{"backgroundImage": "url('/assets/offers/default-company.png')"}}>
						</div>
					</div>
					<section>
						<div className="toolbar-items" style={{padding: "0 10px"}}>
							<div>
								<h4 className="m-0">{currentOffer.poste}</h4>
								<p className="text-dark m-0">{currentOffer.ownerDTO.companyName}</p>
							</div>
							<div className="toolbar-spacer"></div>
							<div style={{display: (currentUser.role === "ETUDIANT") ? "block" : "none"}}>
								<button className="btn-filled">{t("discover_offers_page.apply")}</button>
							</div>
						</div>
					</section>
					<hr/>
					<div style={{overflowY: "auto"}}>
						<section className="nospace">
							<h5>{t("discover_offers_page.particularities")}</h5>
							<div className="list-bullet">
								<Icon path={mdiCashMultiple} size={1}/>
								<div style={{padding: "4px 0"}}>
									<h6 className="m-0" style={{marginBottom: "5px"}}>{t("discover_offers_page.salary")}</h6>
									<span className="badge text-mini">C$ {currentOffer.tauxHoraire}.00</span>
								</div>
							</div>
							<div className="list-bullet">
								<Icon path={mdiBriefcaseOutline} size={1}/>
								<div style={{padding: "4px 0"}}>
									<h6 className="m-0" style={{marginBottom: "5px"}}>{t("discover_offers_page.internship_type")}</h6>
									<span className="badge text-mini">{t("discover_offers_page.types_emploi." + currentOffer.modaliteTravail)}</span>
									<span className="badge text-mini"> {t("discover_offers_page.hours", {count: currentOffer.nombreHeuresSemaine})}</span>
								</div>
							</div>
							<div className="list-bullet">
								<Icon path={mdiDomain} size={1}/>
								<div style={{padding: "4px 0"}}>
									<h6 className="m-0" style={{marginBottom: "5px"}}>{t("discover_offers_page.work_type.title")}</h6>
									<span className="badge text-mini">{t("discover_offers_page.work_type." + currentOffer.typeEmploi)}</span>
								</div>
							</div>
							<div className="list-bullet">
								<Icon path={mdiCalendarOutline} size={1}/>
								<div style={{padding: "4px 0"}}>
									<h6 className="m-0" style={{marginBottom: "5px"}}>{t("discover_offers_page.internship_duration")}</h6>
									<span className="badge text-mini">{formattedDateDebut} - {formattedDateFin} ({t("discover_offers_page.month", {count: monthsDifference})})</span>
								</div>
							</div>
						</section>
						<hr/>
						<section className="nospace">
							<h5>{t("discover_offers_page.location")}</h5>
							<div className="list-bullet">
								<Icon path={mdiMapMarkerOutline} size={1}/>
								<div style={{padding: "4px 0"}}>
									<h6 className="m-0" style={{marginBottom: "5px"}}>{currentOffer.adresse}</h6>
								</div>
							</div>
						</section>
						<hr/>
						<section className="nospace">
							<h5>{t("discover_offers_page.description")}</h5>
							<p>{currentOffer.description}</p>
						</section>
						<hr/>
						<section className="nospace">
							
							{currentUser && currentUser.role !== "EMPLOYEUR" && (
								<>
									<h5>{t("discover_offers_page.employer")}</h5>
								</>
							)}
							
							<div className="list-bullet">
								
								{currentUser && currentUser.role !== "EMPLOYEUR" && (
									<>
										<div className="user-profile-section-profile-picture" style={{
											"background": "url('/assets/auth/default-profile.jpg') center / cover",
											width: "32px",
											height: "32px",
											margin: 0
										}}></div>
										<div>
											<h6 className="m-0">{currentOffer.ownerDTO.fullName}</h6>
											<p className="m-0 text-dark">{currentOffer.ownerDTO.companyName}</p>
										</div>
										<div className="toolbar-spacer"></div>
										<a href={"mailto:" + currentOffer.ownerDTO.email}>
											<button>{t("discover_offers_page.contact")}</button>
										</a>
									</>
								)}
								
								{currentUser && currentUser.role === "EMPLOYEUR" && (
									<>
										{currentOffer.isRefused && (
											<p style={{
												color: "red",
												textAlign: "center"
											}}>{currentOffer.commentaireRefus}</p>
										)}
										<button className="btn-option" onClick={() => navigate(`/dashboard/modifier-offre-stage/${currentOffer.id}`)}>
											<Icon path={mdiCheck} size={1}/>{t('manage_offre_stage.buttons.modify')}
										</button>
										<button className="btn-option" onClick={() => handleDeleteOffreStage(currentOffer.id)}>
											<Icon path={mdiDeleteOutline} size={1}/>{t('manage_offre_stage.buttons.delete')}
										</button>
									</>
								)}
							</div>
						</section>
					</div>
				</div>
			</>
		);
	}
	return null;
};

export default OfferPreview;