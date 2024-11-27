import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ContratContext } from "../../providers/ContratProvider";
import PdfPreview from "../../../utilities/pdf/PdfPreview";

const ViewContrat = ({contrat, handleSign}) => {
    const { t } = useTranslation();
    const { fetchPdfByContratId } = useContext(ContratContext);
    const [pdfUrl, setPdfUrl] = useState('');

    useEffect(() => {
        if (contrat) {
            const getPdf = async () => {
                try {
                    const pdfUrl = await fetchPdfByContratId(contrat.id);
                    setPdfUrl(pdfUrl);
                } catch (error) {
                    console.error('Error fetching PDF:', error);
                }
            };
            getPdf();
        }
    }, [contrat, fetchPdfByContratId]);



    const handleNoSign = () => {
        // handle no sign
        console.log("No sign contrat: " + contrat.id);
    }

    return (
        <>
            <div>
                <PdfPreview file={pdfUrl} />
            </div>
            <div className="toolbar-items" style={{ padding: "10px" }}>
                {contrat && contrat.signatureEmployeur === null ? (
                    <>
                        <button className="btn-filled bg-green" onClick={handleSign}>{t("view_contrat_page.sign")}</button>
                        <button className="btn-filled bg-red" onClick={handleNoSign}>{t("view_contrat_page.no_sign")}</button>
                    </>
                ) : (
                    <p className="text-green">{t("view_contrat_page.signed")}</p>
                )}
        </div>
</>
)
    ;


};

export default ViewContrat;