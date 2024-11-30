import {Link, useNavigate} from "react-router-dom";
import Icon from "@mdi/react";
import {mdiCheck, mdiChevronRight, mdiClockOutline, mdiClose, mdiFileDocumentOutline, mdiPlus} from "@mdi/js";
import React, {useContext, useEffect, useState} from "react";
import {CvContext} from "../../../providers/CvProvider";
import {useTranslation} from "react-i18next";
import {AuthContext} from "../../../providers/AuthProvider";


const CVEtudiantDashboard = () => {
    const {GetCvs} = useContext(CvContext);
    const [cvs, setCvs] = useState([]);
    const {t} = useTranslation();
    const {currentUser} = useContext(AuthContext);

    const handleCvClick = (cv) => {
        navigate("/dashboard/manage-cvs", {state: {selectedCv: cv}});
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            (async function () {
                if (currentUser.role === "ETUDIANT") {
                    try {
                        const response = await GetCvs();
                        const data = await response.json();
                        setCvs(data);
                    } catch (error) {
                        console.log("Erreur lors de la récupération des CVs : " + error);
                    }
                }
            })();
        }
    }, [currentUser, GetCvs]);

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
                                "display": "flex",
                                "flexDirection": "column",
                                "gap": "5px"
                            }}>
                                {cvs.map((cv, index) => (
                                    <div key={index} style={{
                                        "width": "400px",
                                        "display": "flex",
                                        "alignItems": "center",
                                        "backgroundColor": "#eee",
                                        "borderRadius": "5px",
                                        "padding": "10px",
                                        "marginBottom": "5px",
                                        "cursor": "pointer"
                                    }} onClick={() => handleCvClick(cv)}>
                                        <p style={{
                                            "margin": "0",
                                            "display": "flex",
                                            "alignItems": "center",
                                            "flexGrow": 1
                                        }}>
                                            <Icon path={mdiFileDocumentOutline} size={1}/>
                                            {cv.filename}
                                        </p>
                                        {cv.isApproved &&
                                            <Icon path={mdiCheck} size={1} color="green"
                                                  style={{marginLeft: "5px"}}/>}
                                        {cv.isRefused &&
                                            <Icon path={mdiClose} size={1} color="red"
                                                  style={{marginLeft: "5px"}}/>}
                                        {!cv.isApproved && !cv.isRefused &&
                                            <Icon path={mdiClockOutline} size={1} color="orange"
                                                  style={{marginLeft: "5px"}}/>}
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
export default CVEtudiantDashboard;