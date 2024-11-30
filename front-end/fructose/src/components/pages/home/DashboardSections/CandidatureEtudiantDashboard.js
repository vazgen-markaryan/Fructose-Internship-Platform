import Icon from "@mdi/react";
import {mdiBriefcaseOutline, mdiCheckCircleOutline, mdiClockOutline, mdiClose, mdiCloseCircleOutline} from "@mdi/js";
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

    return(
        <section>
            <h4>{t("dashboard_home_page.my_applications")}</h4>


            <div className="menu-list">
                {candidatures.map((candidature, index) => (
                    <div className="menu-list-item" key={index} onClick={() => handleCandidatureClick(candidature)}>
                        <Icon path={mdiBriefcaseOutline} size={1} />
                        <div>
                            <h6 className="m-0">{candidature.nomOffre}</h6>
                            <p className="m-0 text-dark">{candidature.compagnie}</p>
                        </div>
                        <div className="toolbar-spacer"></div>
                        <CandidatureProgress etat={candidature.etat}></CandidatureProgress>
                    </div>
                ))}
                <div className="menu-list-item">
                    <Icon path={mdiBriefcaseOutline} size={1} />
                    <div>
                        <h6 className="m-0">Dev Je ne sais quoi</h6>
                        <p className="m-0 text-dark">Ubisoft Holding LLC</p>
                    </div>
                    <div className="toolbar-spacer"></div>
                    <CandidatureProgress etat={"EN_ATTENTE"}></CandidatureProgress>
                </div>
                <div className="menu-list-item">
                    <Icon path={mdiBriefcaseOutline} size={1} />
                    <div>
                        <h6 className="m-0">Dev Je ne sais quoi</h6>
                        <p className="m-0 text-dark">Ubisoft Holding LLC</p>
                    </div>
                    <div className="toolbar-spacer"></div>
                    <CandidatureProgress etat={"REFUSEE"}></CandidatureProgress>
                </div>
                <div className="menu-list-item">
                    <Icon path={mdiBriefcaseOutline} size={1} />
                    <div>
                        <h6 className="m-0">Dev Je ne sais quoi</h6>
                        <p className="m-0 text-dark">Ubisoft Holding LLC</p>
                    </div>
                    <div className="toolbar-spacer"></div>
                    <CandidatureProgress etat={"ENTREVUE_PROPOSE"}></CandidatureProgress>
                </div>

                <div className="menu-list-item">
                    <Icon path={mdiBriefcaseOutline} size={1} />
                    <div>
                        <h6 className="m-0">Dev Je ne sais quoi</h6>
                        <p className="m-0 text-dark">Ubisoft Holding LLC</p>
                    </div>
                    <div className="toolbar-spacer"></div>
                    <CandidatureProgress etat={"POSTE_OBTENU"}></CandidatureProgress>
                </div>

                <div className="menu-list-item">
                    <Icon path={mdiBriefcaseOutline} size={1} />
                    <div>
                        <h6 className="m-0">Dev Je ne sais quoi</h6>
                        <p className="m-0 text-dark">Ubisoft Holding LLC</p>
                    </div>
                    <div className="toolbar-spacer"></div>
                    <CandidatureProgress etat={"CONTRAT_CREE_PAR_GESTIONNAIRE"}></CandidatureProgress>
                </div>

                <div className="menu-list-item menu-list-item-placeholder">
                </div>
                <div className="menu-list-item menu-list-item-placeholder">
                </div>
                <div className="menu-list-item menu-list-item-placeholder">
                </div>
                <div className="menu-list-item menu-list-item-placeholder">
                </div>
            </div>
        </section>
    )
}

export default CandidatureEtudiantDashboard