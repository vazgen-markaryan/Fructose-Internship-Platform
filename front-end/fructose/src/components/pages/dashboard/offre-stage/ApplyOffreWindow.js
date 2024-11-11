import {mdiAlert, mdiClose, mdiFileOutline, mdiMapMarkerOutline, mdiOpenInNew} from "@mdi/js";
import Icon from "@mdi/react";
import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {AuthContext} from "../../../../providers/AuthProvider";
import {CvContext} from "../../../../providers/CvProvider";
import {Link} from "react-router-dom";
import {CandidatureContext, CandidatureProvider} from "../../../../providers/CandidatureProvider";

const ApplyOffreWindowContext = createContext(undefined);

const ApplyOffreWindow = ({children}) => {
    const {isUserInit} = useContext(AuthContext);
    const {GetCvs} = useContext(CvContext);
    const {ApplyOffreStage} = useContext(CandidatureContext);

    const [dialogState, setDialogState] = useState({ open: false, cvId: null, offre:null, resolved: false });
    const [approvedCvs, setApprovedCvs] = useState(null)
    const [currentCv, setCurrentCv] = useState(null)

    const openCandidatureWindow = useCallback((offreStage) => {
        if (isUserInit) {
            (async function () {
                const response = await GetCvs();
                const data = await response.text();
                let cvs = JSON.parse(data);
                let approvedCvsList = []
                for (let i = 0; i < cvs.length; i++){
                    if(cvs[i].isApproved === true && cvs[i].isRefused === false){
                        approvedCvsList.push(cvs[i])
                        setApprovedCvs(approvedCvsList)
                    }
                }
                setApprovedCvs(approvedCvsList.reverse())
                setTimeout(()=>{
                    if(approvedCvsList.length > 0){
                        setCurrentCv(approvedCvsList[0])
                    }
                }, 100)
            })();
            return new Promise((resolve) => {
                setDialogState({
                    open: true,
                    offre: offreStage,
                    onConfirm: (cvId) => {
                        let newState = { ...dialogState, cvId: cvId, open: false, resolved: true }
                        resolve(true);
                        setDialogState(newState);
                    },
                    onClose: () => {
                        let newState = { ...dialogState, open: false, resolved: false }
                        resolve(false);
                        setDialogState(newState);
                    }
                });
            });
        }
    }, [dialogState, isUserInit, GetCvs]);

    const handleCompleteSubmission = async () => {
        if (currentCv !== null) {
            try {
                const response = await ApplyOffreStage(dialogState.offre.id, currentCv.id)
                if(response.ok){
                    dialogState.onConfirm(currentCv.id)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    const handleCvChange = (cvId) => {
        setCurrentCv(approvedCvs.find((element) => element.id = cvId));
    }

    return(
            <ApplyOffreWindowContext.Provider value={{openCandidatureWindow}}>
                {children}
                {(dialogState.open)
                ?
                    <div className="window-frame">
                        <div className="window">
                            <div className="window-titlebar">
                                <h5>Envoyer une candidature</h5>
                                <button className="btn-icon" onClick={dialogState.onClose}><Icon path={mdiClose} size={1}/></button>
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
                                            <h4 className="m-0">{dialogState.offre.nom}</h4>
                                            <h6 className="m-0 text-dark">{dialogState.offre.compagnie}</h6>
                                        </div>
                                    </div>
                                </section>
                                <section className="nospace">
                                    <h5></h5>
                                    <div className="list-bullet">
                                        <Icon path={mdiMapMarkerOutline} size={1}/>
                                        <div style={{padding: "4px 0"}}>
                                            <h6 className="m-0" style={{marginBottom: "5px"}}>{dialogState.offre.adresse}</h6>
                                        </div>
                                    </div>
                                </section>
                                <section className="nospace">
                                    <br/>
                                    <h6 className="m-0">Curriculum Vitae à envoyer</h6>
                                    {
                                        (approvedCvs !== null)?
                                            (approvedCvs.length !== 0)?
                                                (currentCv !== null)?
                                                    <>
                                                        <select name="cv" value={currentCv.value} onChange={(e)=>{handleCvChange(e.target.value)}}>
                                                            {approvedCvs.map((item, index) => (
                                                                <option key={index} value={item.id}>{item.filename}</option>
                                                            ))}
                                                        </select>
                                                        <p className="text-dark">Note: Seuls les CV approuvés apparaîtront dans la liste.</p>
                                                    </>
                                                    :null
                                                :
                                                <div className="banner"><Icon path={mdiAlert} size={1} /><p>Aucun CV approuvé dans votre dossier. Vous ne pourrez postuler sans un CV approuvé. <Link to="/dashboard/manage-cvs">Voir mes CVs <Icon path={mdiOpenInNew} size={0.5} /></Link></p></div>
                                            :
                                            <div className="loader"></div>
                                    }

                                </section>
                            </div>
                            <div className="window-options">
                                <div className="toolbar-spacer"></div>
                                <button onClick={dialogState.onClose}>Annuler</button>
                                <button className="btn-filled" disabled={(approvedCvs !== null)?(approvedCvs.length === 0):true} onClick={()=>{handleCompleteSubmission()}}>Postuler</button>
                            </div>
                        </div>
                    </div>
                :
                null}
            </ApplyOffreWindowContext.Provider>
    )
}
export {ApplyOffreWindow, ApplyOffreWindowContext};