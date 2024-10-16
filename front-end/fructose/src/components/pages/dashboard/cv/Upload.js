import React, {useCallback, useContext, useState} from "react";
import {
    mdiArrowLeft, mdiButtonCursor, mdiChevronRight, mdiClose,
    mdiCloudUploadOutline, mdiFileOutline,
    mdiFolderOpenOutline
} from "@mdi/js";
import Icon from "@mdi/react";
import {AuthContext} from "../../../../providers/AuthProvider";
import {Link} from "react-router-dom";
import {useDropzone} from "react-dropzone";
import PdfPreview from "../../../content/PdfPreview";
import {CvContext} from "../../../../providers/CvProvider";

const UploadCV = () => {
    const { currentUser } = useContext(AuthContext);
    const { UploadCv } = useContext(CvContext);

    const [files, setFiles] = useState('');
    const [filename, setFilename] = useState('');

    const onDrop = useCallback(acceptedFiles => {
        setFiles(acceptedFiles.map(file => (
            <PdfPreview file={URL.createObjectURL(file)} height={300}></PdfPreview>
        )));
        setFilename(acceptedFiles.map(file => (
            file.name
        )))
    }, [])
    const {getRootProps, getInputProps, isDragActive, open} = useDropzone({onDrop, accept:{
            'application/pdf': ['.pdf'],
        }, noClick: true})

    const getStep = () => {
        if(files === ""){
            return(
                <>
                    <div className="file-upload-zone" {...getRootProps()} style={{"opacity": (isDragActive)?"0.5":"1", "border": (isDragActive)?"1px solid black":"none"}}>
                        <input {...getInputProps()} />
                        <div className="file-upload-content">
                            <Icon path={mdiCloudUploadOutline} size={2} />
                            <h5>Glisser votre CV ici</h5>
                            {
                                isDragActive ?
                                    <>
                                    </>
                                    :
                                    <>
                                        <div className="file-upload-or">
                                            <hr/>
                                            <p>OU</p>
                                            <hr/>
                                        </div>
                                        <button onClick={open} className="btn-outline"><Icon path={mdiFolderOpenOutline} size={0.8} /> Sélectionner</button>
                                    </>
                            }
                        </div>
                    </div>
                    <br/>
                    <p className="text-dark" style={{"textAlign": "center"}}>Format des fichiers acceptés: PDF</p>
                </>
            )
        } else {
            return (
                <>
                    {
                        files
                    }
                    <br/>
                    <div style={{"width": "100%", "backgroundColor": "rgba(0,0,0,0.03)", "display": "flex", "alignItems": "center", "padding": "0 10px", "height": "50px", "boxSizing": "border-box", "borderRadius":"5px", "gap":"5px"}}>
                        <Icon path={mdiFileOutline} size={1} />
                        <p className="m-0">{filename}</p>
                        <div className="toolbar-spacer"></div>
                        <button className="btn-icon" onClick={()=>{setFiles("")}}><Icon path={mdiClose} size={1} /></button>
                    </div>
                    <br/>
                    <div className="toolbar-items" onClick={()=>{UploadCv()}}>
                        <div className="toolbar-spacer"></div>
                        <button className="btn-filled">Téléverser <Icon path={mdiChevronRight} size={1}/></button>
                    </div>
                </>
            )
        }
    }

    return(
        <>
            <div className="dashboard-card-toolbar">
                <Link to="/dashboard"><button className="btn-icon-dashboard"><Icon path={mdiArrowLeft} size={1.4} /></button></Link>
                <h1>Téléverser un CV</h1>
            </div>
            <div className="dashboard-card" style={{"maxWidth": "900px"}}>
                <section>
                    {
                        getStep()
                    }
                </section>
            </div>


        </>
    )
}
export default UploadCV