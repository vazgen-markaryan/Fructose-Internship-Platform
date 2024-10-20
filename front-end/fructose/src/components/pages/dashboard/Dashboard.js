import React from "react";
import HeaderMain from "../../fragments/header/HeaderMain";
import {Route, Routes} from "react-router-dom";
import ManageCVs from "./cv/ManageCVs";
import CreerOffreStage from "../../offre_stage/CreerOffreStage";
import DashboardHome from "./DashboardHome";
import ViewCV from "./cv/View";
import UploadCV from "./cv/Upload";
import {AdminProvider} from "../../../providers/AdminProvider";
import {RoleRoute} from "../../routing/RoleRoute";
import ManageUsers from "./admin/ManageUsers";

const Dashboard = () => {
    return (
        <>
            <HeaderMain theme={"light"}></HeaderMain>
            <div className={"dashboard-layout"}>
                <div className="dashboard-head">
                </div>
                <div className="dashboard-content">
                    <Routes>
                        <Route path="/manage-cvs" element={<ManageCVs/>}/>
                        <Route path="/upload-cv" element={<UploadCV/>}/>
                        <Route path="/view-cv" element={<ViewCV/>}/>
                        <Route path="/" element={<DashboardHome/>}/>
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