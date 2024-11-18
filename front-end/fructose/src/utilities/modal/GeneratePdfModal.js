import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { AuthContext } from '../../components/providers/AuthProvider';

const GeneratePdfModal = ({ onClose, onSave, candidature }) => {
    const { t } = useTranslation();
    const [pdfUrl, setPdfUrl] = useState('');
    const { currentToken } = React.useContext(AuthContext);

    useEffect(() => {
        console.log('Generating PDF for candidature:', candidature);
        const fetchPdf = async () => {
            try {
                const response = await fetch(`/api/contrats/generate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': currentToken
                    },
                    body: JSON.stringify(candidature)
                });
                const pdfBlob = await response.blob();
                const pdfUrl = URL.createObjectURL(pdfBlob);
                setPdfUrl(pdfUrl);
            } catch (error) {
                console.error('Error fetching PDF:', error);
            }
        };
        fetchPdf();
    }, [candidature]);

    const handleSave = () => {
        onSave(candidature);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ pointerEvents: "auto" }}>
                <h4>{t("modal.generate_pdf")}</h4>
                {pdfUrl && (
                    <iframe src={pdfUrl} width="100%" height="500px" title="PDF Preview"></iframe>
                )}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                    <button onClick={onClose}>{t("modal.close")}</button>
                    <button onClick={handleSave} className="btn-filled">{t("modal.save")}</button>
                </div>
            </div>
        </div>
    );
};

export default GeneratePdfModal;