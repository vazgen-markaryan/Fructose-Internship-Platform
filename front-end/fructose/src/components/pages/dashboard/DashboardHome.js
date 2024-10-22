import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { Link } from "react-router-dom";
import Icon from "@mdi/react";
import {
    mdiBriefcasePlusOutline,
    mdiBriefcaseRemoveOutline,
    mdiChevronRight,
    mdiFileDocumentOutline,
    mdiPlus
} from "@mdi/js";
import { CvContext } from "../../../providers/CvProvider";
import { OffreStageContext } from "../../../providers/OffreStageProvider";
import {useTranslation} from "react-i18next";

const DashboardHome = () => {

    const {t} = useTranslation();
    const { currentUser, currentToken } = useContext(AuthContext);
    const { GetCvs } = useContext(CvContext);
    const [cvs, setCvs] = useState([]);
    const { GetOffresStage } = useContext(OffreStageContext);
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
                if (currentUser.role === "EMPLOYEUR") {
                    try {
                        const response = await GetOffresStage();
                        const data = await response.text();
                        setOffresStage(JSON.parse(data));
                    } catch (error) {
                        console.log("error" + error);
                    }
                }
            })();
        }
    }, [currentUser]); // Modifier 'isUserInit' par 'currentUser'

    const GetOffreStageSection = () => {
        if (currentUser != null) {
            if (currentUser.role === "ETUDIANT") {
                return (
                    <section>
                        <div className={"toolbar-items"}>
                            <h4 className={"m-0 toolbar-spacer"}>{t("dashboard_home_page.offer")}</h4>
                            <button>{t("dashboard_home_page.explore")} <Icon path={mdiChevronRight} size={1}/></button>
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
                            <Link to="./creer-offre-stage">
                                <button className={"btn-filled"}>{t("dashboard_home_page.add_offer")} <Icon
                                    path={mdiBriefcasePlusOutline} size={1}/></button>
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
                                    {offresStage.length === 0 ? (
                                        <>
                                            <Icon path={mdiBriefcaseRemoveOutline} size={1}/>
                                            <p>{t("dashboard_home_page.no_offers")}</p>
                                        </>
                                    ) : (
                                        <div style={{"display": "flex", "flexDirection": "column", "gap": "5px"}}>
                                            {offresStage.map((offre, index) => (
                                                <div key={index} style={{"display": "flex", "alignItems": "center", "gap": "5px"}}>
                                                    <Icon path={mdiBriefcasePlusOutline} size={1}/>
                                                    <p className="m-0">{offre.nom}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                );
            }
        }
    };

    return (
        <>
            <div className="dashboard-card-titlebar">
                <h1>Accueil</h1>
                <h5>{t("dashboard_home_page.hello")} {(currentUser != null) ? currentUser.fullName : <div className={"loading-placeholder"}></div>}</h5>
            </div>
            <div style={{ "display": "flex", "gap": "20px" }}>
                <div style={{ "width": "70%" }}>
                    <div className="dashboard-card">
                        {GetOffreStageSection()}
                        {currentUser && currentUser.role === "ETUDIANT" && (
                            <section>
                                <div className={"toolbar-items"}>
                                    <h4 className={"m-0 toolbar-spacer"}>{t("dashboard_home_page.portfolio")}</h4>
                                    <Link to="/dashboard/manage-cvs">
                                        <button>{t("dashboard_home_page.manage")} <Icon path={mdiChevronRight} size={1}/></button>
                                    </Link>
                                    <Link to="/dashboard/upload-cv">
                                        <button>{t("dashboard_home_page.add_cv")} <Icon path={mdiPlus} size={1}/></button>
                                    </Link>
                                </div>
                                <div style={{ "padding": "10px 0" }}>
                                    {cvs.length === 0 ? (
                                        <div style={{ "width": "400px", "display": "flex", "alignItems": "center", "backgroundColor": "#eee", "borderRadius": "5px", "gap": "5px", "padding": "10px" }}>
                                            <Icon path={mdiFileDocumentOutline} size={1} />
                                            <p className="m-0">{t("dashboard_home_page.no_cv")}</p>
                                        </div>
                                    ) : (
                                        <div style={{ "width": "400px", "backgroundColor": "#eee", "borderRadius": "5px", "padding": "10px" }}>
                                            {cvs.map((cv, index) => (
                                                <div key={index} style={{ "display": "flex", "alignItems": "center", "gap": "5px" }}>
                                                    <Icon path={mdiFileDocumentOutline} size={1} />
                                                    <p className="m-0">{cv.filename}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}
                        <div style={{ "height": "520px" }}>

                        </div>
                    </div>
                </div>
                <div style={{ "width": "30%" }}>
                    <div className="dashboard-card">
                        <section>
                            <h4>{t("dashboard_home_page.user_info")}</h4>
                            <ul>
                                <li><p>{t("dashboard_home_page.full_name")}: {(currentUser != null) ? currentUser.fullName : <span className={"loading-placeholder"}></span>}</p></li>
                                <li><p>{t("dashboard_home_page.email")}: {(currentUser != null) ? currentUser.email : <span className={"loading-placeholder"}></span>}</p></li>
                                {currentUser && currentUser.role !== "ADMIN" && currentUser.role !== "EMPLOYEUR" && (
                                    <li><p>{t("dashboard_home_page.matricule")}: {currentUser.matricule}</p></li>
                                )}
                                <li><p>{t("dashboard_home_page.role")}: {(currentUser != null) ? currentUser.role : <span className={"loading-placeholder"}></span>}</p></li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardHome;
