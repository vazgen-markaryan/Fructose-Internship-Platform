import React, {useContext} from "react";
import Icon from "@mdi/react";
import {mdiBriefcaseOutline, mdiCashMultiple, mdiCheck, mdiClockOutline, mdiClose, mdiMapMarkerOutline} from "@mdi/js";
import {useTranslation} from "react-i18next";
import {AuthContext} from "../../../../providers/AuthProvider";

const OfferPreview = ({currentOffer}) => {
	const {t} = useTranslation();
	const {currentUser} = useContext(AuthContext);
	
	if (currentOffer) {
		return (
			<div className="dashboard-card" style={{
				width: "55%",
				position: "sticky",
				top: "70px",
				maxHeight: "85vh",
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
						{currentUser && currentUser.role === "ETUDIANT" && (
							<button className="btn-filled">Postuler</button>
						)}
					</div>
					{currentUser.role === "EMPLOYEUR" && (
						currentOffer.isApproved ? (
							<>
								<Icon path={mdiCheck} size={1} color="green"/>
								<p style={{
									display: "inline",
									marginLeft: "5px"
								}}>{t("offer_status.approved")}</p>
							</>
						) : currentOffer.isRefused ? (
							<>
								<Icon path={mdiClose} size={1} color="red"/>
								<p style={{
									display: "inline",
									marginLeft: "5px"
								}}>{t("offer_status.refused")}</p>
							</>
						) : (
							<>
								<Icon path={mdiClockOutline} size={1} color="orange"/>
								<p style={{
									display: "inline",
									marginLeft: "5px"
								}}>{t("offer_status.pending")}</p>
							</>
						)
					)}
					<br/>
					<hr/>
				</section>
				<div style={{overflowY: "auto"}}>
					<section>
						<h5>Particularites</h5>
						<div className="list-bullet">
							<Icon path={mdiCashMultiple} size={1}/>
							<div style={{padding: "4px 0"}}>
								<h6 className="m-0" style={{marginBottom: "5px"}}>Salaire</h6>
								<span className="badge text-mini">C$ {currentOffer.tauxHoraire}.00</span>
							</div>
						</div>
						<div className="list-bullet">
							<Icon path={mdiBriefcaseOutline} size={1}/>
							<div style={{padding: "4px 0"}}>
								<h6 className="m-0" style={{marginBottom: "5px"}}>Type de stage</h6>
								<span
									className="badge text-mini">{t("creer_offre_stage_page.types_emploi." + currentOffer.modaliteTravail)}</span>
								<span className="badge text-mini">{currentOffer.nombreHeuresSemaine} Heures</span>
							</div>
						</div>
						<div className="list-bullet">
							<Icon path={mdiBriefcaseOutline} size={1}/>
							<div style={{padding: "4px 0"}}>
								<h6 className="m-0" style={{marginBottom: "5px"}}>Horaire</h6>
								<div style={{display: "flex", alignItems: "center"}}>
                                    <span
	                                    className="badge text-mini">{t("creer_offre_stage_page.types_emploi." + currentOffer.modaliteTravail)}</span>
								</div>
							</div>
						</div>
						<hr/>
						<h5>Location</h5>
						<div className="list-bullet">
							<Icon path={mdiMapMarkerOutline} size={1}/>
							<div style={{padding: "4px 0"}}>
								<h6 className="m-0" style={{marginBottom: "5px"}}>{currentOffer.adresse}</h6>
							</div>
						</div>
						<hr/>
						<h5>Description</h5>
						<p>{currentOffer.description}</p>
					</section>
				</div>
			</div>
		);
	}
	return null;
};

export default OfferPreview;