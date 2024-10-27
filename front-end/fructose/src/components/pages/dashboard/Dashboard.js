import React from "react";
import HeaderMain from "../../fragments/header/HeaderMain";
import {Route, Routes} from "react-router-dom";
import ManageCVs from "./cv/ManageCVs";
import CreerOffreStage from "../offre_stage/CreerOffreStage";
import DashboardHome from "./DashboardHome";
import ViewCV from "./cv/View";
import UploadCV from "./cv/Upload";
import {CvProvider} from "../../../providers/CvProvider";
import {AdminProvider} from "../../../providers/AdminProvider";
import {RoleRoute} from "../../routing/RoleRoute";
import ManageUsers from "./admin/ManageUsers";
import {OffreStageProvider} from "../../../providers/OffreStageProvider";
import ModifierOffreStage from "../offre_stage/ModifierOffreStage";
import ManageOffresStage from "./offre-stage/ManageOffresStage";
import DiscoverOffers from "./offre-stage/DiscoverOffers";

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
                                <Route path="/" element={<DashboardHome/>}/>
                            </Routes>
                        </OffreStageProvider>
                    </CvProvider>
                    <OffreStageProvider>
                        <Routes>
                            <Route path="/manage-offres-stage" element={<RoleRoute element={<ManageOffresStage/>} roles={['EMPLOYEUR']}/>}/>
                            <Route path="/modifier-offre-stage/:id" element={<RoleRoute element={<ModifierOffreStage/>} roles={['EMPLOYEUR']}/>}/>
                            <Route path="/discover-offers/" element={<RoleRoute element={<DiscoverOffers/>} roles={['ETUDIANT']}/>}/>

                        </Routes>
                    </OffreStageProvider>
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