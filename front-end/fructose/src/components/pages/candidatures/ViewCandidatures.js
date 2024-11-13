import {Link} from "react-router-dom";
import Icon from "@mdi/react";
import {
    mdiAccountOutline,
    mdiAccountSchoolOutline,
    mdiAccountTieOutline,
    mdiArrowLeft,
    mdiClose,
    mdiDeleteOutline,
    mdiDownloadOutline, mdiHumanMaleBoard
} from "@mdi/js";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import PdfPreview from "../../../utilities/pdf/PdfPreview";

const ViewCandidatures = () => {
    const {t} = useTranslation();

    const [currentCandidature, setCurrentCandidature] = useState({})

    return (
        <>
            <div className="dashboard-card-toolbar">
                <Link to="/dashboard">
                    <button className="btn-icon-dashboard">
                        <Icon path={mdiArrowLeft} size={1.4}/>
                    </button>
                </Link>
                <h1>Vos Candidatures</h1>
            </div>
            <div style={{display: "flex", gap: "20px"}}>
                <div className="dashboard-card" style={{width: "60%"}}>
                    <section>
                        <h5>Vos Candidatures</h5>

                        <div className="menu-list">

                            <div className={`menu-list-item menu-list-item-selected`}>
                                <Icon path={mdiAccountSchoolOutline} size={1}/>
                                <div>
                                    <p className="m-0">Tudose</p>
                                    <p className="m-0 text-dark">Poste 123456</p>
                                </div>
                            </div>
                            <div className={`menu-list-item`}>
                                <Icon path={mdiAccountSchoolOutline} size={1}/>
                                <div>
                                    <p className="m-0">Tudose</p>
                                    <p className="m-0 text-dark">Poste 123456</p>
                                </div>
                            </div>

                        </div>
                    </section>
                </div>
                <div className="dashboard-card" style={{width: "40%"}}>
                    <div className="toolbar-items" style={{padding: "10px 10px 10px 16px"}}>
                        <span className="toolbar-spacer"></span>
                        <button className="btn-icon" onClick={() => setCurrentCandidature(null)}>
                            <Icon path={mdiClose} size={1}/>
                        </button>
                    </div>

                    <section className="nospace">
                        <div className="toolbar-items" style={{gap: "8px"}}>
                            <div className="user-profile-section-profile-picture" style={{
                                "background": "url('/assets/offers/default-company.png') center / cover",
                                width: "52px",
                                height: "52px",
                                borderRadius: "5px",
                                margin: 0
                            }}></div>
                            <div className="toolbar-spacer">
                                <h4 className="m-0">Createur de PDF</h4>
                                <h6 className="m-0 text-dark">Ubisoft Inc</h6>
                            </div>
                            <button className="btn-outline">Voir Offre</button>
                        </div>
                    </section>
                    <hr/>
                    <section className="nospace">
                        <h5>Profil de l'applicant</h5>
                        <PdfPreview height={300} file={null}/>
                        <br/>
                        <button className="btn-option">
                            <Icon path={mdiDownloadOutline} size={1}/>{t('manage_cv.buttons.download')}
                        </button>
                    </section>
                    <hr/>
                    <section className="nospace">
                        <h5>Actions</h5>
                        <div style={{
                            gap: "10px"
                        }}
                             className="toolbar-items">
                            <button
                                className="btn-filled toolbar-spacer bg-green"
                                onClick={() => {

                                }}
                            >
                                {t("manage_users_page.approve")}
                            </button>
                            <button
                                className="btn-filled toolbar-spacer bg-red"
                                onClick={() => {

                                }}>
                                Refuser
                            </button>
                        </div>
                    </section>
                    <hr/>
                    <section className="nospace">
                        <div className="list-bullet">
                            <div className="user-profile-section-profile-picture" style={{
                                "background": "url('/assets/auth/default-profile.jpg') center / cover",
                                width: "36px",
                                height: "36px",
                                margin: 0
                            }}></div>
                            <div>
                                <h6 className="m-0">Tudose</h6>
                                <p className="m-0 text-dark">1239023</p>
                            </div>

                            <div className="toolbar-spacer"></div>
                            <a href={"mailto:"}>
                                <button>{t("discover_offers_page.contact")}</button>
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}

export {ViewCandidatures};
