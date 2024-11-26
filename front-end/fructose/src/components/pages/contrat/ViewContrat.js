import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ContratContext } from "../../providers/ContratProvider";
import PdfPreview from "../../../utilities/pdf/PdfPreview";

const ViewContrat = (candidature) => {
    const { t } = useTranslation();
    const { fetchContratByCandidatureId, fetchPdfByContratId} = useContext(ContratContext);
    const [contrat, setContrat] = useState(null);
    const [pdfUrl, setPdfUrl] = useState('');

    useEffect(() => {
        fetchContratByCandidatureId(candidature.candidature.id)
            .then(data => {
                setContrat(data);
            })
            .catch(error => console.error("Erreur " + error));
    }, [fetchContratByCandidatureId, candidature]);

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

    // use the pdfUrl to display the pdf in an iframe in the statement without modal
    return (
        <div>
            <PdfPreview file={pdfUrl} />
        </div>
    );


};

export default ViewContrat;