import DashboardHome from "../DashboardHome";
import {Link} from "react-router-dom";
import Icon from "@mdi/react";
import {
    mdiBriefcasePlusOutline, mdiCheck,
    mdiClockOutline, mdiClose
} from "@mdi/js";
import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import OfferPreview from "../../offre-stage/OfferPreview";
import {OffreStageContext} from "../../../providers/OffreStageProvider";

const OffresStagesEmpProfDashboard = ({currentUser}) => {

    const {fetchOffresStage, deleteOffreStage} = useContext(OffreStageContext);
    const [offresStage, setOffresStage] = useState([]);
    const {t} = useTranslation();
    const [currentOffer, setCurrentOffer] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const startIndex = (currentPage - 1) * itemsPerPage;

    const selectedOffresStage = offresStage.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        if (currentUser) {
            (async function () {
                if (currentUser.role === "EMPLOYEUR"|| currentUser.role === "PROFESSEUR") {
                    try {
                        const response = await fetchOffresStage();
                        setOffresStage(response);
                    } catch (error) {
                        console.log("error" + error);
                    }
                }
            })();
        }
    }, [currentUser, fetchOffresStage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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

}

export default OffresStagesEmpProfDashboard;