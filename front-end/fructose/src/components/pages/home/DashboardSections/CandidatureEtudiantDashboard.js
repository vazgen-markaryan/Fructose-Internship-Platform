import Icon from "@mdi/react";
import {
    mdiArrowLeft, mdiArrowRight,
    mdiBriefcaseOutline,
    mdiCheckCircleOutline,
    mdiChevronLeft, mdiChevronRight,
    mdiClockOutline,
    mdiClose,
    mdiCloseCircleOutline
} from "@mdi/js";
import CandidatureProgress from "../../candidatures/CandidatureProgress";
import React, {useContext, useEffect, useState} from "react";
import {CandidatureContext} from "../../../providers/CandidatureProvider";
import {useTranslation} from "react-i18next";
import {AuthContext} from "../../../providers/AuthProvider";

const CandidatureEtudiantDashboard = () => {

    const {t} = useTranslation();
    const {currentUser} = useContext(AuthContext);
    const {candidatures, fetchCandidaturesById, setCandidatures} = useContext(CandidatureContext);
    const [currentCandidature, setCurrentCandidature] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const candidaturesInPage = candidatures.slice(startIndex, startIndex + itemsPerPage);
    const maxPages = Math.ceil(candidatures.length / itemsPerPage)

    useEffect(() => {
        if (currentUser) {
            (async function () {
                if (currentUser.role === "ETUDIANT") {
                    fetchCandidaturesById(currentUser.id);
                }
            })();
        }
        // TODO: Ici il donne WARNING: React Hook useEffect has a missing dependency: 'fetchCandidaturesById'.
        // Mais si le faire il va envoyer 9999 requêtes dans Inspect -> Network
        // It's ok, i'm just a chill guy 👈🐻👉
    }, [currentUser]);

    const handleCandidatureClick = (candidature) => {
        setCurrentCandidature(candidature)
    };

    const handlePageChange = (isNext) => {
        if(isNext){
            if(currentPage + 1 <= maxPages){
                setCurrentPage(currentPage + 1)
            }
        } else {
            if(currentPage - 1 >= 1){
                setCurrentPage(currentPage - 1)
            }
        }
    };

    const actionIsRequired = (etat) => {
        return etat === "ENTREVUE_PROPOSE"
    }

    return(
        <section>
            <h4>{t("dashboard_home_page.my_applications")}</h4>


            <div className="menu-list">
                {candidaturesInPage.map((candidature, index) => (
                    <div className="menu-list-item menu-list-item-64" key={index} onClick={() => handleCandidatureClick(candidature)}>
                        <Icon path={mdiBriefcaseOutline} size={1} />
                        <div>
                            <h6 className="m-0">{candidature.nomOffre} {(actionIsRequired(candidature.etat))?<span className="badge bg-orange">Action requise</span>:null}</h6>
                            <p className="m-0 text-dark">{candidature.compagnie}</p>
                        </div>
                        <div className="toolbar-spacer"></div>
                        {
                            (index == 0)?
                                <CandidatureProgress etat={"POSTE_OBTENU"}></CandidatureProgress>
                                :
                                <CandidatureProgress etat={candidature.etat}></CandidatureProgress>
                        }
                    </div>
                ))}

                {
                    (candidaturesInPage.length < itemsPerPage)
                        ?
                        Array.from({ length: itemsPerPage - candidaturesInPage.length }, (_, i) => (
                            <div key={i} className="menu-list-item menu-list-item-64 menu-list-item-placeholder">
                            </div>
                        ))
                        :
                        null
                }
                <div className="menu-list-item menu-list-footer">
                    <p className="m-0 text-dark">{candidatures.length} Resultats</p>
                    <div className="toolbar-spacer"></div>
                    <button className="btn-icon" disabled={currentPage === 1} onClick={() => {handlePageChange(false)}}><Icon path={mdiArrowLeft} size={1} /></button>
                    <p className="m-0">{currentPage} de {maxPages}</p>
                    <button className="btn-icon" disabled={!(currentPage < maxPages)} onClick={() => {handlePageChange(true)}}><Icon path={mdiArrowRight} size={1} /></button>
                </div>
            </div>
        </section>
    )
}

export default CandidatureEtudiantDashboard