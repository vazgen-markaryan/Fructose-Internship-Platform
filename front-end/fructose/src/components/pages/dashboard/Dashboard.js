import React from "react";
import HeaderMain from "../../fragments/header/HeaderMain";
import {Route, Routes} from "react-router-dom";
import ManageCVs from "./cv/ManageCVs";
import CreerOffreStage from "../../offre_stage/CreerOffreStage";
import DashboardHome from "./DashboardHome";
import ViewCV from "./cv/View";
import UploadCV from "./cv/Upload";
import {CvProvider} from "../../../providers/CvProvider";
import {OffreStageProvider} from "../../../providers/OffreStageProvider";
import ViewOffreStage from "./offre-stage/ViewOffreStage";

const Dashboard = () => {
    return(
        <>
            <HeaderMain theme={"light"}></HeaderMain>
            <div className={"dashboard-layout"}>
                <div className="dashboard-head">

                </div>
                <div className="dashboard-content">

                    <CvProvider>
                        <OffreStageProvider>
                            <Routes>
                                <Route path="/manage-cvs" element={<ManageCVs />} />
                                <Route path="/view-offres-stage" element={<ViewOffreStage />} />
                                <Route path="/upload-cv" element={<UploadCV />} />
                                <Route path="/view-cv" element={<ViewCV />} />
                                <Route path="/" element={<DashboardHome />} />
                            </Routes>
                        </OffreStageProvider>
                    </CvProvider>

                    // A changer pour le mettre dans OffreStageProvider
                    <Routes>
                        <Route path="/creer-offre-stage" element={<CreerOffreStage />} />
                    </Routes>
                </div>
            </div>


        </>
    )
}

export default Dashboard