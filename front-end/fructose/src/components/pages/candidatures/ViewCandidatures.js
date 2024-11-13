import {Link} from "react-router-dom";
import Icon from "@mdi/react";
import {
    mdiAccountSchoolOutline,
    mdiArrowLeft,
    mdiBriefcaseCheckOutline,
    mdiBriefcaseRemoveOutline,
    mdiClose,
    mdiDownloadOutline,
    mdiFileSign,
    mdiPresentation,
    mdiTooltipPlusOutline
} from "@mdi/js";
import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import PdfPreview from "../../../utilities/pdf/PdfPreview";
import {AuthContext} from "../../providers/AuthProvider";

const ViewCandidatures = () => {
    const {t} = useTranslation();
    const [currentCandidature, setCurrentCandidature] = useState({});
    const [candidatures, setCandidatures] = useState([]);
    const {currentToken} = useContext(AuthContext);

    useEffect(() => {
        fetch("/candidatures/candidaturesEmployeur", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": currentToken
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Fetched candidatures:", data);
                if (data.length > 0) {
                    setCurrentCandidature(data[0].candidature);
                }
                setCandidatures(data);
            })
            .catch(error => console.error("Error fetching candidatures", error));
    }, [currentToken]);

    const handleCandidatureClick = (candidature) => {
        setCurrentCandidature(candidature);
    };

    const handleApprove = () => {
        fetch(`/candidatures/approuver/${currentCandidature.id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": currentToken
            }
        })
            .then(response => {
                if (response.ok) {
                    console.log("Candidature approved successfully");
                } else {
                    console.error("Error approving candidature");
                }
            })
            .catch(error => {
                console.error("Error approving candidature", error);
            });
    };

    const handleRefuse = () => {
        const commentaireRefus = prompt("Please enter the refusal comment:");
        if (commentaireRefus) {
            fetch(`/candidatures/refuser/${currentCandidature.id}?commentaireRefus=${encodeURIComponent(commentaireRefus)}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": currentToken
                }
            })
                .then(response => {
                    if (response.ok) {
                        console.log("Candidature refused successfully");
                    } else {
                        console.error("Error refusing candidature");
                    }
                })
                .catch(error => {
                    console.error("Error refusing candidature", error);
                });
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
                <h1>Gestion des Candidatures</h1>
            </div>
            <div style={{display: "flex", gap: "20px"}}>
                <div className="dashboard-card" style={{width: "30%"}}>
                    <section>
                        <button className="btn-option btn-selected">
                            <Icon path={mdiTooltipPlusOutline} size={1}/>
                            Nouvelles candidatures
                        </button>
                        <button className="btn-option">
                            <Icon path={mdiPresentation} size={1}/>
                            En Entrevue
                        </button>
                        <button className="btn-option">
                            <Icon path={mdiFileSign} size={1}/>
                            En signature Contrat
                        </button>
                        <button className="btn-option">
                            <Icon path={mdiBriefcaseCheckOutline} size={1}/>
                            Poste Accepté
                        </button>
                        <button className="btn-option">
                            <Icon path={mdiBriefcaseRemoveOutline} size={1}/>
                            Candidatures rejetées
                        </button>
                    </section>
                </div>
                <div className="dashboard-card" style={{width: "40%"}}>
                    <section>
                        <h5>Vos Candidatures</h5>
                        <div className="menu-list">
                            {candidatures.map(candidature => (
                                <div
                                    key={candidature.candidature.id}
                                    className={`menu-list-item ${currentCandidature.id === candidature.candidature.id ? 'menu-list-item-selected' : ''}`}
                                    onClick={() => handleCandidatureClick(candidature.candidature)}
                                >
                                    <Icon path={mdiAccountSchoolOutline} size={1}/>
                                    <div>
                                        <p className="m-0">{candidature.etudiant.fullName}</p>
                                        <p className="m-0">{candidature.etudiant.matricule}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
                <div className="dashboard-card" style={{width: "30%"}}>
                    <div className="toolbar-items" style={{padding: "10px 10px 10px 16px"}}>
                        <span className="toolbar-spacer"></span>
                        <button className="btn-icon" onClick={() => setCurrentCandidature({})}>
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
                                <h4 className="m-0">{currentCandidature.offreStageDTO ? currentCandidature.offreStageDTO.nom : "Loading"}</h4>
                                <h6 className="m-0 text-dark">{currentCandidature.offreStageDTO ? currentCandidature.offreStageDTO.compagnie : "Loading"}</h6>
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
                        <div style={{gap: "10px"}} className="toolbar-items">
                            <button
                                className="btn-filled toolbar-spacer bg-green"
                                onClick={handleApprove}
                            >
                                {t("manage_users_page.approve")}
                            </button>
                            <button
                                className="btn-filled toolbar-spacer bg-red"
                                onClick={handleRefuse}
                            >
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
                                <h6 className="m-0">{currentCandidature.etudiantDTO ? currentCandidature.etudiantDTO.fullName : "Loading"}</h6>
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