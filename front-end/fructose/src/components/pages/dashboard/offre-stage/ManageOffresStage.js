import React, {useContext, useEffect, useState} from "react";
import {
    mdiArrowLeft,
    mdiCheck,
    mdiClose,
    mdiBriefcasePlusOutline,
    mdiDeleteOutline,
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
    const {fetchOffresStage, deleteOffreStage} = useContext(OffreStageContext);
    const [offreStages, setOffreStages] = useState([]);
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

    const handleOffreStageSelection = (offreStage) => {
        if (currentOffreStage && offreStage.id === currentOffreStage.id) {
            setCurrentOffreStage(null);
        } else {
            setCurrentOffreStage(offreStage);
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

    const getOffreStageList = () => {
        if (offreStages.length > 0) {
            return (
                <>
                    <div className="toolbar-items">
                        <h4 className="m-0 toolbar-spacer"></h4>
                        <Link to="../creer-offre-stage">
                            <button className="btn-filled">{t('manage_offre_stage.buttons.add')} <Icon path={mdiBriefcasePlusOutline} size={1}/></button>
                        </Link>
                    </div>
                    <br/>
                    <div className="menu-list">
                        {offreStages.map((offreStage, index) => (
                            <div key={index} onClick={() => handleOffreStageSelection(offreStage)} className={`menu-list-item ${currentOffreStage && offreStage.id === currentOffreStage.id ? "menu-list-item-selected" : ""}`}>
                                <Icon path={mdiBriefcasePlusOutline} size={1}/>
                                <div>
                                    <p className="m-0">{offreStage.nom}</p>
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
                            </div>
                        </div>
                        <br/>
                        <button className="btn-option" onClick={() => navigate(`/dashboard/modifier-offre-stage/${currentOffreStage.id}`)}>
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
                                <button className="btn-filled">{t('manage_offre_stage.buttons.add')} <Icon path={mdiBriefcasePlusOutline} size={1}/></button>
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