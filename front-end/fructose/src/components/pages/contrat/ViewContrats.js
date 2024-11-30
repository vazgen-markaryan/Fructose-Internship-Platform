import React, {useContext, useEffect, useState} from "react";
import {ContratContext} from "../../providers/ContratProvider";
import Icon from "@mdi/react";
import {mdiBriefcasePlusOutline} from "@mdi/js";
import {t} from "i18next";

const ViewContrats = () => {
    const [contrats, setContrats] = useState([]);
    const { fetchContrats } = useContext(ContratContext);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchContrats();
            if (response) {
                setContrats(response);
            }
        };
        fetchData();
    }, []);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getSignatureStatus = (contrat) => {
        const { etudiantSignature, gestionnaireSignature, compagnieSignature } = contrat;

        if (etudiantSignature === "Refuse" || gestionnaireSignature === "Refuse" || compagnieSignature === "Refuse") {
            return { text: "Refusé", color: "text-red" };
        } else if (!etudiantSignature || !gestionnaireSignature || !compagnieSignature) {
            return { text: "En attentes des autres signatures", color: "text-orange" };
        } else {
            return { text: "Tous ont signés !", color: "text-green" };
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const selectedContrats = contrats.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(contrats.length / itemsPerPage);

    return (
        <div>
            <h4>Contrats en cours</h4>
            {contrats.length > 0 ? (
                <div style={{
                    width: "auto",
                    backgroundColor: "#eee",
                    borderRadius: "10px",
                    padding: "10px"
                }}>
                    <div style={{
                        display: "flex",
                        gap: "20px"
                    }}>
                        <div className="menu-list" style={{
                            flex: 1,
                            backgroundColor: "#f9f9f9",
                            borderRadius: "5px",
                            padding: "10px"
                        }}>
                            {selectedContrats.map((contrat, index) => {
                                const status = getSignatureStatus(contrat);
                                return (
                                    <div key={index} style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        padding: "5px",
                                        borderBottom: "1px solid #ddd",
                                        cursor: "pointer",
                                        position: "relative"
                                    }}>
                                        <Icon path={mdiBriefcasePlusOutline} size={1}/>
                                        <p className="m-0"
                                           style={{flexGrow: 1}}>{contrat.candidatureDTO.etudiantDTO.fullName} - {contrat.candidatureDTO.offreStageDTO.compagnie} - {contrat.candidatureDTO.offreStageDTO.nom}</p>
                                        <small className={`badge text-mini ${status.color}`}>{status.text}</small>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{
                    width: "400px",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#eee",
                    borderRadius: "5px",
                    gap: "5px",
                    padding: "10px"
                }}>
                    <Icon path={mdiBriefcasePlusOutline} size={1}/>
                    <p className="m-0">{t("manage_offre_stage.messages.no_offre_stages_contracts")}</p>
                </div>
            )}
            {contrats.length > itemsPerPage && (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "5px",
                    marginTop: "20px"
                }}>
                    {Array.from({length: totalPages}, (_, index) => (
                        <button
                            key={index}
                            className={(currentPage === index + 1) ? "btn-filled" : ""}
                            onClick={() => {
                                handlePageChange(index + 1);
                            }}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ViewContrats;