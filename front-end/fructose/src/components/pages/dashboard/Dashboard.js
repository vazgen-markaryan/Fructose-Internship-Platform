import React, {useContext} from "react";
import HeaderMain from "../../fragments/header/HeaderMain";
import {mdiBriefcasePlusOutline, mdiBriefcaseRemoveOutline, mdiChevronRight, mdiCogOutline} from "@mdi/js";
import Icon from "@mdi/react";
import {AuthContext} from "../../../providers/AuthProvider";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";

const Dashboard = () => {

    const {t} = useTranslation();
    const {currentUser} = useContext(AuthContext);

    const GetOffreStageSection = () => {
        if (currentUser != null) {
            if (currentUser.role === "ETUDIANT") {
                return (
                    <section>
                        <div className={"toolbar-items"}>
                            <h4 className={"m-0 toolbar-spacer"}>{t("dashboard_page.offer")}</h4>
                            <button>Explorer <Icon path={mdiChevronRight} size={1}/></button>
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
                                    <p>{t("dashboard_page.no_offers")}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                )
            } else if (currentUser.role === "EMPLOYEUR") {
                return (
                    <section>
                        <div className={"toolbar-items"}>
                            <h4 className={"m-0 toolbar-spacer"}>{t("dashboard_page.my_offers")}</h4>
                            <Link to="/creer-offre-stage">
                                <button className={"btn-filled"}>{t("dashboard_page.add_offer")} <Icon path={mdiBriefcasePlusOutline} size={1}/>
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
                                    <p>{t("dashboard_page.no_offers")}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                )
            }
        }
    }

    return (
        <>
            <HeaderMain theme={"dark"}></HeaderMain>
            <div className={"dashboard-layout"}>
                <section>
                    <h1>{t("dashboard_page.title")}</h1>
                    <h5>{t("dashboard_page.hello")} {(currentUser != null) ? currentUser.fullName : <div className={"loading-placeholder"}></div>}</h5>
                </section>
                {GetOffreStageSection()}
                <section>
                    <div className={"toolbar-items"}>
                        <h4 className={"m-0 toolbar-spacer"}>{t("dashboard_page.user_info")}</h4>
                        <button>{t("dashboard_page.parameters")} <Icon path={mdiCogOutline} size={1}/></button>
                    </div>
                    <ul>
                        <li><p>{t("dashboard_page.full_name")}: {(currentUser != null) ? currentUser.fullName : <span className={"loading-placeholder"}></span>}</p></li>
                        <li><p>{t("dashboard_page.email")}: {(currentUser != null) ? currentUser.email : <span className={"loading-placeholder"}></span>}</p></li>
                        {currentUser && currentUser.role !== "ADMIN" && currentUser.role !== "EMPLOYEUR" && (
                            <li><p>{t("dashboard_page.matricule")}: {currentUser.matricule}</p></li>
                        )}
                        <li><p>{t("dashboard_page.role")}: {(currentUser != null) ? t(`bd_role_traduction.${currentUser.role}`) : <span className={"loading-placeholder"}></span>}</p></li>
                    </ul>
                </section>
            </div>
        </>
    )
}

export default Dashboard