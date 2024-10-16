import React, {useContext} from "react";
import HeaderMain from "../../fragments/header/HeaderMain";
import {
    mdiArrowLeft,
    mdiArrowRight,
    mdiBriefcasePlusOutline,
    mdiBriefcaseRemoveOutline,
    mdiChevronRight,
    mdiCog,
    mdiCogOutline
} from "@mdi/js";
import Icon from "@mdi/react";
import {AuthContext} from "../../../providers/AuthProvider";
import {Link, Route, Routes} from "react-router-dom";
import ManageCVs from "./cv/ManageCVs";
import CreerOffreStage from "../../offre_stage/CreerOffreStage";
import DashboardHome from "./DashboardHome";
import ViewCV from "./cv/View";
import UploadCV from "./cv/Upload";
import {CvProvider} from "../../../providers/CvProvider";

const Dashboard = () => {
    const { currentToken } = useContext(AuthContext);


    return(
        <>
            <HeaderMain theme={"light"}></HeaderMain>
            <div className={"dashboard-layout"}>
                <div className="dashboard-head">

                </div>
                <div className="dashboard-content">

                    <CvProvider user={currentToken}>
                        <Routes>
                            <Route path="/manage-cvs" element={<ManageCVs />} />
                            <Route path="/upload-cv" element={<UploadCV />} />
                            <Route path="/view-cv" element={<ViewCV />} />
                        </Routes>
                    </CvProvider>

                    <Routes>
                        <Route path="/" element={<DashboardHome />} />
                        <Route path="/creer-offre-stage" element={<CreerOffreStage />} />
                    </Routes>
                </div>
            </div>


        </>
    )
}
export default Dashboard