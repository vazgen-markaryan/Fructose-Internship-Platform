import {mdiClose} from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";

const ApplyOffreWindow = () => {
    return (
        <div className="window-frame">
            <div className="window">
                <div className="window-titlebar">
                    <h5>Envoyer une candidature</h5>
                    <button className="btn-icon"><Icon path={mdiClose} size={1}/></button>
                </div>
                <div className="window-content">
                    <div className="toolbar-items" style={{gap: "8px"}}>
                        <div className="user-profile-section-profile-picture" style={{
                            "background": "url('/assets/offers/default-company.png') center / cover",
                            width: "32px",
                            height: "32px",
                            borderRadius: "5px",
                            margin: 0
                        }}></div>
                        <div>
                            <h6 className="m-0">Faire je ne sais quoi</h6>
                            <p className="m-0 text-dark">Ubisoft de quoi</p>
                        </div>
                    </div>
                    <br/>
                    <h6 className="m-0">Curriculum Vitae à envoyer</h6>
                    <select name="" id="">
                        <option value="">cv1.pdf</option>
                    </select>
                    <p className="text-dark">Note: Seuls les CV approuvés apparaîtront dans la liste.</p>
                </div>
                <div className="window-options">
                    <div className="toolbar-spacer"></div>
                    <button>Annuler</button>
                    <button className="btn-filled">Postuler</button>
                </div>
            </div>
        </div>
    )
}
export default ApplyOffreWindow;