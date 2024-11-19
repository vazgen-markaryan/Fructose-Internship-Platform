import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../components/providers/AuthProvider';

const GeneratePdfModal = ({ onClose, onSave, candidatureId }) => {
    const { t } = useTranslation();
    const [pdfUrl, setPdfUrl] = useState('');
    const { currentToken } = useContext(AuthContext);
    
    useEffect(() => {
        console.log('Generating PDF for candidature:', candidatureId);
        const fetchPdf = async () => {
            try {
                const response = await fetch(`/api/contrats/generate/${candidatureId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': currentToken
                    },
                });
                const pdfBlob = await response.blob();
                const pdfUrl = URL.createObjectURL(pdfBlob);
                const fileSize = pdfBlob.size;
                console.log('PDF size:', fileSize);
                setPdfUrl(pdfUrl);
                console.log('PDF generated:', pdfUrl);
            } catch (error) {
                console.error('Error fetching PDF:', error);
            }
        };
        fetchPdf();
    }, [candidatureId]);
    
    const handleSave = () => {
        onSave(candidatureId);
        onClose();
    };
    
    return (
            <div className="modal-overlay">
                <div
                        className="modal-content"
                        style={{
                            width: '80%', // Adjust width to make it larger
                            height: '80vh', // Adjust height to take up more vertical space
                            maxWidth: '1200px', // Set a maximum width if needed
                            maxHeight: '90vh', // Limit vertical height to avoid overflowing the viewport
                        }}
                >
                    <h4>{t('modal.generate_pdf')}</h4>
                    {pdfUrl && (
                            <iframe
                                    src={pdfUrl}
                                    width="100%"
                                    height="90%" // Subtract some space for the buttons
                                    title="PDF Preview"
                                    style={{
                                        border: 'none', // Remove border for cleaner look
                                        flexGrow: 1, // Make the iframe take the remaining space
                                    }}
                            ></iframe>
                    )}
                    <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '10px',
                                marginTop: '10px',
                            }}
                    >
                        <button onClick={onClose}>{t('modal.close')}</button>
                        <button onClick={handleSave} className="btn-filled">
                            {t('modal.save')}
                        </button>
                    </div>
                </div>
            </div>
    );
};

export default GeneratePdfModal;