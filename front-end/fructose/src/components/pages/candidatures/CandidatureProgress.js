import React, {useContext, useState} from "react";
import {AuthContext} from "../../providers/AuthProvider";
import {useTranslation} from "react-i18next";
import Icon from "@mdi/react";
import {mdiBriefcaseVariantOutline, mdiCheckCircleOutline, mdiFileSign, mdiForumOutline, mdiSendOutline} from "@mdi/js";

const CandidatureProgress = ({status}) => {

    const {t} = useTranslation();
    const {currentUser} = useContext(AuthContext);

    const etats = [
        "EN_ATTENTE",
        "ENTREVUE_PROPOSE",
        "ENTREVUE_ACCEPTE_ETUDIANT",
        "ENTREVUE_REFUSE_ETUDIANT",
        "CONTRAT_SIGNE_EMPLOYEUR",
        "CONTRAT_REFUSE_ETUDIANT",
        "CONTRAT_SIGNE_ETUDIANT",
        "CONTRAT_SIGNE_TOUS",
        "REFUSEE_APRES_ENTREVUE",
        "ACCEPTE_APRES_ENTREVUE"
    ]

    let indexEtat = etats.indexOf(status)

    return (
        <>
            <div className="candidature-progressbar-frame">
                <div className="candidature-progressbar-segment">
                    <div className="candidature-progressbar-segment-info">
                        <Icon path={mdiSendOutline} size={0.6} />
                        <p>Envoi</p>
                    </div>
                    <div className={"candidature-progressbar-segment-bar " + ((indexEtat >= 0)?"bg-green":"")}>

                    </div>
                </div>
                <div className="candidature-progressbar-segment">
                    <div className="candidature-progressbar-segment-info">
                        <Icon path={mdiCheckCircleOutline} size={0.6} />
                        <p>Selection</p>
                    </div>
                    <div className="candidature-progressbar-segment-bar bg-secondary">

                    </div>
                </div>
                <div className="candidature-progressbar-segment">
                    <div className="candidature-progressbar-segment-info">
                        <Icon path={mdiForumOutline} size={0.6} />
                        <p>Entrevue</p>
                    </div>
                    <div className="candidature-progressbar-segment-bar">

                    </div>
                </div>
                <div className="candidature-progressbar-segment">
                    <div className="candidature-progressbar-segment-info">
                        <Icon path={mdiFileSign} size={0.6} />
                        <p>Contrat</p>
                    </div>
                    <div className="candidature-progressbar-segment-bar">

                    </div>
                </div>
                <div className="candidature-progressbar-segment">
                    <div className="candidature-progressbar-segment-info">
                        <Icon path={mdiBriefcaseVariantOutline} size={0.6} />
                        <p>Poste</p>
                    </div>
                    <div className="candidature-progressbar-segment-bar">

                    </div>
                </div>
            </div>
        </>
    )
}
export default CandidatureProgress