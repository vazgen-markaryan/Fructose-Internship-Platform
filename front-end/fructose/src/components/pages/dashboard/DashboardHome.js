import React, {useContext} from "react";
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

const DashboardHome = () => {
    const { currentUser, currentToken } = useContext(AuthContext);

    const GetOffreStageSection = () => {
        if(currentUser != null){
            if (currentUser.role === "ETUDIANT"){
                return(
                    <section>
                        <div className={"toolbar-items"}>
                            <h4 className={"m-0 toolbar-spacer"}>Offres de stage</h4>
                            <button>Explorer <Icon path={mdiChevronRight} size={1} /></button>
                        </div>
                        <div style={{"padding": "10px 0"}}>
                            <div style={{"width": "400px", "height": "320px", "display": "flex", "alignItems": "center", "justifyContent": "center", "backgroundColor": "#eee", "borderRadius": "5px"}}>
                                <div style={{"textAlign": "center"}}>
                                    <Icon path={mdiBriefcaseRemoveOutline} size={1} />
                                    <p>Aucune offre à afficher pour le moment</p>
                                </div>
                            </div>
                        </div>
                    </section>
                )
            } else if (currentUser.role === "EMPLOYEUR"){
                return (
                    <section>
                        <div className={"toolbar-items"}>
                            <h4 className={"m-0 toolbar-spacer"}>Mes offres de stage</h4>
                            <Link to="./creer-offre-stage"><button className={"btn-filled"}>Ajouter <Icon path={mdiBriefcasePlusOutline} size={1} /></button></Link>
                        </div>
                        <div style={{"padding": "10px 0"}}>
                            <div style={{"width": "400px", "height": "320px", "display": "flex", "alignItems": "center", "justifyContent": "center", "backgroundColor": "#eee", "borderRadius": "5px"}}>
                                <div style={{"textAlign": "center"}}>
                                    <Icon path={mdiBriefcaseRemoveOutline} size={1} />
                                    <p>Aucune offre à afficher pour le moment</p>
                                </div>
                            </div>
                        </div>
                    </section>
                )
            }
        }
    }

    return(
        <>
            <div className="dashboard-card-titlebar">
                <h1>Accueil</h1>
                <h5>Bonjour {(currentUser != null)?currentUser.fullName:<div className={"loading-placeholder"}></div>}</h5>
            </div>
            <div style={{"display": "flex", "gap": "20px"}}>
                <div style={{"width": "70%"}}>
                    <div className="dashboard-card">
                        {GetOffreStageSection()}
                        <section>
                            <div className={"toolbar-items"}>
                                <h4 className={"m-0 toolbar-spacer"}>Mon Portfolio</h4>
                                <Link to="/dashboard/manage-cvs"><button>Gerer <Icon path={mdiChevronRight} size={1} /></button></Link>
                                <Link to="/dashboard/upload-cv"><button>Ajouter CV <Icon path={mdiPlus} size={1} /></button></Link>
                            </div>
                            <div style={{"padding": "10px 0"}}>
                                <div style={{"width": "400px", "display": "flex", "alignItems": "center", "backgroundColor": "#eee", "borderRadius": "5px", "gap": "5px", "padding": "10px"}}>
                                        <Icon path={mdiFileDocumentOutline} size={1} />
                                        <p className="m-0">Aucun CV</p>
                                </div>
                            </div>
                        </section>
                        <div style={{"height": "520px"}}>

                        </div>
                    </div>
                </div>
                <div style={{"width": "30%"}}>
                    <div className="dashboard-card">
                        <section>
                            <h4>Infos Utilisateur</h4>
                            <ul>
                                <li><p>Nom Complet: {(currentUser != null)?currentUser.fullName:<span className={"loading-placeholder"}></span>}</p></li>
                                <li><p>Courriel: {(currentUser != null)?currentUser.email:<span className={"loading-placeholder"}></span>}</p></li>
                                <li><p>Matricule/Num employe: {(currentUser != null)?currentUser.matricule:<span className={"loading-placeholder"}></span>}</p></li>
                                <li><p>Role: {(currentUser != null)?currentUser.role:<span className={"loading-placeholder"}></span>}</p></li>
                            </ul>
                        </section>

                    </div>
                </div>

            </div>

        </>
    )
}
export default DashboardHome