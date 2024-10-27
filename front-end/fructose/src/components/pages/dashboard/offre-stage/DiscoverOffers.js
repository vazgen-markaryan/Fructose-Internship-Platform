import React, {useContext, useEffect, useState} from "react";
import {
    mdiArrowLeft,
    mdiCheck,
    mdiClose,
    mdiFileOutline,
    mdiClockOutline,
    mdiFileUploadOutline,
    mdiDownloadOutline,
    mdiDeleteOutline,
    mdiFileQuestionOutline,
    mdiBriefcaseRemoveOutline,
    mdiBriefcaseRemove,
    mdiCashMultiple,
    mdiBriefcase,
    mdiBriefcaseOutline
} from "@mdi/js";
import Icon from "@mdi/react";
import {AuthContext, AuthProvider} from "../../../../providers/AuthProvider";
import {Link} from "react-router-dom";
import PdfPreview from "../../../content/PdfPreview";
import {CvContext} from "../../../../providers/CvProvider";
import {useTranslation} from "react-i18next";
import {OffreStageContext} from "../../../../providers/OffreStageProvider";

const DiscoverOffers = () => {
    const {t} = useTranslation();
    const {fetchOffresStage} = useContext(OffreStageContext);
    const {isUserInit} = useContext(AuthContext);

    const [offers, setOffers] = useState([])
    const [currentOffer, setCurrentOffer] = useState(null)


    useEffect(() => {
        if (isUserInit) {
            (async function () {
                try {
                    const response = await fetchOffresStage();
                    setOffers(response)
                } catch (error) {

                }
            })();
        }
    }, [isUserInit]);

    const handleOfferSelection = (offer) => {
        setCurrentOffer(offer);
    };

    const getOfferList = () => {
        if (offers.length > 0) {
            return (
                <>
                    <h5>{offers.length} Resultats</h5>
                    <div className="menu-list">
                        {offers.slice(0, -1).reverse().map((item, index) => (
                            <div onClick={() => handleOfferSelection(item)} key={index}
                                 className={`menu-list-item ${currentOffer && item.id === currentOffer.id ? "menu-list-item-selected" : ""}`}
                                 style={{
                                     width: "100%",
                                     padding: "0",
                                     height: "170px",
                                     boxSizing: "border-box"
                                 }}>
                                <div style={{padding: "16px"}}>
                                    <p style={{fontSize: "11px", textTransform: "uppercase"}} className="text-dark">
                                        {t("programme." + item.departementDTO.nom)}
                                    </p>
                                    <h4 className="m-0">{item.poste}</h4>
                                    <p>{item.ownerDTO.companyName}</p>
                                    <p>{item.adresse}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <br/>
                    {}
                </>
            );
        }
    };

    const getAppercu = () => {
        if (currentOffer) {
            return (
                <div className="dashboard-card" style={{width: "55%", position: "sticky", top: "80px"}}>
                    <div className="toolbar-items" style={{padding: "10px 10px 10px 16px"}}>
                        <h6 className="m-0">{t('manage_cv.titles.preview')}</h6>
                        <span className="toolbar-spacer"></span>
                        <button className="btn-icon" onClick={() => setCurrentOffer(null)}><Icon path={mdiClose} size={1}/>
                        </button>
                    </div>
                    <div className="user-profile-section">
                        <div className="company-profile-section-banner"></div>
                        <div className="user-profile-section-profile-picture radius-normal"
                             style={{"backgroundImage": "url('/assets/offers/default-company.png')"}}>
                        </div>
                    </div>
                    <section>
                        <div className="toolbar-items" style={{padding: "0 10px"}}>
                            <div>
                                <h4 className="m-0">{currentOffer.poste}</h4>
                                <p className="text-dark m-0">{currentOffer.ownerDTO.companyName}</p>
                            </div>
                            <div className="toolbar-spacer"></div>
                            <button className="btn-filled">Postuler</button>
                        </div>
                        <br/>
                        <hr/>
                        <h5>Particularites</h5>
                        <div className="list-bullet">
                            <Icon path={mdiCashMultiple} size={1} />
                            <div style={{padding: "4px 0"}}>
                                <h6 className="m-0" style={{marginBottom: "5px"}}>Salaire</h6>
                                <span className="badge text-mini">C$ {currentOffer.tauxHoraire}.00</span>
                            </div>
                        </div>
                        <div className="list-bullet">
                            <Icon path={mdiBriefcaseOutline} size={1} />
                            <div style={{padding: "4px 0"}}>
                                <h6 className="m-0" style={{marginBottom: "5px"}}>Type de stage</h6>
                                <span className="badge text-mini">{t("creer_offre_stage_page.types_emploi." + currentOffer.modaliteTravail)}</span>
                            </div>
                        </div>
                    </section>
                </div>
            );
        }
        return null;
    };

    const getOffreListSection = () => {
        if (offers.length === 0) {
            return (
                <div className="dashboard-card" style={{width: "45%"}}>
                    <div className="dashboard-placeholder-card" style={{backgroundColor: "transparent"}}>
                        <div style={{textAlign: "center"}}>
                            <Icon path={mdiBriefcaseRemove} size={2} />
                            <h6 style={{margin: "8px 0 14px 0"}}>Aucune offre de stage disponible</h6>
                            <p className="text-dark">Elles apparaîtront ici dès qu'elles seront disponibles</p>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="dashboard-card" style={{width: "45%"}}>
                    <section>
                        {getOfferList()}
                    </section>
                </div>
            );
        }
    };

    return (
        <>
            <div className="dashboard-card-toolbar">
                <Link to="/dashboard">
                    <button className="btn-icon-dashboard">
                        <Icon path={mdiArrowLeft} size={1.4}/>
                    </button>
                </Link>
                <h1>Offres de Stage</h1>
            </div>
            <div style={{display: "flex", gap: "20px", alignItems: "start"}}>
                {getOffreListSection()}
                {getAppercu()}
            </div>
        </>
    );
};

export default DiscoverOffers;