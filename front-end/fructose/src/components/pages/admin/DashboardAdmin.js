import React, {useContext, useEffect, useRef, useState} from "react";
import Icon from "@mdi/react";
import {mdiBriefcasePlusOutline, mdiChevronRight} from "@mdi/js";
import OfferPreview from "../offre-stage/OfferPreview";
import PdfPreview from "../../../utilities/pdf/PdfPreview";
import {useTranslation} from "react-i18next";
import {CvContext} from "../../providers/CvProvider";
import {AuthContext} from "../../providers/AuthProvider";
import {OffreStageContext} from "../../providers/OffreStageProvider";
import Modal from "../../../utilities/modal/Modal";
import {Link} from "react-router-dom";
import ListCandidatureEnAttenteContrat from "../candidatures/ListCandidatureEnAttenteContrat";
import Swal from "sweetalert2";
import UserManagementDashboard from "../home/DashboardSections/UserManagementDashboard";
import OffresStagesAdminDashboard from "../home/DashboardSections/OffresStagesAdminDashboard";

const DashboardAdmin = () => {
	
	const {t} = useTranslation();
	const {getCvContenuById, GetAllCvs, GetCvs} = useContext(CvContext);
	const {fetchOffresStage} = useContext(OffreStageContext);
	const [allCvs, setAllCvs] = useState([]);


	const [currentCv, setCurrentCV] = useState(null);

	const [currentPageCv, setCurrentPageCv] = useState(1);
	const itemsPerPage = 10;
	const {currentUser, isUserInit} = useContext(AuthContext);
	const textareaRef = useRef(null);
	const {currentToken} = useContext(AuthContext)
	const [isRejectModalOpenCv, setRejectModalOpenCv] = useState(false);
	
	useEffect(() => {
		if (currentUser && isUserInit) {
			(async function () {
				try {
					const response = await GetAllCvs();
					const data = await response.text();
					setAllCvs(JSON.parse(data));
				} catch (error) {
					console.log("error" + error);
				}
			})();
		}
	}, [currentUser, GetCvs, fetchOffresStage, GetAllCvs, isUserInit]);
	
	const handleValidateCv = (cvId) => {
		Swal.fire({
			title: t("dashboard_home_page.cv_accept_title"),
			text: t("dashboard_home_page.cv_accept_text"),
			icon: "warning",
			confirmButtonText: t("dashboard_home_page.cv_accept_confirm_button"),
			cancelButtonText: t("dashboard_home_page.cv_accept_cancel_button")
		}).then((result) => {
			if (result.isConfirmed) {
				fetch(`/accepter-cv/` + cvId, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Authorization": currentToken
					}
				})
					.then(response => {
						if (response.ok) {
							setAllCvs((prevCv) => {
								const updatedCvs = prevCv.filter((cv) => cv.id !== cvId);
								if (updatedCvs.length === 0) {
									setCurrentCV(null);
								}
								return updatedCvs;
							});
							setCurrentCV(null);
							Swal.fire({
								title: "Success",
								text: t("dashboard_home_page.cv_accepted_success"),
								icon: "success",
								timer: 2000,
								showConfirmButton: false
							});
						} else {
							throw new Error("Erreur lors de l'acceptation du Cv");
						}
					})
					.catch(error => {
						console.error("Erreur lors de l'acceptation du cv:", error);
						Swal.fire({
							title: "Oops...",
							text: t("dashboard_home_page.cv_accepted_error"),
							icon: "error",
							timer: 2000,
							showConfirmButton: false
						});
					});
			}
		});
	};
	
	const handleRejectCv = (cvId, string) => {
		fetch(`/refuser-cv/` + cvId, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": currentToken
			},
			body: string,
		})
			.then(response => {
				if (response.ok) {
					setAllCvs((prevCv) => {
						const updatedCvs = prevCv.filter((cv) => cv.id !== cvId);
						if (updatedCvs.length === 0) {
							setCurrentCV(null);
						}
						return updatedCvs;
					});
					setCurrentCV(null);
					Swal.fire({
						title: "Success",
						text: t("dashboard_home_page.cv_rejected_success"),
						icon: "success",
						timer: 2000,
						showConfirmButton: false
					});
				} else {
					throw new Error("Erreur lors du refus du Cv");
				}
			})
			.catch(error => {
				console.error("Erreur lors du refus du cv:", error);
				Swal.fire({
					title: "Oops...",
					text: t("dashboard_home_page.no_comment_reject_cv_text"),
					icon: "error"
				});
			});
	};
	
	const fetchCvById = async (cvId) => {
		try {
			const response = await getCvContenuById(cvId);
			const pdfBlob = await response.blob();
			const fileUrl = URL.createObjectURL(pdfBlob);
			const fileSize = pdfBlob.size;
			setCurrentCV((prev) => ({...prev, fileUrl, fileSize}));
		} catch (error) {
			console.error("Erreur lors de la récupération du CV:", error);
		}
	};

	
	const handlePageChangeCv = (pageNumber) => {
		setCurrentPageCv(pageNumber);
	};
	

	const startIndexCvs = (currentPageCv - 1) * itemsPerPage;
	const endIndexCvs = startIndexCvs + itemsPerPage;
	const selectedCvs = allCvs.filter(cv => !cv.isApproved && !cv.isRefused).slice(startIndexCvs, startIndexCvs + endIndexCvs);
	const totalPagesCv = Math.ceil(allCvs.filter(cv => !cv.isApproved && !cv.isRefused).length / itemsPerPage);

	if (selectedCvs.length === 0 && currentPageCv > 1) {
		setCurrentPageCv(currentPageCv - 1);
	}
	
	return (
		<section>
			<UserManagementDashboard></UserManagementDashboard>
			<OffresStagesAdminDashboard></OffresStagesAdminDashboard>
			<div className="toolbar-items">
				<h4 className="m-0 toolbar-spacer">{t("dashboard_home_page.manage_cv")}</h4>
			</div>
			<div style={{padding: "10px 0"}}>
				{selectedCvs.length === 0 ? (
					<div style={{
						alignItems: "center",
						width: "400px",
						display: "flex",
						backgroundColor: "#eee",
						borderRadius: "5px",
						gap: "5px",
						padding: "10px"
					}}>
						<Icon path={mdiBriefcasePlusOutline} size={1}/>
						<p className="m-0">{t("dashboard_home_page.no_cv")}</p>
					</div>
				) : (
					<div style={{
						width: "auto",
						backgroundColor: "#eee",
						borderRadius: "5px",
						padding: "10px"
					}}>
						<div style={{
							display: "flex",
							gap: "20px"
						}}>
							<div className="menu-list" style={{
								flex: 1,
								backgroundColor: "#f9f9f9",
								borderRadius: "5px",
								padding: "10px"
							}}>
								{selectedCvs.map((cv, index) => (
									<div key={index}
									     style={{
										     display: "flex",
										     alignItems: "center",
										     gap: "10px",
										     padding: "5px",
										     borderBottom: "1px solid #ddd",
										     cursor: "pointer",
										     backgroundColor: currentCv && currentCv.id === cv.id ? "#e0e0e0" : "transparent"
									     }}
									     onClick={() => {
										     if (currentCv && currentCv.id === cv.id) {
											     setCurrentCV(null);
										     } else {
											     setCurrentCV(cv);
											     fetchCvById(cv.id);
										     }
									     }}>
										<Icon path={mdiBriefcasePlusOutline} size={1}/>
										<p className="m-0">{cv.filename}</p>
									</div>
								))}
							</div>
							{currentCv && (
								<div style={{
									flex: 2,
									padding: "10px",
									backgroundColor: "#fff",
									borderRadius: "5px",
									boxShadow: "0 0 10px rgba(0,0,0,0.1)"
								}}>
									<PdfPreview file={currentCv.fileUrl}/>
									
									<div>
										<p style={{
											textAlign: "center",
											margin: "10px 0",
											fontWeight: "bold"
										}}>
											{currentCv.filename}
										</p>
										<div style={{
											display: "flex",
											justifyContent: "center",
											gap: "10px"
										}}>
											<button
												className="btn-filled, bg-green"
												onClick={() => handleValidateCv(currentCv.id)}
											>
												{t("modal.validate")}
											</button>
											<button
												className="btn-filled bg-red"
												onClick={() => setRejectModalOpenCv(true)}
											>
												{t("modal.reject")}
											</button>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				)}
				{allCvs.length > itemsPerPage && (
					<div style={{
						display: "flex",
						justifyContent: "center",
						marginTop: "20px"
					}}>
						{Array.from({length: totalPagesCv}, (_, index) => (
							<button
								key={index}
								className={(currentPageCv === index + 1) ? "btn-filled" : ""}
								onClick={() => {
									handlePageChangeCv(index + 1);
									setCurrentCV(null);
								}}
							>
								{index + 1}
							</button>
						))}
					</div>
				)}
				<div>
					<br></br>
					<ListCandidatureEnAttenteContrat/>
				</div>
				{isRejectModalOpenCv && (
					<Modal onClose={() => setRejectModalOpenCv(false)} onSend={() => {
						handleRejectCv(currentCv.id, textareaRef.current.value);
						textareaRef.current.value = "";
						setRejectModalOpenCv(false);
					}}>
						<h4>{t("modal.reject_reason")}</h4>
						<textarea
							ref={textareaRef}
							placeholder={t("modal.reject_reason_placeholder")}
							style={{
								width: "100%",
								height: "100px"
							}}
						/>
					</Modal>
				)}
			</div>
		</section>
	);
};

export default DashboardAdmin;