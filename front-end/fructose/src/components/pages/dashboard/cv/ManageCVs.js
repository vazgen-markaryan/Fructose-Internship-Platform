import React from "react";
import {
    mdiArrowLeft, mdiArrowRight,
    mdiCheck,
    mdiChevronDown,
    mdiClose,
    mdiFileOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import {Link} from "react-router-dom";
import PdfPreview from "../../../content/PdfPreview";
import {useTranslation} from "react-i18next";

const ManageCVs = () => {

    const {t} = useTranslation();

    return(
        <>
            <div className="dashboard-card-toolbar">
                <Link to="/dashboard"><button className="btn-icon-dashboard"><Icon path={mdiArrowLeft} size={1.4} /></button></Link>
                <h1>{t("manage_cv_page.my_cvs")}</h1>
            </div>
            <div style={{"display": "flex", "gap": "20px"}}>

                <div className="dashboard-card" style={{"width": "65%"}}>
                    <section>
                        <div style={{"width": "100%", "backgroundColor": "rgba(0,0,0,0.05)", "display": "flex", "alignItems": "center", "padding": "0 10px", "height": "50px", "boxSizing": "border-box", "borderRadius":"5px", "gap":"5px"}}>
                            <Icon path={mdiFileOutline} size={1} />
                            <p className="m-0">CV1.pdf - <span className="text-grey">932.8 B</span></p>
                            <div className="toolbar-spacer"></div>
                            <Icon path={mdiCheck} size={1} className="text-green" />
                        </div>
                        <div style={{"width": "100%", "backgroundColor": "rgba(0,0,0,0.05)", "display": "flex", "alignItems": "center", "padding": "0 10px", "height": "50px", "boxSizing": "border-box", "borderRadius":"5px", "gap":"5px"}}>
                            <Icon path={mdiFileOutline} size={1} />
                            <p className="m-0">CV1.pdf - <span className="text-grey">932.8 B</span></p>
                            <div className="toolbar-spacer"></div>
                            <Icon path={mdiArrowRight} size={1} className="text-orange" />
                        </div>
                        <br/>
                        <h5>Anciens CVs <Icon path={mdiChevronDown} size={1} /></h5>
                        <div style={{"width": "100%", "borderRadius":"5px", "border": "1px solid  #8080805c", "boxSizing": "border-box"}}>
                            <div style={{"display": "flex", "alignItems": "center", "padding": "0 10px", "height": "50px", "boxSizing": "border-box", "gap":"5px", "borderBottom": "1px solid  #8080805c"}}>
                                <Icon path={mdiFileOutline} size={1} />
                                <p className="m-0">CV1.pdf - <span className="text-grey">932.8 B</span></p>
                                <div className="toolbar-spacer"></div>
                                <Icon path={mdiCheck} size={1} className="text-green" />
                            </div>
                            <div style={{"display": "flex", "alignItems": "center", "padding": "0 10px", "height": "50px", "boxSizing": "border-box", "gap":"5px", "borderBottom": "1px solid  #8080805c"}}>
                                <Icon path={mdiFileOutline} size={1} />
                                <p className="m-0">CV1.pdf - <span className="text-grey">932.8 B</span></p>
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
                    </section>
                </div>
                <div className="dashboard-card" style={{"width": "35%"}}>
                    <section>
                        <PdfPreview height={300} file="https://manning-content.s3.amazonaws.com/download/5/54dea42-e46e-44c7-a930-d4c86a2c2ca3/CORS_ch03.pdf"></PdfPreview>
                    </section>
                </div>
            </div>

        </>
    )
}
export default ManageCVs