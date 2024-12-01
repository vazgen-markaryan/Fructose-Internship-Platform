import React, {useContext, useEffect, useRef, useState} from "react";
import Icon from "@mdi/react";
import {mdiBriefcasePlusOutline, mdiChevronRight} from "@mdi/js";
import OfferPreview from "../offre-stage/OfferPreview";
import PdfPreview from "../../../utilities/pdf/PdfPreview";
import {useTranslation} from "react-i18next";
import {CvContext} from "../../providers/CvProvider";
import {AuthContext} from "../../providers/AuthProvider";
import ListCandidatureEnAttenteContrat from "../candidatures/ListCandidatureEnAttenteContrat";
import UserManagementDashboard from "../home/DashboardSections/UserManagementDashboard";
import OffresStagesAdminDashboard from "../home/DashboardSections/OffresStagesAdminDashboard";
import CVAdminDashboard from "../home/DashboardSections/CVAdminDashboard";

const DashboardAdmin = () => {

    const {t} = useTranslation();
    const {getCvContenuById, GetAllCvs, GetCvs} = useContext(CvContext);

    const {currentUser, isUserInit} = useContext(AuthContext);
    const {currentToken} = useContext(AuthContext)



    return (
        <>
            <UserManagementDashboard></UserManagementDashboard>
            <OffresStagesAdminDashboard></OffresStagesAdminDashboard>
            <CVAdminDashboard></CVAdminDashboard>
            <section>

                        <ListCandidatureEnAttenteContrat/>
            </section>
        </>
    );
};

export default DashboardAdmin;