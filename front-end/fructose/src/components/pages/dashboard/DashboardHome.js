import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../../providers/AuthProvider";
import {Link} from "react-router-dom";
import Icon from "@mdi/react";
import {
    mdiAlertCircleOutline,
    mdiBriefcasePlusOutline,
    mdiBriefcaseRemoveOutline,
    mdiChevronRight,
    mdiFileDocumentOutline,
    mdiPlus
} from "@mdi/js";
import {CvContext} from "../../../providers/CvProvider";
import {OffreStageContext} from "../../../providers/OffreStageProvider";
import {useTranslation} from "react-i18next";

const DashboardHome = () => {

    const {t} = useTranslation();
    const {currentUser} = useContext(AuthContext);
    const {GetCvs} = useContext(CvContext);
    const [cvs, setCvs] = useState([]);
    const {fetchOffresStage} = useContext(OffreStageContext);
    const [offresStage, setOffresStage] = useState([]);

    useEffect(() => {
        if (currentUser) {
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
                if (currentUser.role === "EMPLOYEUR" || currentUser.role === "ETUDIANT") {
                    try {
                        const response = await fetchOffresStage();
                        setOffresStage(response);
                    } catch (error) {
                        console.log("error" + error);
                    }
                }
            })();
        }
    }, [currentUser, GetCvs]);

    const GetOffreStageSection = () => {
        if (currentUser != null) {
            if (currentUser.role === "ETUDIANT") {
                if (offresStage.length !== 0){
                    return (
                        <Link to="/dashboard/discover-offers" style={{textDecoration: "none"}}>
                        <section>
                            <div className={"toolbar-items"}>
                                <h4 className={"m-0 toolbar-spacer"}>{t("dashboard_home_page.my_offers")}</h4>
                                <button>{t("dashboard_home_page.explore")} <Icon path={mdiChevronRight} size={1}/></button>
                            </div>
                            <div style={{"padding": "10px 0", display: "flex", gap: "10px"}}>
                                {offresStage.reverse().slice(0, 3).map((item, index) => (
                                    <div key={index} style={{width: "33%"}} className="card">
                                        <div className="card-image">
                                            <h5>{item.poste}</h5>
                                        </div>
                                        <div className="card-content">
                                            <p style={{fontSize: "11px", textTransform: "uppercase"}} className="text-dark">
                                                {t("programme." + item.departementDTO.nom)}
                                            </p>
                                            <p>{item.ownerDTO.companyName}</p>
                                            {
                                                (item.nombrePostes <= 5)?<span className="badge text-mini"><Icon path={mdiAlertCircleOutline} size={0.5} /> Places limitées</span>
                                                    :<></>
                                            }

                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                        </Link>
                    );
                } else {
                    return (
                        <section>
                            <div className={"toolbar-items"}>
                                <h4 className={"m-0 toolbar-spacer"}>{t("dashboard_home_page.my_offers")}</h4>
                                <Link to="/dashboard/discover-offers"><button>{t("dashboard_home_page.explore")} <Icon path={mdiChevronRight} size={1}/></button></Link>
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
            }
        }
    };

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
