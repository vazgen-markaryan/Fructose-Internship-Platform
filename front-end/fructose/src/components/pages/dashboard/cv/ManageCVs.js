import React, {useCallback, useContext, useEffect, useState} from "react";
import {
    mdiArrowLeft,
    mdiArrowRight, mdiBriefcasePlusOutline, mdiBriefcaseRemoveOutline,
    mdiCheck,
    mdiChevronDown, mdiChevronDownCircleOutline, mdiClockOutline,
    mdiClose, mdiDeleteOutline, mdiDownloadOutline,
    mdiFileOutline, mdiFilePlus, mdiFileQuestionOutline, mdiFileUploadOutline, mdiFolderOpenOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import {AuthContext} from "../../../../providers/AuthProvider";
import {Link} from "react-router-dom";
import PdfPreview from "../../../content/PdfPreview";
import {CvContext} from "../../../../providers/CvProvider";

const ManageCVs = () => {
    const { GetCvs } = useContext(CvContext)
    const { isUserInit } = useContext(AuthContext)

    const [cvs, setCvs] = useState(null)
    const [currentCv, setCurrentCv] = useState(null)

    const [cvListExpanded, setCvListExpanded] = useState(false)

    useEffect(() => {

        if (isUserInit){
            (async function() {
                await GetCvs()
                    .then(response => response.text())
                    .then(response => {
                        setCvs(JSON.parse(response))
                    })
                    .catch((response) => {
                        throw new Error(response);
                    });
            })();
        }
    }, [isUserInit]);

    const getStatutElement = () => {
        if(currentCv.is_approved === false && currentCv.is_rejected === false){
            return(
                <>
                    <p className="m-0 text-orange">En approbation</p>
                    <Icon path={mdiClockOutline} size={0.8} className="text-orange" />
                </>
            )
        } else if (currentCv.is_approved === true){
            return(
                <>
                    <p className="m-0 text-green">Approuvé</p>
                    <Icon path={mdiCheck} size={0.8} className="text-green" />
                </>
            )
        } else {
            return (
                <>
                    <p className="m-0 text-red">Refusé</p>
                    <Icon path={mdiClose} size={0.8} className="text-red" />
                </>
            )
        }
    }

    const getCvList = () => {
        if(cvs.length > 0){
            return(
                <>
                    <div className={"toolbar-items"}>
                        <h4 className={"m-0 toolbar-spacer"}></h4>
                        <Link to="../upload-cv"><button className={"btn-filled"}>Ajouter <Icon path={mdiFileUploadOutline} size={1} /></button></Link>
                    </div>
                    <br/>
                    <div className="menu-list">
                        <div onClick={()=>{setCurrentCv(cvs[0])}} className={`menu-list-item ${(currentCv != null && cvs[0].id === currentCv.id)? "menu-list-item-selected":""}`}  style={{"width": "100%", "display": "flex", "padding": "0", "height": "170px", "boxSizing": "border-box"}}>
                            <div style={{"backgroundColor":"rgb(206,206,206)", "padding": "10px 40px", "height": "100%", "boxSizing": "border-box", "borderRadius": "var(--border-radius) 0 0 var(--border-radius)"}}>
                                <img src="/assets/dashboard/preview.png" alt="" style={{"height": "100%"}}/>
                            </div>

                            <div style={{"padding": "16px"}}>
                                <h4 className="m-0">{cvs[0].filename}</h4>
                            </div>
                        </div>
                    </div>
                    <br/>
                    {
                        (cvs.length > 1)?
                            <>
                                {
                                (cvListExpanded)?
                                <>
                                    <div className="menu-list">


                                        {cvs.map((item, index) => (
                                            index > 0 && (
                                                <div key={index} onClick={()=>{setCurrentCv(item)}} className={`menu-list-item ${(currentCv != null && item.id === currentCv.id)? "menu-list-item-selected":""}`}>
                                                    <Icon path={mdiFileOutline} size={1} />
                                                    <div>
                                                        <p className="m-0">{item.filename}</p>
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </>
                                :
                                <>
                                    <button className="btn-option" onClick={()=>{setCvListExpanded(true)}}>
                                        <h5 className="m-0">Autres CVs</h5>
                                        <Icon path={mdiChevronDown} size={1} />
                                    </button>
                                </>
                                }
                            </>
                            :null
                    }
                </>
            )
        } else {
            return(
                <div className="dashboard-placeholder-card" style={{"backgroundColor":"transparent"}}>
                    <div style={{"textAlign": "center"}}>
                        <Icon path={mdiFileQuestionOutline} size={2} />
                        <h6 style={{margin:"8px 0 14px 0"}}>Aucun CV dans votre dossier</h6>
                        <button className="btn-filled"><Icon path={mdiFileUploadOutline} size={1} /> Ajouter</button>
                    </div>
                </div>
            )
        }
    }

    const getAppercu = () => {
        if(currentCv !== null) {
            return (
                <div className="dashboard-card" style={{"width": "35%"}}>
                    <div className={"toolbar-items"} style={{"padding": "10px 10px 10px 16px"}}>
                        <h6 className="m-0">Appercu</h6>
                        <span className={"toolbar-spacer"}></span>
                        <button className={"btn-icon"} onClick={()=>{setCurrentCv(null)}}><Icon path={mdiClose} size={1} /></button>
                    </div>
                    {
                        <PdfPreview height={300} file="https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.orimi.com/pdf-test.pdf&ved=2ahUKEwi729HM2pCJAxVZkIkEHdNIL3oQFnoECC4QAQ&usg=AOvVaw12KwoU3ESoNGt7JZhZvA7o"></PdfPreview>
                    }
                    <section>
                        <div className="toolbar-items" style={{"padding": "0 10px"}}>
                            <div>
                                <h4 className="m-0">{currentCv.filename}</h4>
                                <p className="text-dark m-0">932 B</p>
                            </div>
                            <div className="toolbar-spacer"></div>

                            {
                                //getStatutElement()
                            }
                        </div>
                        <br/>
                        <button className="btn-option">
                            <Icon path={mdiCheck} size={1}/>
                            Accepter
                        </button>
                        <button className="btn-option">
                            <Icon path={mdiClose} size={1}/>
                            Refuser
                        </button>
                        <button className="btn-option">
                            <Icon path={mdiDownloadOutline} size={1} />
                            Telecharger
                        </button>
                        <button className="btn-option">
                            <Icon path={mdiDeleteOutline} size={1}/>
                            Supprimer
                        </button>
                    </section>
                </div>
            )
        }
    }

    const getCvListSection = () => {
        if(cvs == null){
            return (
                <div className="dashboard-card" style={{"width": "65%"}}>
                    <section style={{"height": "400px"}}>
                        <div className="loader-container">
                            <div className="loader">

                            </div>
                        </div>
                    </section>
                </div>
            )
        } else {
            return (
                <div className="dashboard-card" style={{"width": "65%"}}>
                    <section>
                        {
                            getCvList()
                        }
                    </section>
                </div>
            )
        }
    }

    return(
        <>
            <div className="dashboard-card-toolbar">
                <Link to="/dashboard"><button className="btn-icon-dashboard"><Icon path={mdiArrowLeft} size={1.4} /></button></Link>
                <h1>Mes CVs</h1>
            </div>
            <div style={{"display": "flex", "gap": "20px", "alignItems": "start"}}>

                {
                    getCvListSection()
                }

                {
                    getAppercu()
                }
            </div>

        </>
    )
}
export default ManageCVs