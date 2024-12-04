import React, {useContext, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {ContratContext} from "../../providers/ContratProvider";
import PdfPreview from "../../../utilities/pdf/PdfPreview";
import {AuthContext} from "../../providers/AuthProvider";

const ViewContrat = ({contrat, handleSign, handleNoSign}) => {
	const {t} = useTranslation();
	const {fetchPdfByContratId} = useContext(ContratContext);
	const [pdfUrl, setPdfUrl] = useState('');
	const {currentUser} = useContext(AuthContext);
	const isInitialized = useRef(false);

	useEffect(() => {
		if (contrat) {
			(async function () {
				try {
					const pdfUrl = await fetchPdfByContratId(contrat.id);
					setPdfUrl(pdfUrl);
				} catch (error) {
					console.error('Error fetching PDF:', error);
				}
			})();
		} else {
			setPdfUrl(null); // Reset if no contract is present
		}
	}, [contrat, fetchPdfByContratId]);

	
	return (
		<>
			<div>
				<PdfPreview file={pdfUrl}/>
			</div>
			<div className="toolbar-items" style={{padding: "10px"}}>
				{contrat &&
				((["Non signe"].includes(contrat.signatureEmployeur) && currentUser.role === "EMPLOYEUR") ||
					(["Non signe"].includes(contrat.signatureEtudiant) && currentUser.role === "ETUDIANT")) &&
				!["Refuse"].includes(contrat.signatureEmployeur) &&
				!["Refuse"].includes(contrat.signatureEtudiant) ? (
					<>
						<button className="btn-outline toolbar-spacer" onClick={handleNoSign}>
							{t("dashboard_home_page.no_sign")}
						</button>
						<button className="btn-filled toolbar-spacer" onClick={handleSign}>
							{t("dashboard_home_page.sign")}
						</button>
					</>
				) : null}
			</div>
		</>
	)
}

export default ViewContrat;