import React, {useContext, useEffect, useState} from "react";
import {
    mdiArrowLeft,
    mdiCheck,
    mdiClose,
    mdiBriefcasePlusOutline,
    mdiDeleteOutline, mdiClockOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import {AuthContext} from "../../../../providers/AuthProvider";
import {Link, useNavigate} from "react-router-dom";
import {OffreStageContext} from "../../../../providers/OffreStageProvider";
import {useTranslation} from "react-i18next";

const ManageOffresStage = () => {
    const {t} = useTranslation();
    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();
    const {fetchOffresStage, deleteOffreStage, fetchOffreStage} = useContext(OffreStageContext);
    const [offreStages, setOffreStages] = useState([]);
    const [setOffreStage] = useState([]);
    const [currentOffreStage, setCurrentOffreStage] = useState(null);

    useEffect(() => {
        if (currentUser) {
            (async function () {
                if (currentUser.role === "EMPLOYEUR") {
                    try {
                        const response = await fetchOffresStage();
                        setOffreStages(response);
                    } catch (error) {
                        console.log("error" + error);
                    }
                }
            })();
        }
    }, [currentUser, fetchOffresStage]);

    const getOffreStageById = async (id) => {
        try {
            const data = await fetchOffreStage(id);
            console.log(data);
        } catch (error) {
            console.error("Error fetching offer:", error);
        }
    };

    const handleOffreStageSelection = (offreStage) => {
        if (currentOffreStage && offreStage.id === currentOffreStage.id) {
            setCurrentOffreStage(null);
        } else {
            setCurrentOffreStage(offreStage);
            console.log(offreStage);
            getOffreStageById(offreStage.id);
        }
    };

    const handleDeleteOffreStage = async (offreStageId) => {
        try {
            const response = await deleteOffreStage(offreStageId);
            if (response.ok) {
                setOffreStages((prevOffreStages) => prevOffreStages.filter((offreStage) => offreStage.id !== offreStageId));
                if (currentOffreStage && currentOffreStage.id === offreStageId) {
                    setCurrentOffreStage(null);
                }
            } else {
                console.error("Error deleting offre stage:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting offre stage:", error);
        }
    };

    const getStatutElement = (offreStage) => {
        if (offreStage) {
            if (!offreStage.isApproved && !offreStage.isRefused) {
                return (
                    <>
                        <p className="m-0 text-orange">{t('manage_offre_stage.status.pending')}</p>
                        <Icon path={mdiClockOutline} size={0.8} className="text-orange"/>
                    </>
                );
            } else if (offreStage.isApproved) {
                return (
                    <>
                        <p className="m-0 text-green">{t('manage_offre_stage.status.approved')}</p>
                        <Icon path={mdiCheck} size={0.8} className="text-green"/>
                    </>
                );
            } else if (offreStage.isRefused) {
                return (
                    <>
                        <p className="m-0 text-red">{t('manage_offre_stage.status.rejected')}</p>
                        <Icon path={mdiClose} size={0.8} className="text-red"/>
                    </>
                );
            }
        }
        return null;
    };

    const getOffreStageList = () => {
        if (offreStages.length > 0) {
            return (
                <>
                    <div className="toolbar-items">
                        <h4 className="m-0 toolbar-spacer"></h4>
                        <Link to="../creer-offre-stage">
                            <button className="btn-filled">{t('manage_offre_stage.buttons.add')} <Icon
                                path={mdiBriefcasePlusOutline} size={1}/></button>
                        </Link>
                    </div>
                    <br/>
                    <div className="menu-list">
                        {offreStages.map((offreStage, index) => (
                            <div key={index} onClick={() => handleOffreStageSelection(offreStage)}
                                 className={`menu-list-item ${currentOffreStage && offreStage.id === currentOffreStage.id ? "menu-list-item-selected" : ""}`}>
                                <Icon path={mdiBriefcasePlusOutline} size={1}/>
                                <div>
                                    <p className="m-0">{offreStage.nom}</p>
                                    <div className="toolbar-items">
                                        {getStatutElement(offreStage)}
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </>
            );
        }
    };

    const getOffreStageDetails = () => {
        if (currentOffreStage) {
            return (
                <div className="dashboard-card" style={{width: "35%"}}>
                    <div className="toolbar-items" style={{padding: "10px 10px 10px 16px"}}>
                        <h6 className="m-0">{t('manage_offre_stage.titles.details')}</h6>
                        <span className="toolbar-spacer"></span>
                        <button className="btn-icon" onClick={() => setCurrentOffreStage(null)}>
                            <Icon path={mdiClose} size={1}/>
                        </button>
                    </div>
                    <section>
                        <div className="toolbar-items" style={{padding: "0 10px"}}>
                            <div>
                                <h4 className="m-0">{currentOffreStage.nom}</h4>
                                <p className="text-dark m-0">{currentOffreStage.description}</p>
                                <p className="text-dark m-0">{t('manage_offre_stage.labels.company')}: {currentOffreStage.compagnie}</p>
                                <p className="text-dark m-0">{t('manage_offre_stage.labels.position')}: {currentOffreStage.poste}</p>
                                <p className="text-dark m-0">{t('manage_offre_stage.labels.department')}: {currentOffreStage.departementDTO.nom}</p>
                                <p className="text-dark m-0">{t('manage_offre_stage.labels.hourly_rate')}: {currentOffreStage.tauxHoraire} €</p>
                                <p className="text-dark m-0">{t('manage_offre_stage.labels.type')}: {currentOffreStage.typeEmploi}</p>
                                <p className="text-dark m-0">{t('manage_offre_stage.labels.address')}: {currentOffreStage.adresse}</p>
                                <p className="text-dark m-0">{t('manage_offre_stage.labels.work_mode')}: {currentOffreStage.modaliteTravail}</p>
                                <p className="text-dark m-0">{t('manage_offre_stage.labels.start_date')}: {currentOffreStage.dateDebut.toString()}</p>
                                <p className="text-dark m-0">{t('manage_offre_stage.labels.end_date')}: {currentOffreStage.dateFin.toString()}</p>
                                <p className="text-dark m-0">{t('manage_offre_stage.labels.hours_per_week')}: {currentOffreStage.nombreHeuresSemaine}</p>
                                <p className="text-dark m-0">{t('manage_offre_stage.labels.number_of_positions')}: {currentOffreStage.nombrePostes}</p>
                                <p className="text-dark m-0">{t('manage_offre_stage.labels.application_deadline')}: {currentOffreStage.dateLimiteCandidature.toString()}</p>
                            </div>
                        </div>
                        <br/>
                        <div className="toolbar-items toolbar-offreStage-items">
                            {getStatutElement(currentOffreStage)}
                        </div>
                        {currentOffreStage.isRefused && (
                            <p style={{color: "red", textAlign: "center"}}>{currentOffreStage.commentaireRefus}</p>
                        )}
                        <button className="btn-option"
                                onClick={() => navigate(`/dashboard/modifier-offre-stage/${currentOffreStage.id}`)}>
                            <Icon path={mdiCheck} size={1}/>{t('manage_offre_stage.buttons.modify')}
                        </button>
                        <button className="btn-option" onClick={() => handleDeleteOffreStage(currentOffreStage.id)}>
                            <Icon path={mdiDeleteOutline} size={1}/>{t('manage_offre_stage.buttons.delete')}
                        </button>
                    </section>
                </div>
            );
        }
        return null;
    };

    const getOffreStageListSection = () => {
        if (offreStages.length === 0) {
            return (
                <div className="dashboard-card" style={{width: "65%"}}>
                    <div className="dashboard-placeholder-card" style={{backgroundColor: "transparent"}}>
                        <div style={{textAlign: "center"}}>
                            <Icon path={mdiBriefcasePlusOutline} size={2}/>
                            <h6 style={{margin: "8px 0 14px 0"}}>{t('manage_offre_stage.messages.no_offre_stages')}</h6>
                            <Link to="../creer-offre-stage">
                                <button className="btn-filled">{t('manage_offre_stage.buttons.add')} <Icon
                                    path={mdiBriefcasePlusOutline} size={1}/></button>
                            </Link>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="dashboard-card" style={{width: "65%"}}>
                    <section>
                        {getOffreStageList()}
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
                <h1>{t('manage_offre_stage.titles.offre_stages')}</h1>
            </div>
            <div style={{display: "flex", gap: "20px", alignItems: "start"}}>
                {getOffreStageListSection()}
                {getOffreStageDetails()}
            </div>
        </>
    );
};

export default ManageOffresStage;
