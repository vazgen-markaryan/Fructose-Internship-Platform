import { AuthContext } from "../../providers/AuthProvider";
import React, {useContext, useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import { CandidatureContext } from "../../providers/CandidatureProvider";
import Icon from "@mdi/react";
import {mdiBriefcasePlusOutline, mdiChevronRight} from "@mdi/js";
import {Link} from "react-router-dom";

const EvaluationEmployeur = () => {
    const { currentUser } = useContext(AuthContext);
    const { t } = useTranslation();
    const { fetchStagiaireByOwner } = useContext(CandidatureContext);

    const [candidatures, setCandidatures] = useState([]);
    const [currentCandidature, setCurrentCandidature] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (currentUser && currentUser.role === "EMPLOYEUR") {
            fetchStagiaireByOwner()
                .then((data) => setCandidatures(data || []))
                .catch((error) => {
                    console.error("Erreur lors de la récupération des données :", error);
                    setCandidatures([]);
                });
            console.log(candidatures);
        }
    }, [currentUser, fetchStagiaireByOwner]);

    if (currentUser && currentUser.role === "EMPLOYEUR") {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const selectedCandidatures = candidatures.slice(startIndex, startIndex + itemsPerPage);

        return (
            <section>
                <div className="toolbar-items">
                    <h4 className="m-0 toolbar-spacer">{t("dashboard_home_page.stagiaire_a_evaluer")}</h4>
                </div>
                <div style={{ padding: "10px 0" }}>
                    {candidatures.length === 0 ? (
                        <div
                            style={{
                                width: "400px",
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "#eee",
                                borderRadius: "5px",
                                gap: "5px",
                                padding: "10px",
                            }}
                        >
                            <Icon path={mdiBriefcasePlusOutline} size={1} />
                            <p className="m-0">{t("dashboard_home_page.no_stagiaire_a_evaluer")}</p>
                        </div>
                    ) : (
                        <div
                            style={{
                                width: "auto",
                                backgroundColor: "#eee",
                                borderRadius: "5px",
                                padding: "10px",
                            }}
                        >
                            <div style={{ display: "flex", gap: "20px" }}>
                                <div
                                    className="menu-list"
                                    style={{
                                        flex: 1,
                                        backgroundColor: "#f9f9f9",
                                        borderRadius: "5px",
                                        padding: "10px",
                                    }}
                                >
                                    {selectedCandidatures.map((candidature, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                display: "flex",
                                                borderBottom: "1px solid #ddd",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                    padding: "5px",
                                                    cursor: "pointer",
                                                    backgroundColor:
                                                        currentCandidature &&
                                                        currentCandidature.id === candidature.id
                                                            ? "#e0e0e0"
                                                            : "transparent",
                                                }}
                                            >
                                                <p className="m-0">{candidature.etudiant.fullName}</p>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginLeft: "auto",
                                                }}
                                            >
                                                <p
                                                    className="m-0"
                                                    style={{
                                                        color: "red",
                                                    }}
                                                >
                                                    évaluation non disponible avant le --:--:--
                                                </p>
                                                <Link
                                                    to="/dashboard/evaluation-step/"
                                                    state={{
                                                        candidature: {
                                                            candidature: candidature.candidature
                                                        },
                                                    }}
                                                >
                                                    <button>
                                                        Évaluer
                                                        <Icon path={mdiChevronRight} size={1} />
                                                    </button>
                                                </Link>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    return null;
};

export default EvaluationEmployeur;
