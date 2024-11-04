import React, {useContext, useEffect, useRef, useState} from "react";
import Icon from "@mdi/react";
import {mdiBriefcasePlusOutline} from "@mdi/js";
import OfferPreview from "./offre-stage/OfferPreview";
import PdfPreview from "../../content/PdfPreview";
import {useTranslation} from "react-i18next";
import {CvContext} from "../../../providers/CvProvider";
import {AuthContext} from "../../../providers/AuthProvider";
import {OffreStageContext} from "../../../providers/OffreStageProvider";

const DashboardHome = ({}) => {
    const {t} = useTranslation();
    const {getCvById, GetAllCvs, GetCvs} = useContext(CvContext);
    const {fetchOffresStage} = useContext(OffreStageContext);
    const [allCvs, setAllCvs] = useState([]);
    const [offresStage, setOffresStage] = useState([]);
    const [currentOffer, setCurrentOffer] = useState(null);
    const [currentCv, setCurrentCV] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageCv, setCurrentPageCv] = useState(1);
    const itemsPerPage = 10;
    const {currentUser, isUserInit} = useContext(AuthContext);
    const textareaRef = useRef(null);
    const {currentToken} = useContext(AuthContext)
    const [isRejectModalOpen, setRejectModalOpen] = useState(false);

    useEffect(() => {
        if (currentUser && isUserInit) {
            (async function () {
                try {
                    const response = await fetchOffresStage();
                    setOffresStage(response);
                } catch (error) {
                    console.log("error" + error);
                }
                try {
                    const response = await GetAllCvs();
                    const data = await response.text();
                    setAllCvs(JSON.parse(data));
                } catch (error) {
                    console.log("error" + error);
                }
            })();
        }
    }, [currentUser, GetCvs, fetchOffresStage]);


    const handleValidateCv = (cvId) => {
        console.log(`CV ${cvId} validé.`);
    };

    const handleRejectCv = (cvId) => {
        console.log(`CV ${cvId} rejeté.`);
    };

    const fetchCvById = async (cvId) => {
        try {
            const response = await getCvById(cvId);
            const pdfBlob = await response.blob();
            const fileUrl = URL.createObjectURL(pdfBlob);
            const fileSize = pdfBlob.size;
            setCurrentCV((prev) => ({...prev, fileUrl, fileSize}));
        } catch (error) {
            console.error("Erreur lors de la récupération du CV:", error);
        }
    };


    function handleValidateOffer(id) {
        fetch(`/accepter-offre-stage/` + id, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": currentToken
            }
        })
            .then(response => {
                if (response.ok) {
                    console.log("Offre de stage acceptée avec succès");
                    setOffresStage((prevOffreStages) => prevOffreStages.filter((offreStage) => offreStage.id !== id));
                    setCurrentOffer(null);
                } else {
                    throw new Error("Erreur lors de l'acceptation de l'offre");
                }
            })
            .catch(error => {
                console.error("Erreur lors de l'acceptation de l'offre:", error);
            });
    }

    function handleRejectOffer(id, string) {
        fetch(`/refuser-offre-stage/` + id, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": currentToken
            },
            body: string,
        })
            .then(response => {
                if (response.ok) {
                    setOffresStage((prevOffreStages) => prevOffreStages.filter((offreStage) => offreStage.id !== id));
                    setCurrentOffer(null);
                    return response;
                }
                throw new Error("Erreur lors du refus de l'offre");
            })
            .then(data => {
                setRejectModalOpen(false);
            })
            .catch(error => {
                console.error("Erreur lors du refus de l'offre:", error);
            });
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePageChangeCv = (pageNumber) => {
        setCurrentPageCv(pageNumber);
    };


    const startIndex = (currentPage - 1) * itemsPerPage;
    const selectedOffresStage = offresStage.filter(offre => !offre.isApproved && !offre.isRefused)
        .slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(offresStage.filter(offre => !offre.isApproved && !offre.isRefused).length / itemsPerPage);

    const startIndexCvs = (currentPageCv - 1) * itemsPerPage;
    const selectedCvs = allCvs.slice(startIndexCvs, startIndexCvs + itemsPerPage);
    const totalPagesCv = Math.ceil(allCvs.length / itemsPerPage);

    return (
        <section>
            <div className="toolbar-items">
                <h4 className="m-0 toolbar-spacer">{t("dashboard_home_page.offers")}</h4>
            </div>
            <div style={{padding: "10px 0"}}>
                {offresStage.length === 0 ? (
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
                        <p className="m-0">{t("dashboard_home_page.no_offers")}</p>
                    </div>
                ) : (
                    <div style={{
                        width: "auto",
                        backgroundColor: "#eee",
                        borderRadius: "5px",
                        padding: "10px"
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
                                        <p className="m-0">{offreStage.nom}</p>
                                    </div>
                                ))}
                            </div>
                            {currentOffer &&
                                <OfferPreview currentOffer={currentOffer} handleValidate={handleValidateOffer}
                                              handlerefused={handleRejectOffer} style={{
                                    flex: 2,
                                    padding: "10px",
                                    backgroundColor: "#fff",
                                    borderRadius: "5px",
                                    boxShadow: "0 0 10px rgba(0,0,0,0.1)"
                                }}/>}
                        </div>
                    </div>
                )}
                <div style={{display: "flex", justifyContent: "center", marginTop: "20px"}}>
                    {Array.from({length: totalPages}, (_, index) => (
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
            <div className="toolbar-items">
                <h4 className="m-0 toolbar-spacer">{t("dashboard_home_page.cv")}</h4>
            </div>
            <div style={{padding: "10px 0"}}>
                {allCvs.length === 0 ? (
                    <div style={{
                        alignItems: "center",
                        width: "400px",
                        display: "flex",
                        backgroundColor: "#eee",
                        borderRadius: "5px",
                        gap: "5px",
                        padding: "10px"
                    }}>
                        <Icon path={mdiBriefcasePlusOutline} size={1}/>
                        <p className="m-0">{t("dashboard_home_page.no_cv")}</p>
                    </div>
                ) : (
                    <div style={{
                        width: "auto",
                        backgroundColor: "#eee",
                        borderRadius: "5px",
                        padding: "10px"
                    }}>
                        <div style={{display: "flex", gap: "20px"}}>
                            <div className="menu-list" style={{
                                flex: 1,
                                backgroundColor: "#f9f9f9",
                                borderRadius: "5px",
                                padding: "10px"
                            }}>
                                {selectedCvs.map((cv, index) => (
                                    <div key={index}
                                         style={{
                                             display: "flex",
                                             alignItems: "center",
                                             gap: "10px",
                                             padding: "5px",
                                             borderBottom: "1px solid #ddd",
                                             cursor: "pointer",
                                             backgroundColor: currentCv && currentCv.id === cv.id ? "#e0e0e0" : "transparent"
                                         }}
                                         onClick={() => {
                                             if (currentCv && currentCv.id === cv.id) {
                                                 setCurrentCV(null);
                                             } else {
                                                 setCurrentCV(cv);
                                                 fetchCvById(cv.id);
                                             }
                                         }}>
                                        <Icon path={mdiBriefcasePlusOutline} size={1}/>
                                        <p className="m-0">{cv.filename}</p>
                                    </div>
                                ))}
                            </div>
                            {currentCv && (
                                <div  style={{
                                    flex: 2,
                                    padding: "10px",
                                    backgroundColor: "#fff",
                                    borderRadius: "5px",
                                    boxShadow: "0 0 10px rgba(0,0,0,0.1)"
                                }}>
                                    <PdfPreview file={currentCv.fileUrl} />

                                    <div>
                                        <p style={{textAlign: "center", margin: "10px 0", fontWeight: "bold"}}>
                                            {currentCv.filename}
                                        </p>

                                        <div style={{display: "flex", justifyContent: "center", gap: "10px"}}>
                                            <button className="btn-filled"
                                                    onClick={() => handleValidateCv(currentCv.id)}>
                                                {t("dashboard_home_page.validate")}
                                            </button>
                                            <button className="btn-outline"
                                                    onClick={() => handleRejectCv(currentCv.id)}>
                                                {t("dashboard_home_page.reject")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                <div style={{display: "flex", justifyContent: "center", marginTop: "20px"}}>
                    {Array.from({length: totalPagesCv}, (_, index) => (
                        <button
                            key={index}
                            className={(currentPageCv === index + 1) ? "btn-filled" : ""}
                            onClick={() => {
                                handlePageChangeCv(index + 1);
                                setCurrentCV(null);
                            }}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default DashboardHome;
