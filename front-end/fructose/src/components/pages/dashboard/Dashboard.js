import React from "react";
import HeaderMain from "../../fragments/header/HeaderMain";
import {AuthContext} from "../../../providers/AuthProvider";
import {Route, Routes} from "react-router-dom";
import ManageCVs from "./cv/ManageCVs";
import CreerOffreStage from "../../offre_stage/CreerOffreStage";
import DashboardHome from "./DashboardHome";
import ViewCV from "./cv/View";
import UploadCV from "./cv/Upload";
import {CvProvider} from "../../../providers/CvProvider";

const Dashboard = () => {
    return(
        <>
            <HeaderMain theme={"light"}></HeaderMain>
            <div className={"dashboard-layout"}>
                <div className="dashboard-head">

                </div>
                <div className="dashboard-content">

                    <CvProvider>
                        <Routes>
                            <Route path="/manage-cvs" element={<ManageCVs />} />
                            <Route path="/upload-cv" element={<UploadCV />} />
                            <Route path="/view-cv" element={<ViewCV />} />
                            <Route path="/" element={<DashboardHome />} />
                        </Routes>
                    </CvProvider>

                    <Routes>
                        <Route path="/creer-offre-stage" element={<CreerOffreStage />} />
                    </Routes>
                </div>
            </div>


        </>
    )
}

export default Dashboard