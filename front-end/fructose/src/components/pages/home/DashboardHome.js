import React, {useContext} from "react";
import {AuthContext} from "../../providers/AuthProvider";
import Icon from "@mdi/react";
import {mdiAccountCircle, mdiBriefcaseVariantOutline,} from "@mdi/js";
import {useTranslation} from "react-i18next";
import DashboardHomeAdmin from "../admin/DashboardAdmin";
import OffresStagesDashboard from "./DashboardSections/OffresStagesEtudiantDashboard";
import OffresStagesEmpProfDashboard from "./DashboardSections/OffresStagesEmpProfDashboard";
import CVEtudiantDashboard from "./DashboardSections/CVEtudiantDashboard";
import UserManagementDashboard from "./DashboardSections/UserManagementDashboard";
import CandidatureEmployeurDashboard from "./DashboardSections/CandidatureEmployeurDashboard";
import CandidatureEtudiantDashboard from "./DashboardSections/CandidatureEtudiantDashboard";

const DashboardHome = () => {
	
	const {t} = useTranslation();
	const {currentUser} = useContext(AuthContext);
	
	const GetOffreStageSection = () => {
		if (currentUser != null) {
			if (currentUser.role === "ETUDIANT") {
				return <OffresStagesDashboard></OffresStagesDashboard>
			} else if (currentUser.role === "EMPLOYEUR" || currentUser.role === "PROFESSEUR") {
				return <OffresStagesEmpProfDashboard></OffresStagesEmpProfDashboard>
			} else if (currentUser.role === "ADMIN") {
				return (
					<DashboardHomeAdmin/>
				);
			}
		}
	}
	
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
						<CandidatureEtudiantDashboard></CandidatureEtudiantDashboard>
						<CVEtudiantDashboard></CVEtudiantDashboard>
						<UserManagementDashboard></UserManagementDashboard>
						<CandidatureEmployeurDashboard></CandidatureEmployeurDashboard>
					</div>
				</div>
				<div style={{"width": "30%"}}>
					<div className="dashboard-card">
						<div className="user-profile-section">
							<div className="user-profile-section-banner">
							</div>
							<div className="user-profile-section-profile-picture centered"
							     style={{backgroundImage: 'url("/assets/auth/default-profile.jpg")'}}>
							</div>
						</div>
						<br/>
						<section className="nospace text-center">
							<h4 className="m-0">{(currentUser != null) ? currentUser.fullName :
								<span className={"loading-placeholder"}></span>}
							</h4>
							<p className="m-0 text-dark">{(currentUser != null) ? currentUser.email :
								<span className={"loading-placeholder"}></span>}
							</p>
						</section>
						<hr/>
						<section className="nospace">
							<h5>Suggestions</h5>
							<div className="banner bg-primary">
								<Icon path={mdiAccountCircle} size={1.2}/>
								<div>
									<h5 className="m-0">Complétez votre profil</h5>
									<p className="m-0">Ajoutez un CV et commencez à postuler dès maintenant</p>
								</div>
							</div>
							<div className="banner bg-grey">
								<Icon path={mdiBriefcaseVariantOutline} size={1.2}/>
								<div className="toolbar-spacer">
									<h5 className="m-0">Commencez à postuler</h5>
									<p className="m-0">Plusieures offres de stage disponibles</p>
								</div>
							</div>
							<div className="banner bg-grey">
								<Icon path={mdiBriefcaseVariantOutline} size={1.2}/>
								<div className="toolbar-spacer">
									<h5 className="m-0">Commencez à postuler</h5>
									<p className="m-0">Plusieures offres de stage disponibles</p>
								</div>
							</div>
						</section>
						<hr/>
						<section className="nospace">
							<p className="text-dark">&copy; 2024 - Fructose</p>
							<p className="text-dark">
								<a href="">Accueil</a> - <a href="">Langue</a> - <a href="">Se deconnecter</a>
							</p>
							<br/>
						</section>
					</div>
				</div>
			</div>
		</>
	);
}

export default DashboardHome;