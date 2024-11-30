import Icon from "@mdi/react";
import {mdiBriefcaseOutline} from "@mdi/js";
import CandidatureProgress from "../../candidatures/CandidatureProgress";
import React from "react";

const CandidatureEtudiantDashboard = () => {
    return(
        <section>
            <div className="menu-list">
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