import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../providers/AuthProvider";
import {Link, useNavigate} from "react-router-dom";
import Icon from "@mdi/react";
import {
    mdiAccountCircle,
    mdiAlertCircleOutline, mdiArrowRight, mdiBriefcaseOutline,
    mdiBriefcasePlusOutline,
    mdiBriefcaseRemoveOutline, mdiBriefcaseVariantOutline,
    mdiCheck,
    mdiCheckCircleOutline,
    mdiChevronRight,
    mdiClockOutline,
    mdiClose,
    mdiCloseCircleOutline,
    mdiFileDocumentOutline, mdiFileSign, mdiForumOutline,
    mdiHelpCircleOutline,
    mdiPlus, mdiSendOutline
} from "@mdi/js";
import {OffreStageContext} from "../../providers/OffreStageProvider";
import {CvContext} from "../../providers/CvProvider";
import {useTranslation} from "react-i18next";
import DashboardHomeAdmin from "../admin/DashboardAdmin";
import OfferPreview from "../offre-stage/OfferPreview";
import {CandidatureContext} from "../../providers/CandidatureProvider";
import Swal from "sweetalert2";
import CandidatureProgress from "../candidatures/CandidatureProgress";

const DashboardHome = () => {

    const {t} = useTranslation();
    const {currentUser} = useContext(AuthContext);
    const {GetCvs} = useContext(CvContext);
    const [cvs, setCvs] = useState([]);
    const [offresStage, setOffresStage] = useState([]);
    const [currentOffer, setCurrentOffer] = useState(null);
    const {fetchOffresStage} = useContext(OffreStageContext);
    const {deleteOffreStage} = useContext(OffreStageContext);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const {candidatures, fetchCandidaturesById, setCandidatures} = useContext(CandidatureContext);
    const [currentCandidature, setCurrentCandidature] = useState(null);
    const navigate = useNavigate();
    const {currentToken} = useContext(AuthContext)

    const handleCvClick = (cv) => {
        navigate("/dashboard/manage-cvs", {state: {selectedCv: cv}});
    };

    const handleAcceptInterview = async () => {
        Swal.fire({
            title: 'Êtes-vous sûr?',
            html: `La date de votre entrevue proposée par Employeur est le :<br><strong>${new Date(currentCandidature.dateEntrevue).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            })}<br></strong> L'acceptation est irréversible et vous engage à participer à l'entrevue à cette date.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, accepter!',
            cancelButtonText: 'Annuler'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/candidatures/modifierEtatCandidature/${currentCandidature.id}?nouvelEtat=ENTREVUE_ACCEPTE_ETUDIANT`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': currentToken
                        }
                    });
                    if (response.ok) {
                        setCurrentCandidature({
                            ...currentCandidature,
                            etat: 'ENTREVUE_ACCEPTE_ETUDIANT'
                        });
                        setCandidatures(prevCandidatures => prevCandidatures.map(candidature =>
                            candidature.id === currentCandidature.id ? {
                                ...candidature,
                                etat: 'ENTREVUE_ACCEPTE_ETUDIANT'
                            } : candidature
                        ));
                        Swal.fire({
                            title: 'Accepté!',
                            text: "L'entrevue a été acceptée.",
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    } else {
                        Swal.fire({
                            title: 'Erreur!',
                            text: "Échec de l'acceptation de l'entrevue.",
                            icon: 'error'
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        title: 'Erreur!',
                        text: "Une erreur s'est produite lors de l'acceptation de l'entrevue.",
                        icon: 'error'
                    });
                }
            }
        });
    };

    const handleRefuseInterview = async () => {
        Swal.fire({
            title: 'Êtes-vous sûr?',
            text: "Vous êtes sur le point de refuser l'entrevue. Cette action est irréversible. Votre candidature pour cet Offre de Stage sera refusée.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, refuser!',
            cancelButtonText: 'Annuler'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/candidatures/modifierEtatCandidature/${currentCandidature.id}?nouvelEtat=ENTREVUE_REFUSE_ETUDIANT`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': currentToken
                        }
                    });
                    if (response.ok) {
                        setCurrentCandidature({
                            ...currentCandidature,
                            etat: 'ENTREVUE_REFUSE_ETUDIANT'
                        });
                        setCandidatures(prevCandidatures => prevCandidatures.map(candidature =>
                            candidature.id === currentCandidature.id ? {
                                ...candidature,
                                etat: 'ENTREVUE_REFUSE_ETUDIANT'
                            } : candidature
                        ));
                        await Swal.fire({
                            title: 'Refusé!',
                            text: "L'entrevue a été refusée.",
                            icon: 'error',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    } else {
                        await Swal.fire({
                            title: 'Erreur!',
                            text: "Échec du refus de l'entrevue.",
                            icon: 'error'
                        });
                    }
                } catch (error) {
                    console.error("Error refusing interview:", error);
                    Swal.fire({
                        title: 'Erreur!',
                        text: "Une erreur s'est produite lors du refus de l'entrevue.",
                        icon: 'error'
                    });
                }
            }
        });
    };

    // TODO : ATTACHER SIGNATURE DU CONTRAT ICI CAR C'EST LE BUTTON DE SIGNER LE CONTRAT
    // Principalement dans if(response.ok) { ... } AVANT SWAL.FIRE
    const handleSignerContrat = async () => {
        Swal.fire({
            title: 'Êtes-vous sûr?',
            text: "Vous seriez invité à signer le contrat. Cette action est irréversible. Votre candidature pour cet Offre de Stage sera approuvé.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, signer le contrat!',
            cancelButtonText: 'Reviser ma décision'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/candidatures/modifierEtatCandidature/${currentCandidature.id}?nouvelEtat=CONTRAT_SIGNE_ETUDIANT`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': currentToken
                        }
                    });
                    if (response.ok) {
                        setCurrentCandidature({
                            ...currentCandidature,
                            etat: 'CONTRAT_SIGNE_ETUDIANT'
                        });
                        setCandidatures(prevCandidatures => prevCandidatures.map(candidature =>
                            candidature.id === currentCandidature.id ? {
                                ...candidature,
                                etat: 'CONTRAT_SIGNE_ETUDIANT'
                            } : candidature
                        ));
                        await Swal.fire({
                            title: 'Accepté!',
                            text: "Le contrat a été signé avec succès.",
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        await Swal.fire({
                            title: 'Erreur!',
                            text: "Échec de la signature du contrat.",
                            icon: 'error'
                        });
                    }
                } catch (error) {
                    await Swal.fire({
                        title: 'Erreur!',
                        text: "Une erreur s'est produite lors de la signature du contrat.",
                        icon: 'error'
                    });
                }
            }
        });
    };

    const handleRefuserContrat = async () => {
        Swal.fire({
            title: 'Êtes-vous sûr?',
            text: "Vous êtes sur le point de refuser la signature du contrat. Cette action est irréversible. Votre candidature pour cet Offre de Stage sera refusée.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, refuser la signature!',
            cancelButtonText: 'Reviser ma décision'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/candidatures/modifierEtatCandidature/${currentCandidature.id}?nouvelEtat=CONTRAT_REFUSE_ETUDIANT`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': currentToken
                        }
                    });
                    if (response.ok) {
                        setCurrentCandidature({
                            ...currentCandidature,
                            etat: 'CONTRAT_REFUSE_ETUDIANT'
                        });
                        setCandidatures(prevCandidatures => prevCandidatures.map(candidature =>
                            candidature.id === currentCandidature.id ? {
                                ...candidature,
                                etat: 'CONTRAT_REFUSE_ETUDIANT'
                            } : candidature
                        ));
                        await Swal.fire({
                            title: 'Refusé!',
                            text: "La signature du contrat a été refusé.",
                            icon: 'error',
                            showConfirmButton: false,
                            timer: 2000
                        });
                    } else {
                        await Swal.fire({
                            title: 'Erreur!',
                            text: "Échec du refus de la signature du contrat.",
                            icon: 'error'
                        });
                    }
                } catch (error) {
                    await Swal.fire({
                        title: 'Erreur!',
                        text: "Une erreur s'est produite lors du refus du contrat.",
                        icon: 'error'
                    });
                }
            }
        });
    };

    useEffect(() => {
        if (currentUser) {
            (async function () {
                if (currentUser.role === "ETUDIANT") {
                    try {
                        const response = await GetCvs();
                        const data = await response.json();
                        setCvs(data);
                    } catch (error) {
                        console.log("Erreur lors de la récupération des CVs : " + error);
                    }
                    fetchCandidaturesById(currentUser.id);
                }

                if (currentUser.role === "EMPLOYEUR" || currentUser.role === "ETUDIANT" || currentUser.role === "PROFESSEUR") {
                    try {
                        const response = await fetchOffresStage();
                        setOffresStage(response);
                    } catch (error) {
                        console.log("error" + error);
                    }
                }
            })();
        }
        // TODO: Ici il donne WARNING: React Hook useEffect has a missing dependency: 'fetchCandidaturesById'.
        // Mais si le faire il va envoyer 9999 requêtes dans Inspect -> Network
    }, [currentUser, GetCvs, fetchOffresStage]);

    const handleDeleteOffreStage = async (offreStageId) => {
        try {
            const response = await deleteOffreStage(offreStageId);
            if (response.ok) {
                setOffresStage((prevOffreStages) => prevOffreStages.filter((offreStage) => offreStage.id !== offreStageId));
                setCurrentOffer(null);
            } else {
                console.error("Error deleting offre stage:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting offre stage:", error);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const GetOffreStageSection = () => {
        if (currentUser != null) {
            if (currentUser.role === "ETUDIANT") {
                if (offresStage.length !== 0) {
                    return (
                        <section>
                            <div className={"toolbar-items"}>
                                <h4 className={"m-0 toolbar-spacer"}>{t("dashboard_home_page.my_offers")}</h4>
                                <Link to="/dashboard/discover-offers">
                                    <button>{t("dashboard_home_page.explore")}
                                        <Icon path={mdiChevronRight} size={1}/>
                                    </button>
                                </Link>
                            </div>
                            <div style={{
                                "padding": "10px 0",
                                display: "flex",
                                gap: "10px",
                                width: "100%"
                            }}>
                                {offresStage.reverse().slice(0, 3).map((item, index) => (
                                    <Link to={`/dashboard/discover-offers?offer=${item.id}`} key={index} style={{
                                        textDecoration: "none",
                                        flex: 1
                                    }}>
                                        <div className="card">
                                            <div className="card-image">
                                                <h5>{item.poste}</h5>
                                            </div>
                                            <div className="card-content">
                                                <p style={{
                                                    fontSize: "11px",
                                                    textTransform: "uppercase"
                                                }} className="text-dark">
                                                    {t("programme." + item.departementDTO.nom)}
                                                </p>
                                                <p>{item.ownerDTO.companyName}</p>
                                                {
                                                    (item.nombrePostes <= 5) ?
                                                        <span className="badge text-mini"><Icon
                                                            path={mdiAlertCircleOutline}
                                                            size={0.5}/>{t("dashboard_home_page.limited_places")}
														</span>
                                                        :
                                                        <></>
                                                }
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    );
                } else {
                    return (
                        <section>
                            <div className={"toolbar-items"}>
                                <h4 className={"m-0 toolbar-spacer"}>{t("dashboard_home_page.my_offers")}</h4>
                                <Link to="/dashboard/discover-offers">
                                    <button>{t("dashboard_home_page.explore")}
                                        <Icon path={mdiChevronRight} size={1}/>
                                    </button>
                                </Link>
                            </div>
                            <div style={{"padding": "10px 0"}}>
                                <div style={{
                                    "width": "400px",
                                    "height": "320px",
                                    "display": "flex",
                                    "alignItems": "center",
                                    "justifyContent": "center",
                                    "backgroundColor": "#eee",
                                    "borderRadius": "5px"
                                }}>
                                    <div style={{"textAlign": "center"}}>
                                        <Icon path={mdiBriefcaseRemoveOutline} size={1}/>
                                        <p>{t("dashboard_home_page.no_offers")}</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    );
                }
            } else if (currentUser.role === "EMPLOYEUR" || currentUser.role === "PROFESSEUR") {
                const startIndex = (currentPage - 1) * itemsPerPage;
                const selectedOffresStage = offresStage.slice(startIndex, startIndex + itemsPerPage);

                return (
                    <section>
                        <div className={"toolbar-items"}>
                            <h4 className={"m-0 toolbar-spacer"}>{t("dashboard_home_page.offers")}</h4>
                            {currentUser.role === "EMPLOYEUR" && (
                                <Link to="/dashboard/creer-offre-stage">
                                    <button className={"btn-filled"}>
                                        <Icon path={mdiBriefcasePlusOutline} size={1}/>
                                        {t("dashboard_home_page.add_offer")}
                                    </button>
                                </Link>
                            )}
                        </div>
                        <div style={{"padding": "10px 0"}}>
                            {offresStage.length === 0 ? (
                                <div style={{
                                    "width": "400px",
                                    "display": "flex",
                                    "alignItems": "center",
                                    "backgroundColor": "#eee",
                                    "borderRadius": "5px",
                                    "gap": "5px",
                                    "padding": "10px"
                                }}>
                                    <Icon path={mdiBriefcasePlusOutline} size={1}/>
                                    <p className="m-0">{t("dashboard_home_page.no_offers")}</p>
                                </div>
                            ) : (
                                <div style={{
                                    "width": "auto",
                                    "backgroundColor": "#eee",
                                    "borderRadius": "5px",
                                    "padding": "10px"
                                }}>
                                    <div style={{display: "flex", gap: "20px"}}>
                                        <div className="menu-list" style={{
                                            flex: 1,
                                            backgroundColor: "#f9f9f9",
                                            borderRadius: "5px",
                                            padding: "10px"
                                        }}>
                                            {selectedOffresStage.map((offreStage, index) => (
                                                <div key={index}
                                                     style={{
                                                         display: "flex",
                                                         alignItems: "center",
                                                         gap: "10px",
                                                         padding: "5px",
                                                         borderBottom: "1px solid #ddd",
                                                         cursor: "pointer",
                                                         backgroundColor: currentOffer && currentOffer.id === offreStage.id ? "#e0e0e0" : "transparent"
                                                     }}
                                                     onClick={() => setCurrentOffer(currentOffer && currentOffer.id === offreStage.id ? null : offreStage)}>
                                                    <Icon path={mdiBriefcasePlusOutline} size={1}/>
                                                    {currentUser.role === "EMPLOYEUR" && offreStage && (
                                                        <div>
                                                            {offreStage.isApproved ? (
                                                                <Icon path={mdiCheck} size={1} color="green"/>
                                                            ) : offreStage.isRefused ? (
                                                                <Icon path={mdiClose} size={1} color="red"/>
                                                            ) : (
                                                                <Icon path={mdiClockOutline} size={1} color="orange"/>
                                                            )}
                                                        </div>
                                                    )}
                                                    <p className="m-0">{offreStage.nom}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {currentOffer &&
                                            <OfferPreview
                                                currentOffer={currentOffer}
                                                handleDeleteOffreStage={handleDeleteOffreStage}
                                                style={{
                                                    flex: 2,
                                                    padding: "10px",
                                                    backgroundColor: "#fff",
                                                    borderRadius: "5px",
                                                    boxShadow: "0 0 10px rgba(0,0,0,0.1)"
                                                }}/>}
                                    </div>
                                </div>
                            )}
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "5px",
                                marginTop: "20px"
                            }}>
                                {Array.from({length: Math.ceil(offresStage.length / itemsPerPage)}, (_, index) => (
                                    <button
                                        key={index}
                                        className={(currentPage === index + 1) ? "btn-filled" : ""}
                                        onClick={() => {
                                            handlePageChange(index + 1);
                                            setCurrentOffer(null);
                                        }}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>
                );
            } else if (currentUser.role === "ADMIN") {
                return (
                    <DashboardHomeAdmin/>
                );
            }
        }
    }

    const GetUserManagementSection = () => {
        if (currentUser != null) {
            if (currentUser.role === "ADMIN") {
                return (
                    <section>
                        <div className={"toolbar-items"}>
                            <h4 className={"m-0 toolbar-spacer"}>{t("dashboard_home_page.user_management")}</h4>
                            <Link to="./admin/manage-users">
                                <button>{t("dashboard_home_page.not_approved_users")}
                                    <Icon path={mdiChevronRight} size={1}/>
                                </button>
                            </Link>
                        </div>
                    </section>
                )
            }
        }
    }

    const GetCandidatureManagementSection = () => {
        if (currentUser != null) {
            if (currentUser.role === "EMPLOYEUR") {
                return (
                    <section>
                        <div className={"toolbar-items"}>
                            <h4 className={"m-0 toolbar-spacer"}>Candidatures</h4>
                            <Link to="/dashboard/view-candidatures">
                                <button>Voir
                                    <Icon path={mdiChevronRight} size={1}/>
                                </button>
                            </Link>
                        </div>
                    </section>
                );
            }
        }
    };

    const GetPortfolioSection = () => {
        if (currentUser != null) {
            if (currentUser.role === "ETUDIANT") {
                return (
                    <section>
                        <div className={"toolbar-items"}>
                            <h4 className={"m-0 toolbar-spacer"}>{t("dashboard_home_page.portfolio")}</h4>
                            <Link to="/dashboard/manage-cvs">
                                <button>{t("dashboard_home_page.manage")}
                                    <Icon path={mdiChevronRight} size={1}/>
                                </button>
                            </Link>
                            <Link to="/dashboard/upload-cv">
                                <button>{t("dashboard_home_page.add_cv")}
                                    <Icon path={mdiPlus} size={1}/>
                                </button>
                            </Link>
                        </div>
                        <div style={{"padding": "10px 0"}}>
                            {cvs.length === 0 ? (
                                <div style={{
                                    "width": "400px",
                                    "display": "flex",
                                    "alignItems": "center",
                                    "backgroundColor": "#eee",
                                    "borderRadius": "5px",
                                    "gap": "5px",
                                    "padding": "10px"
                                }}>
                                    <Icon path={mdiFileDocumentOutline} size={1}/>
                                    <p className="m-0">{t("dashboard_home_page.no_cv")}</p>
                                </div>
                            ) : (
                                <div style={{
                                    "display": "flex",
                                    "flexDirection": "column",
                                    "gap": "5px"
                                }}>
                                    {cvs.map((cv, index) => (
                                        <div key={index} style={{
                                            "width": "400px",
                                            "display": "flex",
                                            "alignItems": "center",
                                            "backgroundColor": "#eee",
                                            "borderRadius": "5px",
                                            "padding": "10px",
                                            "marginBottom": "5px",
                                            "cursor": "pointer"
                                        }} onClick={() => handleCvClick(cv)}>
                                            <p style={{
                                                "margin": "0",
                                                "display": "flex",
                                                "alignItems": "center",
                                                "flexGrow": 1
                                            }}>
                                                <Icon path={mdiFileDocumentOutline} size={1}/>
                                                {cv.filename}
                                            </p>
                                            {cv.isApproved &&
                                                <Icon path={mdiCheck} size={1} color="green"
                                                      style={{marginLeft: "5px"}}/>}
                                            {cv.isRefused &&
                                                <Icon path={mdiClose} size={1} color="red"
                                                      style={{marginLeft: "5px"}}/>}
                                            {!cv.isApproved && !cv.isRefused &&
                                                <Icon path={mdiClockOutline} size={1} color="orange"
                                                      style={{marginLeft: "5px"}}/>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                )
            }
        }
    }

    const handleCandidatureClick = (candidature) => {
        setCurrentCandidature(candidature)
    };

    const GetCandidaturesWindow = () => {
        if (currentCandidature) {
            return (
                <div className="window-frame">
                    <div className="window">
                        <div className="window-titlebar">
                            <h5>Candidature</h5>
                            <span className="toolbar-spacer"></span>
                            <button className="btn-icon" onClick={() => setCurrentCandidature(null)}>
                                <Icon path={mdiClose} size={1}/>
                            </button>
                        </div>
                        <div className="window-content">
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
                                        <h4 className="m-0">{currentCandidature.nomOffre ? currentCandidature.nomOffre : "N/A"}</h4>
                                        <h6 className="m-0 text-dark">{currentCandidature.compagnie ? currentCandidature.compagnie : "N/A"}</h6>
                                    </div>
                                    <button className="btn-outline">Voir Offre</button>
                                </div>
                            </section>

                            <hr/>

                            <section className="nospace">
                                {/*SECTION CANDIDATURE INITIALE VUE ETUDIANT*/}
                                <h5>Candidature initiale</h5>
                                {
                                    // ÉTAT INITIALE
                                    (currentCandidature.etat === "EN_ATTENTE")
                                        ?
                                        <div className="toolbar-items">
                                            <Icon path={mdiClockOutline} size={1} className="text-orange"/>
                                            <p className="text-orange m-0">En attente de la réponse de l'employeur</p>
                                        </div>
                                        :
                                        // SI ENTREVUE A ÉTÉ PROPOSÉE PAR EMPLOYEUR
                                        // SI ENTREVUE A ÉTÉ ACCEPTÉE PAR L'ÉTUDIANT
                                        // SI ENTREVUE A ÉTÉ REFUSÉE PAR L'ÉTUDIANT
                                        // SI CONTRAT A ÉTÉ SIGNÉ PAR L'EMPLOYEUR
                                        // SI CONTRAT A ÉTÉ REFUSÉ PAR L'ÉTUDIANT
                                        // SI CONTRAT A ÉTÉ SIGNÉ PAR L'ÉTUDIANT
                                        // SI CONTRAT SIGNÉ PAR TOUS
                                        // SI REFUSÉ APRÈS ENTREVUE
                                        // SI ETUDIANT ACCEPTE_APRES_ENTREVUE
                                        (currentCandidature.etat === "ENTREVUE_PROPOSE" ||
                                            currentCandidature.etat === "ENTREVUE_ACCEPTE_ETUDIANT" ||
                                            currentCandidature.etat === "ENTREVUE_REFUSE_ETUDIANT" ||
                                            currentCandidature.etat === "CONTRAT_SIGNE_EMPLOYEUR" ||
                                            currentCandidature.etat === "CONTRAT_REFUSE_ETUDIANT" ||
                                            currentCandidature.etat === "CONTRAT_SIGNE_ETUDIANT" ||
                                            currentCandidature.etat === "CONTRAT_SIGNE_TOUS" ||
                                            currentCandidature.etat === "REFUSEE_APRES_ENTREVUE" ||
                                            currentCandidature.etat === "ACCEPTE_APRES_ENTREVUE") ?
                                            <div className="toolbar-items">
                                                <Icon path={mdiCheckCircleOutline} size={1} className="text-green"/>
                                                <p className="text-green m-0">Approuvé</p>
                                            </div>
                                            :
                                            // SI CANDIDATURE A ÉTÉ REFUSÉE PAR EMPLOYEUR
                                            <div className="toolbar-items">
                                                <Icon path={mdiCloseCircleOutline} size={1} className="text-red"/>
                                                <p className="text-red m-0">Refusé avec le commentaire
                                                    : {currentCandidature.commentaireRefus}</p>
                                            </div>
                                }
                            </section>

                            <hr/>

                            <section className="nospace">
                                {/*SECTION ENTREVUE VUE ETUDIANT*/}
                                <h5>Entrevue</h5>
                                {
                                    // SI ENTREVUE A ÉTÉ PROPOSÉE PAR EMPLOYEUR
                                    (currentCandidature.etat === "ENTREVUE_PROPOSE") ?
                                        <>
                                            <div className="toolbar-items">
                                                <Icon path={mdiClockOutline} size={1} className="text-blue"/>
                                                <p className="text-blue m-0">En attente d'acceptation de la date de
                                                    l'entrevue</p>
                                            </div>
                                            <br/>
                                            <p>Date de l'entrevue: {currentCandidature.dateEntrevue}</p>
                                            <div className="toolbar-items" style={{gap: "10px"}}>
                                                <button className="btn-filled bg-green" onClick={handleAcceptInterview}>
                                                    Accepter
                                                </button>
                                                <button className="btn-filled bg-red" onClick={handleRefuseInterview}>
                                                    Refuser
                                                </button>
                                            </div>
                                        </>
                                        :
                                        // SI ENTREVUE ACCEPTÉE PAR L'ÉTUDIANT
                                        // SI CONTRAT SIGNÉ PAR L'EMPLOYEUR
                                        // SI CONTRAT REFUSÉ PAR L'ÉTUDIANT
                                        // SI CONTRAT SIGNÉ PAR L'ÉTUDIANT
                                        // SI CONTRAT SIGNÉ PAR TOUS
                                        // SI REFUSÉ APRÈS ENTREVUE
                                        // SI ETUDIANT ACCEPTE_APRES_ENTREVUE
                                        (currentCandidature.etat === "ENTREVUE_ACCEPTE_ETUDIANT" ||
                                            currentCandidature.etat === "CONTRAT_SIGNE_EMPLOYEUR" ||
                                            currentCandidature.etat === "CONTRAT_REFUSE_ETUDIANT" ||
                                            currentCandidature.etat === "CONTRAT_SIGNE_ETUDIANT" ||
                                            currentCandidature.etat === "CONTRAT_SIGNE_TOUS" ||
                                            currentCandidature.etat === "REFUSEE_APRES_ENTREVUE" ||
                                            currentCandidature.etat === "ACCEPTE_APRES_ENTREVUE") ?
                                            <>
                                                <div className="toolbar-items">
                                                    <Icon path={mdiCheckCircleOutline} size={1} className="text-green"/>
                                                    <p className="text-green m-0">Entrevue a été acceptée par
                                                        l'étudiant</p>
                                                </div>
                                                <br/>
                                                <p>Date de l'entrevue proposé: {currentCandidature.dateEntrevue}</p>
                                            </>
                                            :
                                            // SI ENTREVUE A ÉTÉ REFUSÉE PAR L'ÉTUDIANT
                                            (currentCandidature.etat === "ENTREVUE_REFUSE_ETUDIANT") ?
                                                <div className="toolbar-items">
                                                    <Icon path={mdiCloseCircleOutline} size={1} className="text-red"/>
                                                    <p className="text-red m-0">L'entrevue a été refusée par
                                                        l'étudiant</p>
                                                </div>
                                                :
                                                // SI CANDIDATURE A ÉTÉ REFUSÉE PAR EMPLOYEUR
                                                (currentCandidature.etat === "REFUSEE") ?
                                                    <div className="toolbar-items">
                                                        <Icon path={mdiCloseCircleOutline} size={1}
                                                              className="text-dark"/>
                                                        <p className="text-dark m-0">L'entrevue ne peut être planifiée
                                                            pour une candidature refusée</p>
                                                    </div>
                                                    :
                                                    // TOMBE EN DEFAULT ÉTAT INITIALE
                                                    <div className="toolbar-items">
                                                        <Icon path={mdiHelpCircleOutline} size={1}
                                                              className="text-dark"/>
                                                        <p className="text-dark m-0">En attente de la candidature
                                                            initiale</p>
                                                    </div>
                                }
                            </section>

                            <hr/>

                            <section className="nospace">
                                {/*SECTION CONTRAT  VUE ETUDIANT*/}
                                <h5>Contrat</h5>
                                {
                                    // SI CANDIDATURE A ÉTÉ REFUSÉE
                                    (currentCandidature.etat === "REFUSEE") ?
                                        <div className="toolbar-items">
                                            <Icon path={mdiCloseCircleOutline} size={1} className="text-dark"/>
                                            <p className="text-dark m-0">L'entrevue ne peut être planifiée pour une
                                                candidature refusée</p>
                                        </div>
                                        :
                                        // SI ENTREVUE A ÉTÉ ACCEPTÉE
                                        (currentCandidature.etat === "ENTREVUE_ACCEPTE_ETUDIANT") ?
                                            <div className="toolbar-items">
                                                <Icon path={mdiHelpCircleOutline} size={1} className="text-orange"/>
                                                <p className="text-orange m-0">En attente des résultats de
                                                    l'entrevue</p>
                                            </div>
                                            :
                                            // SI ENTREVUE A ÉTÉ REFUSÉE PAR L'ÉTUDIANT
                                            (currentCandidature.etat === "ENTREVUE_REFUSE_ETUDIANT") ?
                                                <div className="toolbar-items">
                                                    <Icon path={mdiCloseCircleOutline} size={1} className="text-dark"/>
                                                    <p className="text-dark m-0">Le contrat ne peut être proposé pour
                                                        une entrevue refusée par étudiant</p>
                                                </div>
                                                :
                                                // SI CONTRAT A ÉTÉ SIGNÉ PAR L'EMPLOYEUR
                                                (currentCandidature.etat === "CONTRAT_SIGNE_EMPLOYEUR") ?
                                                    <>
                                                        <div className="toolbar-items">
                                                            <Icon path={mdiCheckCircleOutline} size={1}
                                                                  className="text-green"/>
                                                            <p className="text-green m-0">Contrat signé par
                                                                l'employeur</p>
                                                        </div>
                                                        <br></br>
                                                        <div className="toolbar-items" style={{gap: "10px"}}>
                                                            <button className="btn-filled bg-green"
                                                                    onClick={handleSignerContrat}>
                                                                Signer
                                                            </button>
                                                            <button className="btn-filled bg-red"
                                                                    onClick={handleRefuserContrat}>
                                                                Refuser
                                                            </button>
                                                        </div>
                                                    </>
                                                    :
                                                    // SI CONTRAT A ÉTÉ SIGNÉ PAR L'ÉTUDIANT
                                                    (currentCandidature.etat === "CONTRAT_SIGNE_ETUDIANT") ?
                                                        <>
                                                            <div className="toolbar-items">
                                                                <Icon path={mdiCheckCircleOutline} size={1}
                                                                      className="text-green"/>
                                                                <p className="text-green m-0">Contrat a été bien signé
                                                                    par l'étudiant</p>
                                                            </div>
                                                            <div className="toolbar-items">
                                                                <Icon path={mdiHelpCircleOutline} size={1}
                                                                      className="text-orange"/>
                                                                <p className="text-orange m-0">En attente de la
                                                                    signature du Gestionnaire de Stage</p>
                                                            </div>
                                                        </>
                                                        :
                                                        // SI CONTRAT A ÉTÉ REFUSÉ PAR L'ÉTUDIANT
                                                        (currentCandidature.etat === "CONTRAT_REFUSE_ETUDIANT") ?
                                                            <div className="toolbar-items">
                                                                <Icon path={mdiCloseCircleOutline} size={1}
                                                                      className="text-red"/>
                                                                <p className="text-red m-0">La signature du contrat a
                                                                    été refusée par l'étudiant. La candidature a été
                                                                    refusée.</p>
                                                            </div>
                                                            :
                                                            // SI CONTRAT A ÉTÉ SIGNÉ PAR TOUS
                                                            (currentCandidature.etat === "CONTRAT_SIGNE_TOUS") ?
                                                                <div className="toolbar-items">
                                                                    <Icon path={mdiCloseCircleOutline} size={1}
                                                                          className="text-green"/>
                                                                    <p className="text-green m-0">Tout le monde a signé
                                                                        le contrat. BRAVO! Votre candidature a été
                                                                        acceptée</p>
                                                                </div>
                                                                :
                                                                // SI ETUDIANT ACCEPTE_APRES_ENTREVUE
                                                                (currentCandidature.etat === "ACCEPTE_APRES_ENTREVUE") ?
                                                                    <>
                                                                        <div className={"toolbar-items"}>
                                                                            <Icon path={mdiHelpCircleOutline} size={1}
                                                                                  className="text-orange"/>
                                                                            <p className="text-orange m-0">En attente de
                                                                                la génération du Contrat par
                                                                                Gestionnaire</p>
                                                                        </div>
                                                                    </>
                                                                    :
                                                                    // SI CONTRAT A ÉTÉ SIGNÉ PAR TOUS
                                                                    (currentCandidature.etat === "REFUSEE_APRES_ENTREVUE") ?
                                                                        <div className="toolbar-items">
                                                                            <Icon path={mdiCloseCircleOutline} size={1}
                                                                                  className="text-red"/>
                                                                            <p className="text-red m-0">La candidature a
                                                                                été refusée après l'entrevue</p>
                                                                        </div>
                                                                        :
                                                                        // TOMBE EN DEFAULT ÉTAT INITIALE
                                                                        <div className="toolbar-items">
                                                                            <Icon path={mdiHelpCircleOutline} size={1}
                                                                                  className="text-dark"/>
                                                                            <p className="text-dark m-0">En attente des
                                                                                résultats de l'entrevue</p>
                                                                        </div>
                                }
                                <br/>
                            </section>
                        </div>
                    </div>
                </div>

            )
        }
    }

    const GetCandidaturesSection = () => {
        if (currentUser && currentUser.role === "ETUDIANT") {
            const sortedCandidatures = [...candidatures].sort((a, b) => {
                const statusOrder = {
                    "CONTRAT_SIGNE_TOUS": 1,
                    "CONTRAT_SIGNE_ETUDIANT": 2,
                    "CONTRAT_SIGNE_EMPLOYEUR": 3,
                    "ACCEPTE_APRES_ENTREVUE": 4,
                    "ENTREVUE_ACCEPTE_ETUDIANT": 5,
                    "ENTREVUE_PROPOSE": 6,
                    "EN_ATTENTE": 7,
                    "ENTREVUE_REFUSE_ETUDIANT": 8,
                    "REFUSEE_APRES_ENTREVUE": 9,
                    "CONTRAT_REFUSE_ETUDIANT": 10,
                    "REFUSEE": 11
                };
                return statusOrder[a.etat] - statusOrder[b.etat];
            });

            return (
                <section>
                    <h4>{t("dashboard_home_page.my_applications")}</h4>
                    <div>
                        {sortedCandidatures.length !== 0 ? (
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "5px"
                            }}>
                                {sortedCandidatures.map((candidature, index) => (
                                    <div key={index} style={{
                                        width: "400px",
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor: "#eee",
                                        borderRadius: "5px",
                                        padding: "10px",
                                        marginBottom: "5px",
                                        cursor: "pointer"
                                    }} onClick={() => handleCandidatureClick(candidature)}>
                                        <p style={{
                                            margin: "0",
                                            display: "flex",
                                            alignItems: "center",
                                            flexGrow: 1
                                        }}>
                                            <b><em>{candidature.nomOffre}</em></b>&nbsp;{t("dashboard_home_page.at")}&nbsp;{candidature.compagnie}
                                        </p>
                                        {candidature.etat === "CONTRAT_SIGNE_TOUS" &&
                                            <Icon path={mdiCheckCircleOutline} size={1} color="green"/>}
                                        {(candidature.etat === "ENTREVUE_ACCEPTE_ETUDIANT" || candidature.etat === "CONTRAT_SIGNE_ETUDIANT") &&
                                            <Icon path={mdiClockOutline} size={1} color="orange"
                                                  style={{marginLeft: "5px"}}/>}
                                        {(candidature.etat === "ENTREVUE_PROPOSE" || candidature.etat === "CONTRAT_SIGNE_EMPLOYEUR") &&
                                            <Icon path={mdiClockOutline} size={1} color="blue"
                                                  style={{marginLeft: "5px"}}/>}
                                        {(candidature.etat === "EN_ATTENTE") &&
                                            <Icon path={mdiClockOutline} size={1} color="orange"
                                                  style={{marginLeft: "5px"}}/>}
                                        {(candidature.etat === "ENTREVUE_REFUSE_ETUDIANT" || candidature.etat === "CONTRAT_REFUSE_ETUDIANT") &&
                                            <Icon path={mdiClose} size={1} color="red" style={{marginLeft: "5px"}}/>}
                                        {(candidature.etat === "REFUSEE" || candidature.etat === "REFUSEE_APRES_ENTREVUE") &&
                                            <Icon path={mdiCloseCircleOutline} size={1} color="red"
                                                  style={{marginLeft: "5px"}}/>}
                                        {(candidature.etat === "ACCEPTE_APRES_ENTREVUE") &&
                                            <Icon path={mdiClockOutline} size={1} color="orange"
                                                  style={{marginLeft: "5px"}}/>}

                                    </div>
                                ))}
                            </div>
                        ) : <div style={{
                            width: "400px",
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: "#eee",
                            borderRadius: "5px",
                            gap: "5px",
                            padding: "10px"
                        }}>
                            <Icon path={mdiFileDocumentOutline} size={1}/>
                            <p className="m-0">{t("dashboard_home_page.no_applications")}</p>
                        </div>}
                    </div>
                </section>
            );
        }
        return null;
    };

    return (
        <>
            <div className="dashboard-card-titlebar">
                <h1>{t("dashboard_home_page.home")}</h1>
                <h5>{t("dashboard_home_page.hello")} {(currentUser != null) ? currentUser.fullName :
                    <div className={"loading-placeholder"}></div>}
                </h5>
            </div>

            <div style={{"display": "flex", "gap": "20px"}}>
                <div style={{"width": "70%"}}>
                    <div className="dashboard-card">
                        {GetOffreStageSection()}
                        {GetCandidaturesSection()}
                        {GetCandidaturesWindow()}
                        {GetPortfolioSection()}
                        {GetUserManagementSection()}
                        {GetCandidatureManagementSection()}

						<section>
							<div className="menu-list">
								<div className="menu-list-item">
                                    <Icon path={mdiBriefcaseOutline} size={1} />
                                    <div>
                                        <h6 className="m-0">Dev Je ne sais quoi</h6>
                                        <p className="m-0 text-dark">Ubisoft Holding LLC</p>
                                    </div>
                                    <div className="toolbar-spacer"></div>
                                    <CandidatureProgress status={"EN_ATTENTE"}></CandidatureProgress>
								</div>
                                <div className="menu-list-item">
                                    <Icon path={mdiBriefcaseOutline} size={1} />
                                    <div>
                                        <h6 className="m-0">Dev Je ne sais quoi</h6>
                                        <p className="m-0 text-dark">Ubisoft Holding LLC</p>
                                    </div>
                                    <div className="toolbar-spacer"></div>
                                    <CandidatureProgress status={"EN_ATTENTE"}></CandidatureProgress>
                                </div>

                                <div className="menu-list-item menu-list-item-placeholder">
                                </div>
                                <div className="menu-list-item menu-list-item-placeholder">
                                </div>
                                <div className="menu-list-item menu-list-item-placeholder">
                                </div>
							</div>
						</section>

                        <div style={{"height": "520px"}}>
                        </div>
                    </div>
                </div>
                <div style={{"width": "30%"}}>
                    <div className="dashboard-card">
                        <div className="user-profile-section">
                            <div className="user-profile-section-banner">
                            </div>
                            <div className="user-profile-section-profile-picture centered"
                                 style={{backgroundImage: 'url("/assets/auth/default-profile.jpg")'}}>
                            </div>
                        </div>
						<br/>
                        <section className="nospace text-center">
                            <h4 className="m-0">{(currentUser != null) ? currentUser.fullName :
                                <span className={"loading-placeholder"}></span>}
                            </h4>
							<p className="m-0 text-dark">{(currentUser != null) ? currentUser.email :
								<span className={"loading-placeholder"}></span>}
							</p>
                        </section>
                        <hr/>
                        <section className="nospace">
							<h5>Suggestions</h5>
                            <div className="banner bg-primary">
                                <Icon path={mdiAccountCircle} size={1.2}/>
                                <div>
                                    <h5 className="m-0">Complétez votre profil</h5>
                                    <p className="m-0">Ajoutez un CV et commencez à postuler dès maintenant</p>
                                </div>
                            </div>
                            <div className="banner bg-grey">
                                <Icon path={mdiBriefcaseVariantOutline} size={1.2}/>
                                <div className="toolbar-spacer">
                                    <h5 className="m-0">Commencez à postuler</h5>
                                    <p className="m-0">Plusieures offres de stage disponibles</p>
                                </div>
                            </div>
                            <div className="banner bg-grey">
                                <Icon path={mdiBriefcaseVariantOutline} size={1.2}/>
                                <div className="toolbar-spacer">
                                    <h5 className="m-0">Commencez à postuler</h5>
                                    <p className="m-0">Plusieures offres de stage disponibles</p>
                                </div>
                            </div>
                        </section>
                        <hr/>
						<section className="nospace">
							<p className="text-dark">&copy; 2024 - Fructose</p>
							<p className="text-dark"><a href="">Accueil</a> - <a href="">Langue</a> - <a href="">Se deconnecter</a></p>
						    <br/>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DashboardHome;