import React from "react";
import HeaderMain from "../../fragments/header/HeaderMain";
import {Route, Routes} from "react-router-dom";
import ManageCVs from "../cv/ManageCVs";
import CreerOffreStage from "../offre-stage/CreerOffreStage";
import DashboardHome from "../home/DashboardHome";
import ViewCV from "../cv/View";
import UploadCV from "../cv/Upload";
import {CvProvider} from "../../providers/CvProvider";
import {AdminProvider} from "../../providers/AdminProvider";
import {RoleRoute} from "../../../utilities/routing/RoleRoute";
import ManageUsers from "../admin/ManageUsers";
import {OffreStageProvider} from "../../providers/OffreStageProvider";
import ModifierOffreStage from "../offre-stage/ModifierOffreStage";
import ManageOffresStage from "../offre-stage/ManageOffresStage";
import DiscoverOffers from "../offre-stage/DiscoverOffers";
import {ApplyOffreWindow} from "../offre-stage/ApplyOffreWindow";
import {CandidatureProvider} from "../../providers/CandidatureProvider";
import {ViewCandidatures} from "../candidatures/ViewCandidatures";

const Dashboard = () => {
	return (
		<>
			<HeaderMain theme={"light"}></HeaderMain>
			<div className={"dashboard-layout"}>
				<div className="dashboard-head">
				</div>
				<div className="dashboard-content">
					
					<CvProvider>
						<OffreStageProvider>
							<Routes>
								<Route path="/manage-cvs" element={<RoleRoute element={<ManageCVs/>} roles={['ETUDIANT']}/>}/>
								<Route path="/upload-cv" element={<RoleRoute element={<UploadCV/>} roles={['ETUDIANT']}/>}/>
								<Route path="/view-cv" element={<RoleRoute element={<ViewCV/>} roles={['ETUDIANT']}/>}/>
								<Route path="/manage-offres-stage" element={<RoleRoute element={<ManageOffresStage/>} roles={['EMPLOYEUR', 'ADMIN']}/>}/>
								<Route path="/modifier-offre-stage/:id" element={<RoleRoute element={<ModifierOffreStage/>} roles={['EMPLOYEUR', 'ADMIN']}/>}/>
								<Route path="/discover-offers/" element={<RoleRoute element={<CandidatureProvider><ApplyOffreWindow><DiscoverOffers/></ApplyOffreWindow></CandidatureProvider>} roles={['ETUDIANT']}/>}/>
								<Route path="/" element={<DashboardHome/>}/>
							</Routes>
						</OffreStageProvider>
					</CvProvider>

					<CandidatureProvider>
						<Routes>
							<Route path="/view-candidatures" element={<RoleRoute element={<ViewCandidatures/>} roles={['EMPLOYEUR', 'ADMIN']}/>}/>
						</Routes>
					</CandidatureProvider>
					
					<Routes>
						<Route path="/creer-offre-stage" element={<CreerOffreStage/>}/>
					</Routes>
					
					<AdminProvider>
						<Routes>
							<Route path="/admin/manage-users" element={<RoleRoute element={<ManageUsers/>} roles={['ADMIN']}/>}/>
						</Routes>
					</AdminProvider>
				</div>
			</div>
		</>
	)
}

export default Dashboard