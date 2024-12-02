import {AuthContext} from "../../providers/AuthProvider";
import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {CandidatureContext} from "../../providers/CandidatureProvider";
import Icon from "@mdi/react";
import {mdiBriefcasePlusOutline, mdiChevronRight, mdiFileOutline} from "@mdi/js";
import {Link} from "react-router-dom";
import PdfPreview from "../../../utilities/pdf/PdfPreview";

const EvaluationMilieuStage = () => {
    const {currentUser, currentToken} = useContext(AuthContext);
    const {t} = useTranslation();
    const {fetchCandidatureByEtatContratSigneTous} = useContext(CandidatureContext);

    const [candidatures, setCandidatures] = useState([]);
    const [evaluation, setEvaluation] = useState([]);
    const [currentEvaluation, setCurrentEvaluation] = useState(null);
    const [evaluationPdfUrl, setEvaluationPdfUrl] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (currentUser && currentUser.role === "ADMIN") {
            fetchCandidatureByEtatContratSigneTous()
                .then((data) => setCandidatures(data || []))
                .catch((error) => {
                    console.error("Erreur lors de la récupération des données :", error);
                    setCandidatures([]);
                });
            fetchAllEvaluations()
                .then((data) => setEvaluation(data || []))
                .catch((error) => {
                    console.error("Erreur lors de la récupération des données :", error);
                    setEvaluation([]);
                });
        }
    }, [currentUser]);

    const fetchAllEvaluations = async () => {
        try {
            const response = await fetch(`/evaluations/milieu-stage/all-evaluation`, {
                method: "GET", headers: {
                    "Content-Type": "application/json", Authorization: currentToken,
                },
            });
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération de l'évaluation.");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Erreur : ", error);
            throw error;
        }
    };

    const fetchEvaluationByCandidatureId = async (evaluation) => {
        try {
            const response = await fetch(`/evaluations/milieu-stage/${evaluation.id}`, {
                method: "GET", headers: {
                    "Content-Type": "application/json", "Authorization": currentToken,
                },
            });
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération de l'évaluation.");
            }
            return window.URL.createObjectURL(await response.blob());
        } catch (error) {
            console.error("Erreur : ", error);
            throw error;
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (currentUser?.role === "ADMIN") {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const selectedCandidatures = candidatures.slice(startIndex, startIndex + itemsPerPage);
        const selectedEvaluations = evaluation.slice(startIndex, startIndex + itemsPerPage);

        return (<section>
            <div className="toolbar-items">
                <h4 className="m-0 toolbar-spacer">{t("evaluation_milieu_stage.milieu_stage_a_evaluer")}</h4>
            </div>
            <div style={{padding: "10px 0"}}>
                {candidatures.length === 0 ? (<div
                    style={{
                        alignItems: "center",
                        width: "400px",
                        display: "flex",
                        backgroundColor: "#eee",
                        borderRadius: "5px",
                        gap: "5px",
                        padding: "10px"
                    }}
                >
                    <Icon path={mdiBriefcasePlusOutline} size={1}/>
                    <p className="m-0">{t("evaluation_milieu_stage.no_milieu_stage_a_evaluer")}</p>
                </div>) : (<div
                    className="menu-list"
                    style={{
                        flex: 1, backgroundColor: "#f9f9f9", borderRadius: "5px", padding: "10px"
                    }}
                >
                    {selectedCandidatures.map((candidature, index) => (<div
                        key={index}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "97%",
                            backgroundColor: "#eee",
                            borderRadius: "5px",
                            padding: "10px",
                            marginBottom: "10px",
                        }}
                    >
                        <p style={{margin: 0, flex: 1, textAlign: "left"}}>
                            {candidature.etudiant.fullName}
                        </p>

                        <Link
                            to="/dashboard/evaluation-milieu-stage-step/"
                            state={{candidature}}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                marginLeft: "auto",
                                textDecoration: "none",
                            }}
                        >
                            <>
                                <button
                                    className="btn-filled"
                                    style={{
                                        alignItems: "center",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        display: "flex",
                                        gap: "5px",
                                    }}
                                >
                                    {t("evaluation_milieu_stage.evaluer")}
                                    <Icon path={mdiChevronRight} size={1}/>
                                </button>
                            </>
                        </Link>
                    </div>))}
                </div>)}
            </div>
            <div className="toolbar-items">
                <h4>{t("evaluation_milieu_stage.evaluation_milieu_stage")}</h4>
            </div>
            <div style={{padding: "10px 0"}}>
                {evaluation.length === 0 ? (<div
                    style={{
                        alignItems: "center",
                        width: "400px",
                        display: "flex",
                        backgroundColor: "#eee",
                        borderRadius: "5px",
                        gap: "5px",
                        padding: "10px"
                    }}
                >
                    <Icon path={mdiBriefcasePlusOutline} size={1}/>
                    <p>{t("evaluation_milieu_stage.no_evaluation")}</p>
                </div>) : (<div
                    style={{
                        width: "auto", backgroundColor: "#eee", borderRadius: "5px", padding: "10px"
                    }}
                >
                    <div style={{display: "flex", gap: "20px"}}>
                        <div
                            className="menu-list"
                            style={{
                                flex: 1, backgroundColor: "#f9f9f9", borderRadius: "5px", padding: "10px"
                            }}
                        >
                            {selectedEvaluations.map((evalItem) => (<div
                                key={evalItem.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    padding: "5px",
                                    borderBottom: "1px solid #ddd",
                                    cursor: "pointer",
                                    backgroundColor: currentEvaluation && currentEvaluation.id === evalItem.id ? "#e0e0e0" : "transparent"
                                }}
                                onClick={() => {
                                    setCurrentEvaluation(evalItem);
                                    fetchEvaluationByCandidatureId(evalItem).then(setEvaluationPdfUrl);
                                }}
                            >
                                <Icon path={mdiFileOutline} size={1}/>
                                <p>
                                    {evalItem.candidatureDTO.etudiantDTO.fullName} - {evalItem.candidatureDTO.offreStageDTO.nom} - {evalItem.candidatureDTO.offreStageDTO.compagnie}
                                </p>
                            </div>))}
                        </div>
                    </div>
                </div>)}
                {currentEvaluation && (<div
                    style={{
                        flex: 2,
                        padding: "10px",
                        backgroundColor: "#fff",
                        borderRadius: "5px",
                        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
                    }}
                >
                    <PdfPreview file={evaluationPdfUrl}/>
                </div>)}
                <div
                    style={{
                        display: "flex", justifyContent: "center", marginTop: "20px"
                    }}
                >
                    {Array.from({length: Math.ceil(evaluation.length / itemsPerPage)}).map((_, index) => (<button
                        key={index}
                        className={currentPage === index + 1 ? "btn-filled" : ""}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>))}
                </div>
            </div>
        </section>);
    }
    return null;
};

export default EvaluationMilieuStage;
