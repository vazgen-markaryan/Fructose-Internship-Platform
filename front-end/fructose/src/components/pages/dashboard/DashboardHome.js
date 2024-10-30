import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../../providers/AuthProvider";
import {Link} from "react-router-dom";
import Icon from "@mdi/react";
import {
    mdiBriefcasePlusOutline,
    mdiBriefcaseRemoveOutline,
    mdiChevronRight,
    mdiFileDocumentOutline,
    mdiPlus
} from "@mdi/js";
import {CvContext} from "../../../providers/CvProvider";
import {OffreStageContext} from "../../../providers/OffreStageProvider";
import {useTranslation} from "react-i18next";
import OfferPreview from "./offre-stage/OfferPreview";

const DashboardHome = () => {

    const {t} = useTranslation();
    const {currentUser, isUserInit} = useContext(AuthContext);
    const {GetCvs, GetAllCvs} = useContext(CvContext);
    const [allCvs, setAllCvs] = useState([]);
    const [cvs, setCvs] = useState([]);
    const [offresStage, setOffresStage] = useState([]);
    const [currentOffer, setCurrentOffer] = useState(null);
    const [currentCv, setCurrentCV] = useState(null);
    const {fetchOffresStage} = useContext(OffreStageContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageCv, setCurrentPageCv] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (currentUser && isUserInit) {
            (async function () {
                if (currentUser.role === "ETUDIANT") {
                    try {
                        const response = await GetCvs();
                        const data = await response.text();
                        setCvs(JSON.parse(data));
                    } catch (error) {
                        console.log("error" + error);
                    }
                }
                try {
                    const response = await fetchOffresStage();
                    setOffresStage(response);
                } catch (error) {
                    console.log("error" + error);
                }
                try {
                    const response = await GetAllCvs();
                    console.log(response)
                    const data = await response.text();
                    setAllCvs(JSON.parse(data));
                } catch (error) {
                    console.log("error" + error);
                }
            })();
        }
    }, [currentUser, GetCvs, fetchOffresStage])

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const handlePageChangeCv = (pageNumber) => {
        setCurrentPageCv(pageNumber);
    };

    const GetOffreStageSection = () => {
        if (currentUser != null) {
            if (currentUser.role === "ETUDIANT") {
                return (
                    <section>
                        <div className={"toolbar-items"}>
                            <h4 className={"m-0 toolbar-spacer"}>{t("dashboard_home_page.my_offers")}</h4>
                            <Link to="/dashboard/discover-offers">
                                <button>{t("dashboard_home_page.explore")} <Icon path={mdiChevronRight} size={1}/>
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
            } else if (currentUser.role === "EMPLOYEUR") {
                return (
                    <section>
                        <div className={"toolbar-items"}>
                            <h4 className={"m-0 toolbar-spacer"}>{t("dashboard_home_page.my_offers")}</h4>
                            <Link to="/dashboard/manage-offres-stage">
                                <button>{t("dashboard_home_page.explore")} <Icon path={mdiChevronRight} size={1}/>
                                </button>
                            </Link>
                            <Link to="./creer-offre-stage">
                                <button className={"btn-filled"}>{t("dashboard_home_page.add_offer")}
                                    <Icon path={mdiBriefcasePlusOutline} size={1}/>
                                </button>
                            </Link>
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
                                    "width": "400px",
                                    "backgroundColor": "#eee",
                                    "borderRadius": "5px",
                                    "padding": "10px"
                                }}>
                                    {offresStage.map((offreStage, index) => (
                                        <div key={index}
                                             style={{"display": "flex", "alignItems": "center", "gap": "5px"}}>
                                            <Icon path={mdiBriefcasePlusOutline} size={1}/>
                                            <p className="m-0">{offreStage.nom}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                );
            } else if (currentUser.role === "ADMIN") {
                const startIndex = (currentPage - 1) * itemsPerPage;
                const selectedOffresStage = offresStage.slice(startIndex, startIndex + itemsPerPage);
                const startIndexCvs = (currentPage - 1) * itemsPerPage;
                const selectedCvs = cvs.slice(startIndexCvs, startIndexCvs + itemsPerPage);
                return (
                    <section>
                        <div className={"toolbar-items"}>
                            <h4 className={"m-0 toolbar-spacer"}>{t("dashboard_home_page.offers")}</h4>
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
                                                    <p className="m-0">{offreStage.nom}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {currentOffer && <OfferPreview currentOffer={currentOffer} style={{
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
                        <div className={"toolbar-items"}>
                            <h4 className={"m-0 toolbar-spacer"}>{t("dashboard_home_page.cv")}</h4>
                        </div>
                        <div style={{"padding": "10px 0"}}>
                            {allCvs.length === 0 ? (
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
                                    <p className="m-0">{t("dashboard_home_page.no_cv")}</p>
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
                                            {allCvs.map((cv, index) => (
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
                                                     onClick={() => setCurrentCV(currentCv && currentCv.id === cv.id ? null : cv)}>
                                                    <Icon path={mdiBriefcasePlusOutline} size={1}/>
                                                    <p className="m-0">{cv.filename}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {currentCv && <OfferPreview currentOffer={currentOffer} style={{
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
                                {Array.from({length: Math.ceil(allCvs.length / itemsPerPage)}, (_, index) => (
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
                                    "width": "400px",
                                    "backgroundColor": "#eee",
                                    "borderRadius": "5px",
                                    "padding": "10px"
                                }}>
                                    {cvs.map((cv, index) => (
                                        <div key={index}
                                             style={{"display": "flex", "alignItems": "center", "gap": "5px"}}>
                                            <Icon path={mdiFileDocumentOutline} size={1}/>
                                            <p className="m-0">{cv.filename}</p>
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
                        {GetPortfolioSection()}
                        {GetUserManagementSection()}
                        <div style={{"height": "520px"}}>
                        </div>
                    </div>
                </div>
                <div style={{"width": "30%"}}>
                    <div className="dashboard-card">
                        <section>
                            <h4>{t("dashboard_home_page.user_info")}</h4>
                            <ul>
                                <li>
                                <p>{t("dashboard_home_page.full_name")}: {(currentUser != null) ? currentUser.fullName :
                                        <span className={"loading-placeholder"}></span>}
                                    </p>
                                </li>
                                <li>
                                    <p>{t("dashboard_home_page.email")}: {(currentUser != null) ? currentUser.email :
                                        <span className={"loading-placeholder"}></span>}
                                    </p>
                                </li>
                                {currentUser && currentUser.role === "ETUDIANT" && (
                                    <li>
                                        <p>{t("dashboard_home_page.studentID")}: {currentUser.matricule}</p>
                                    </li>
                                )}
                                {currentUser && currentUser.role === "PROFESSEUR" && (
                                    <li>
                                        <p>{t("dashboard_home_page.employeID")}: {currentUser.matricule}</p>
                                    </li>
                                )}
                                <li>
                                    <p>{t("dashboard_home_page.role")}: {(currentUser != null) ? t(`bd_role_traduction.${currentUser.role}`) :
                                        <span className={"loading-placeholder"}></span>}
                                    </p>
                                </li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardHome;
