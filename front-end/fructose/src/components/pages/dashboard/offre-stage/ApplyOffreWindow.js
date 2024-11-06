import {mdiAlert, mdiClose, mdiFileOutline, mdiMapMarkerOutline, mdiOpenInNew} from "@mdi/js";
import Icon from "@mdi/react";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../../../providers/AuthProvider";
import {CvContext} from "../../../../providers/CvProvider";
import {Link} from "react-router-dom";

const ApplyOffreWindow = ({currentOffer}) => {
    const {isUserInit} = useContext(AuthContext);
    const {GetCvs} = useContext(CvContext);

    const [approvedCvs, setApprovedCvs] = useState(null)

    useEffect(() => {
        if (isUserInit) {
            (async function () {
                const response = await GetCvs();
                const data = await response.text();
                let cvs = JSON.parse(data);
                let approvedCvs = []
                for (let i = 0; i < cvs.length; i++){
                    if(cvs[i].isApproved === true && cvs[i].isRefused === false){
                        approvedCvs.push(cvs[i])
                    }
                }
                setApprovedCvs(approvedCvs)
            })();
        }
    }, [isUserInit, GetCvs]);

    return (
        <div className="window-frame">
            <div className="window">
                <div className="window-titlebar">
                    <h5>Envoyer une candidature</h5>
                    <button className="btn-icon"><Icon path={mdiClose} size={1}/></button>
                </div>
                <div className="window-content">
                    <section className="nospace">
                        <div className="toolbar-items" style={{gap: "8px"}}>
                            <div className="user-profile-section-profile-picture" style={{
                                "background": "url('/assets/offers/default-company.png') center / cover",
                                width: "52px",
                                height: "52px",
                                borderRadius: "5px",
                                margin: 0
                            }}></div>
                            <div>
                                <h4 className="m-0">Faire je ne sais quoi</h4>
                                <h6 className="m-0 text-dark">Ubisoft de quoi</h6>
                            </div>
                        </div>
                    </section>
                    <section className="nospace">
                        <h5></h5>
                        <div className="list-bullet">
                            <Icon path={mdiMapMarkerOutline} size={1}/>
                            <div style={{padding: "4px 0"}}>
                                <h6 className="m-0" style={{marginBottom: "5px"}}>123 Street Street </h6>
                            </div>
                        </div>
                    </section>
                    <section className="nospace">
                        <br/>
                        <h6 className="m-0">Curriculum Vitae à envoyer</h6>
                        {
                            (approvedCvs !== null)?
                                (approvedCvs.length !== 0)
                                    ?
                                    <>
                                        <select name="cv" id="">
                                            {approvedCvs.reverse().map((item, index) => (
                                                <option key={index} value={item.id}>{item.filename}</option>
                                            ))}
                                        </select>
                                        <p className="text-dark">Note: Seuls les CV approuvés apparaîtront dans la liste.</p>
                                    </>
                                    :
                                    <div className="banner"><Icon path={mdiAlert} size={1} /><p>Aucun CV approuvé dans votre dossier. Vous ne pourrez postuler sans un CV approuvé. <Link to="/dashboard/manage-cvs">Voir mes CVs <Icon path={mdiOpenInNew} size={0.5} /></Link></p></div>
                                :
                                <div className="loader"></div>
                        }

                    </section>
                </div>
                <div className="window-options">
                    <div className="toolbar-spacer"></div>
                    <button>Annuler</button>
                    <button className="btn-filled" disabled={(approvedCvs !== null)?(approvedCvs.length === 0):true}>Postuler</button>
                </div>
            </div>
        </div>
    )
}
export default ApplyOffreWindow;