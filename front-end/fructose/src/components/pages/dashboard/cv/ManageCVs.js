import React, {useCallback, useContext, useState} from "react";
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

const ManageCVs = () => {
    const { currentUser } = useContext(AuthContext);

    const [files, setFiles] = useState([
        {
            id: 10,
            filename: "cv1.pdf",
            is_approved: false,
            is_rejected: false,
        },
        {
            id: 11,
            filename: "cvtudose.pdf",
            is_approved: true,
            is_rejected: false,
        },
        {
            id: 12,
            filename: "cvtudose.pdf",
            is_approved: true,
            is_rejected: false,
        }
    ])
    const [filename, setFilename] = useState('')

    const [currentFile, setCurrentFile] = useState({
        id: 10,
        is_approved: false,
        is_rejected: false,
    })

    const getStatutElement = () => {
        if(currentFile.is_approved === false && currentFile.is_rejected === false){
            return(
                <>
                    <p className="m-0 text-orange">En approbation</p>
                    <Icon path={mdiClockOutline} size={0.8} className="text-orange" />
                </>
            )
        } else if (currentFile.is_approved === true){
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

    const getFirstCV = () => {
        if(files.length < 0){
            return(
                <>
                    <div className={"toolbar-items"}>
                        <h4 className={"m-0 toolbar-spacer"}></h4>
                        <Link to="../upload-cv"><button className={"btn-filled"}>Ajouter <Icon path={mdiFileUploadOutline} size={1} /></button></Link>
                    </div>
                    <div style={{"width": "100%", "display": "flex", "padding": "0", "height": "170px", "boxSizing": "border-box", "borderRadius":"5px", "gap":"5px", "border": "1px solid  #8080805c"}}>
                        <div style={{"backgroundColor":"rgb(206,206,206)", "padding": "10px 40px", "height": "100%", "boxSizing": "border-box", "borderRadius": "var(--border-radius) 0 0 var(--border-radius)"}}>
                            <img src="/assets/dashboard/preview.png" alt="" style={{"height": "100%"}}/>
                        </div>

                        <div style={{"padding": "16px"}}>
                            <h4 className="m-0">CV1.pdf</h4>
                            <p className="text-dark">932 B</p>
                        </div>
                    </div>
                    {
                        (false)?
                            <>
                                <div style={{"width": "100%", "borderRadius":"5px", "border": "1px solid  #8080805c", "boxSizing": "border-box"}}>
                                    <div style={{"display": "flex", "alignItems": "center", "padding": "0 10px", "height": "58px", "boxSizing": "border-box", "gap":"8px", "borderBottom": "1px solid  #8080805c"}}>
                                        <Icon path={mdiFileOutline} size={1} />
                                        <div>
                                            <p className="m-0">CV1dsahjjhkj.pdf</p>
                                            <p className="text-dark m-0">932 B</p>
                                        </div>
                                        <div className="toolbar-spacer"></div>
                                        <Icon path={mdiCheck} size={1} className="text-green" />
                                    </div>
                                    <div style={{"display": "flex", "alignItems": "center", "padding": "0 10px", "height": "58px", "boxSizing": "border-box", "gap":"8px", "borderBottom": "1px solid  #8080805c"}}>
                                        <Icon path={mdiFileOutline} size={1} />
                                        <div>
                                            <p className="m-0">CV1dsahjjhkj.pdf</p>
                                            <p className="text-dark m-0">932 B</p>
                                        </div>
                                        <div className="toolbar-spacer"></div>
                                        <Icon path={mdiCheck} size={1} className="text-green" />
                                    </div>
                                    <div style={{"display": "flex", "alignItems": "center", "padding": "0 10px", "height": "50px", "boxSizing": "border-box", "gap":"5px"}}>
                                        <Icon path={mdiFileOutline} size={1} />
                                        <p className="m-0">CV1.pdf - <span className="text-grey">932.8 B</span></p>
                                        <div className="toolbar-spacer"></div>
                                        <Icon path={mdiClose} size={1} className="text-red" />
                                    </div>
                                </div>
                            </>
                            :
                            <>
                                <button className="btn-option">
                                    <h5 className="m-0">Autres CVs</h5>
                                    <Icon path={mdiChevronDown} size={1} />
                                </button>
                            </>
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

    return(
        <>
            <div className="dashboard-card-toolbar">
                <Link to="/dashboard"><button className="btn-icon-dashboard"><Icon path={mdiArrowLeft} size={1.4} /></button></Link>
                <h1>Mes CVs</h1>
            </div>
            <div style={{"display": "flex", "gap": "20px", "alignItems": "start"}}>

                <div className="dashboard-card" style={{"width": "65%"}}>
                    <section>
                        {
                            getFirstCV()
                        }
                        <br/>


                    </section>
                </div>
                <div className="dashboard-card" style={{"width": "35%"}}>
                    <div className={"toolbar-items"} style={{"padding": "10px 10px 10px 16px"}}>
                        <h6 className="m-0">Appercu</h6>
                        <span className={"toolbar-spacer"}></span>
                        <button className={"btn-icon"}><Icon path={mdiClose} size={1} /></button>
                    </div>
                        <PdfPreview height={300} file="https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.orimi.com/pdf-test.pdf&ved=2ahUKEwi729HM2pCJAxVZkIkEHdNIL3oQFnoECC4QAQ&usg=AOvVaw12KwoU3ESoNGt7JZhZvA7o"></PdfPreview>
                    <section>
                        <div className="toolbar-items" style={{"padding": "0 10px"}}>
                            <div>
                                <h4 className="m-0">Cv1.pdf</h4>
                                <p className="text-dark m-0">932 B</p>
                            </div>
                            <div className="toolbar-spacer"></div>

                            {
                                getStatutElement()
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
            </div>

        </>
    )
}
export default ManageCVs