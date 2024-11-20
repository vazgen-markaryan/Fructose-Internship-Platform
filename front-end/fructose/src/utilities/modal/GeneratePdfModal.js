import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {AuthContext} from '../../components/providers/AuthProvider';

const GeneratePdfModal = ({onClose, onSave, candidatureId}) => {
	const {t} = useTranslation();
	const [pdfUrl, setPdfUrl] = useState('');
	const {currentToken} = useContext(AuthContext);
	
	useEffect(() => {
		const fetchPdf = async () => {
			try {
				const response = await fetch(`/contrats/generate/${candidatureId}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': currentToken
					},
				});
				const pdfBlob = await response.blob();
				const pdfUrl = URL.createObjectURL(pdfBlob);
				setPdfUrl(pdfUrl);
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
					width: '80%',
					height: '80vh',
					maxWidth: '1200px',
					maxHeight: '90vh',
				}}
			>
				<h4>{t('modal.generate_pdf')}</h4>
				{pdfUrl && (
					<iframe
						src={pdfUrl}
						width="100%"
						height="90%"
						title="PDF Preview"
						style={{
							border: 'none',
							flexGrow: 1,
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
						{t('modal.generate')}
					</button>
				</div>
			</div>
		</div>
	);
};

export default GeneratePdfModal;