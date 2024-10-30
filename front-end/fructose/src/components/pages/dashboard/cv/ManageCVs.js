import React, {useContext, useEffect, useState} from "react";
import {
    mdiArrowLeft,
    mdiCheck,
    mdiClose,
    mdiFileOutline,
    mdiClockOutline,
    mdiFileUploadOutline,
    mdiDownloadOutline,
    mdiDeleteOutline,
    mdiFileQuestionOutline
} from "@mdi/js";
import Icon from "@mdi/react";
import {AuthContext} from "../../../../providers/AuthProvider";
import {Link} from "react-router-dom";
import PdfPreview from "../../../content/PdfPreview";
import {CvContext} from "../../../../providers/CvProvider";
import {useTranslation} from "react-i18next";

const ManageCVs = () => {
    const {t} = useTranslation();
    const {GetCvs, getCvById, DeleteCv} = useContext(CvContext);
    const {isUserInit} = useContext(AuthContext);

    const [cvs, setCvs] = useState([]);
    const [currentCv, setCurrentCv] = useState(null);

    useEffect(() => {
        if (isUserInit) {
            (async function () {
                try {
                    const response = await GetCvs();
                    const data = await response.text();
                    setCvs(JSON.parse(data));
                } catch (error) {
                    t('manage_cv.upload_error');
                }
            })();
        }
    }, [isUserInit]);

    const fetchCvById = async (cvId) => {
        try {
            const response = await getCvById(cvId);
            const pdfBlob = await response.blob();
            const fileUrl = URL.createObjectURL(pdfBlob);
            const fileSize = pdfBlob.size;
            setCurrentCv((prev) => ({...prev, fileUrl, fileSize}));
        } catch (error) {
            console.error("Erreur lors de la récupération du CV:", error);
        }
    };

    const handleCvSelection = (cv) => {
        setCurrentCv(cv);
        fetchCvById(cv.id);
    };

    const handleDeleteCv = async (cvId) => {
        try {
            const response = await DeleteCv(cvId);
            if (response.ok) {
                setCvs((prevCvs) => prevCvs.filter((cv) => cv.id !== cvId));
                if (currentCv && currentCv.id === cvId) {
                    setCurrentCv(null);
                }
            } else {
                console.error("Erreur lors de la suppression du CV:", response.statusText);
            }
        } catch (error) {
            console.error("Erreur lors de la suppression du CV:", error);
        }
    };

    const getStatutElement = () => {
        if (currentCv) {
            if (!currentCv.isApproved && !currentCv.isRefused) {
                return (
                    <>
                        <p className="m-0 text-orange">{t('manage_cv.status.pending')}</p>
                        <Icon path={mdiClockOutline} size={0.8} className="text-orange"/>
                    </>
                );
            } else if (currentCv.isApproved) {
                return (
                    <>
                        <p className="m-0 text-green">{t('manage_cv.status.approved')}</p>
                        <Icon path={mdiCheck} size={0.8} className="text-green"/>
                    </>
                );
            } else if (currentCv.isRefused) {
                return (
                    <>
                        <p className="m-0 text-red">{t('manage_cv.status.rejected')}</p>
                        <Icon path={mdiClose} size={0.8} className="text-red"/>
                    </>
                );
            }
        }
        return null;
    };

    const getCvList = () => {
        if (cvs.length > 0) {
            const lastCv = cvs[cvs.length - 1];
            return (
                <>
                    <div className="toolbar-items">
                        <h4 className="m-0 toolbar-spacer"></h4>
                        <Link to="../upload-cv">
                            <button className="btn-filled">{t('manage_cv.buttons.add')} <Icon
                                path={mdiFileUploadOutline} size={1}/></button>
                        </Link>
                    </div>
                    <br/>
                    <div className="menu-list">
                        <div onClick={() => handleCvSelection(lastCv)}>
                            <div
                                className={`menu-list-item ${currentCv && lastCv.id === currentCv.id ? "menu-list-item-selected" : ""}`}
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    padding: "0",
                                    height: "170px",
                                    boxSizing: "border-box"
                                }}>
                                <div style={{
                                    backgroundColor: "rgb(206,206,206)",
                                    padding: "10px 40px",
                                    height: "100%",
                                    boxSizing: "border-box",
                                    borderRadius: "var(--border-radius) 0 0 var(--border-radius)"
                                }}>
                                    <img src="/assets/dashboard/preview.png" alt="" style={{height: "100%"}}/>
                                </div>
                                <div style={{padding: "16px"}}>
                                    <h4 className="m-0">{lastCv.filename}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                    {cvs.length > 1 && (
                        <>
                            <div className="menu-list">
                                {cvs.slice(0, -1).reverse().map((item, index) => (
                                    <div key={index} onClick={() => handleCvSelection(item)}
                                         className={`menu-list-item ${currentCv && item.id === currentCv.id ? "menu-list-item-selected" : ""}`}>
                                        <Icon path={mdiFileOutline} size={1}/>
                                        <div>
                                            <p className="m-0">{item.filename}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </>
            );
        }
    };

    const DIVISER_KB = 1000;
    const getAppercu = () => {
        if (currentCv) {
            return (
                <div className="dashboard-card" style={{width: "35%"}}>
                    <div className="toolbar-items" style={{padding: "10px 10px 10px 16px"}}>
                        <h6 className="m-0">{t('manage_cv.titles.preview')}</h6>
                        <span className="toolbar-spacer"></span>
                        <button className="btn-icon" onClick={() => setCurrentCv(null)}>
                            <Icon path={mdiClose} size={1}/>
                        </button>
                    </div>
                    <PdfPreview height={300} file={currentCv.fileUrl}/>
                    <section>
                        <div className="toolbar-items" style={{padding: "0 10px"}}>
                            <div>
                                <h4 className="m-0">{currentCv.filename}</h4>
                                <p className="text-dark m-0">{(currentCv.fileSize / DIVISER_KB).toFixed(2)} kb</p>
                            </div>
                            <div className="toolbar-spacer"></div>
                            {getStatutElement()}
                        </div>
                        <br/>
                        {currentCv.isRefused && (
                            <p style={{color: "red", textAlign: "center"}}>{currentCv.commentaireRefus}</p>
                        )}
                        <a href={currentCv.fileUrl} download={currentCv.filename} className="btn-option">
                            <Icon path={mdiDownloadOutline} size={1}/>{t('manage_cv.buttons.download')}
                        </a>
                        <button className="btn-option" onClick={() => handleDeleteCv(currentCv.id)}>
                            <Icon path={mdiDeleteOutline} size={1}/>{t('manage_cv.buttons.delete')}
                        </button>
                    </section>
                </div>
            );
        }
        return null;
    };

    const getCvListSection = () => {
        if (cvs.length === 0) {
            return (
                <div className="dashboard-card" style={{width: "65%"}}>
                    <div className="dashboard-placeholder-card" style={{backgroundColor: "transparent"}}>
                        <div style={{textAlign: "center"}}>
                            <Icon path={mdiFileQuestionOutline} size={2}/>
                            <h6 style={{margin: "8px 0 14px 0"}}>{t('manage_cv.messages.no_cvs')}</h6>
                            <Link to="../upload-cv">
                                <button className="btn-filled">{t('manage_cv.buttons.add')} <Icon
                                    path={mdiFileUploadOutline} size={1}/></button>
                            </Link>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="dashboard-card" style={{width: "65%"}}>
                    <section>
                        {getCvList()}
                    </section>
                </div>
            );
        }
    };

    return (
        <>
            <div className="dashboard-card-toolbar">
                <Link to="/dashboard">
                    <button className="btn-icon-dashboard">
                        <Icon path={mdiArrowLeft} size={1.4}/>
                    </button>
                </Link>
                <h1>{t('manage_cv.titles.cvs')}</h1>
            </div>
            <div style={{display: "flex", gap: "20px", alignItems: "start"}}>
                {getCvListSection()}
                {getAppercu()}
            </div>
        </>
    );
};

export default ManageCVs;