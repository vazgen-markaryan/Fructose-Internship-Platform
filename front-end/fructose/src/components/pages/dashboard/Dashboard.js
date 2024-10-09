import React, {useContext} from "react";
import HeaderMain from "../../fragments/header/HeaderMain";
import {
    mdiArrowRight,
    mdiBriefcasePlusOutline,
    mdiBriefcaseRemoveOutline,
    mdiChevronRight,
    mdiCog,
    mdiCogOutline
} from "@mdi/js";
import Icon from "@mdi/react";
import {AuthContext} from "../../../providers/AuthProvider";

const Dashboard = () => {
    const { currentUser } = useContext(AuthContext);
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
                            <button className={"btn-filled"}>Ajouter <Icon path={mdiBriefcasePlusOutline} size={1} /></button>
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
            <HeaderMain theme={"dark"}></HeaderMain>
            <div className={"dashboard-layout"}>
                <section>
                    <h1>Accueil</h1>
                    <h5>Bonjour {(currentUser != null)?currentUser.fullName:<div className={"loading-placeholder"}></div>}</h5>
                </section>
                {GetOffreStageSection()}
                <section>
                    <div className={"toolbar-items"}>
                        <h4 className={"m-0 toolbar-spacer"}>Infos utilisateur</h4>
                        <button>Parametres <Icon path={mdiCogOutline} size={1} /></button>
                    </div>
                    <ul>
                        <li><p>Nom Complet: {(currentUser != null)?currentUser.fullName:<div className={"loading-placeholder"}></div>}</p></li>
                        <li><p>Courriel: {(currentUser != null)?currentUser.email:<div className={"loading-placeholder"}></div>}</p></li>
                        <li><p>Matricule/Num employe: {(currentUser != null)?currentUser.matricule:<div className={"loading-placeholder"}></div>}</p></li>
                        <li><p>Role: {(currentUser != null)?currentUser.role:<div className={"loading-placeholder"}></div>}</p></li>
                    </ul>
                </section>
            </div>


        </>
    )
}
export default Dashboard