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

const DashboardHome = () => {
	
	const {t} = useTranslation();
	const {getCvContenuById, GetAllCvs, GetCvs} = useContext(CvContext);
	const {fetchOffresStage} = useContext(OffreStageContext);
	const [allCvs, setAllCvs] = useState([]);
	const [offresStage, setOffresStage] = useState([]);
	const [currentOffer, setCurrentOffer] = useState(null);
	const [currentCv, setCurrentCV] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageCv, setCurrentPageCv] = useState(1);
	const itemsPerPage = 10;
	const {currentUser, isUserInit} = useContext(AuthContext);
	const textareaRef = useRef(null);
	const {currentToken} = useContext(AuthContext)
	const [setRejectModalOpen] = useState(false);
	const [isRejectModalOpenCv, setRejectModalOpenCv] = useState(false);
	
	useEffect(() => {
		if (currentUser && isUserInit) {
			(async function () {
				try {
					const response = await fetchOffresStage();
					setOffresStage(response);
				} catch (error) {
					console.log("error" + error);
				}
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
					return response;
				}
				throw new Error("Erreur lors de l'acceptation du Cv");
			})
			.catch(error => {
				console.error("Erreur lors de l'acceptation du cv:", error);
			});
	};
	
	const handleRejectCv = (cvId, string) => {
		Swal.fire({
			title: "Oops...",
			text: t("dashboard_home_page.no_comment_reject_cv_text"),
			icon: "error"
		}).then((willReject) => {
			if (willReject) {
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
							return response;
						}
						throw new Error("Erreur lors du refus du Cv");
					})
					.then(data => {
						setRejectModalOpenCv(false);
					})
					.catch(error => {
						console.error("Erreur lors du refus du cv:", error);
					});
			}
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
	
	function handleValidateOffer(id) {
		fetch(`/accepter-offre-stage/` + id, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": currentToken
			}
		})
			.then(response => {
				if (response.ok) {
					setOffresStage((prevOffreStages) => {
						const updatedOffres = prevOffreStages.filter((offreStage) => offreStage.id !== id);
						if (updatedOffres.length === 0) {
							setCurrentOffer(null);
						}
						return updatedOffres;
					});
					setCurrentOffer(null);
				} else {
					throw new Error("Erreur lors de l'acceptation de l'offre");
				}
			})
			.catch(error => {
				console.error("Erreur lors de l'acceptation de l'offre:", error);
			});
	}
	
	function handleRejectOffer(id, string) {
		fetch(`/refuser-offre-stage/` + id, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": currentToken
			},
			body: string,
		})
			.then(response => {
				if (response.ok) {
					setOffresStage((prevOffreStages) => {
						const updatedOffres = prevOffreStages.filter((offreStage) => offreStage.id !== id);
						if (updatedOffres.length === 0) {
							setCurrentOffer(null);
						}
						return updatedOffres;
					});
					setCurrentOffer(null);
					return response;
				}
				throw new Error("Erreur lors du refus de l'offre");
			})
			.then(data => {
				setRejectModalOpen(false);
			})
			.catch(error => {
				console.error("Erreur lors du refus de l'offre:", error);
			});
	}
	
	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};
	
	const handlePageChangeCv = (pageNumber) => {
		setCurrentPageCv(pageNumber);
	};
	
	const GetUserManagementSection = () => {
		if (currentUser != null) {
			return (
				<section style={{padding: 0, marginBottom: 25}}>
					<div className={"toolbar-items"}>
						<h4 className={"m-0 toolbar-spacer"}>{t("dashboard_home_page.user_management")}</h4>
						<Link to="./admin/manage-users">
							<button>{t("dashboard_home_page.not_approved_users")}
								<Icon path={mdiChevronRight} size={1}/>
							</button>
						</Link>
					</div>
				</section>
			)
		}
	}
	
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	
	let selectedOffresStage = offresStage.filter(offre => !offre.isApproved && !offre.isRefused).slice(startIndex, endIndex);
	
	const totalPages = Math.ceil(offresStage.filter(offre => !offre.isApproved && !offre.isRefused).length / itemsPerPage);
	
	if (selectedOffresStage.length === 0 && currentPage > 1) {
		setCurrentPage(currentPage - 1);
	}
	
	const startIndexCvs = (currentPageCv - 1) * itemsPerPage;
	const selectedCvs = allCvs.filter(cv => !cv.isApproved && !cv.isRefused).slice(startIndexCvs, startIndexCvs + itemsPerPage);
	const totalPagesCv = Math.ceil(allCvs.filter(cv => !cv.isApproved && !cv.isRefused).length / itemsPerPage);
	
	if (selectedCvs.length === 0 && currentPageCv > 1) {
		setCurrentPageCv(currentPageCv - 1);
	}
	
	return (
		<section>
			{GetUserManagementSection()}
			<div className="toolbar-items">
				<h4 className="m-0 toolbar-spacer">{t("dashboard_home_page.manage_offers")}</h4>
				<Link to="/dashboard/creer-offre-stage">
					<button className={"btn-filled"}>
						<Icon path={mdiBriefcasePlusOutline} size={1}/>
						{t("dashboard_home_page.add_offer")}
					</button>
				</Link>
			</div>
			<div style={{padding: "10px 0"}}>
				{selectedOffresStage.length === 0 ? (
					<div style={{
						width: "400px",
						display: "flex",
						alignItems: "center",
						backgroundColor: "#eee",
						borderRadius: "5px",
						gap: "5px",
						padding: "10px"
					}}>
						<Icon path={mdiBriefcasePlusOutline} size={1}/>
						<p className="m-0">{t("dashboard_home_page.no_offers")}</p>
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
								{selectedOffresStage.map((offreStage, index) => (
									<div key={index}
									     style={{
										     display: "flex",
										     alignItems: "center",
										     gap: "10px",
										     padding: "5px",
										     borderBottom: "1px solid #ddd",
										     cursor: "pointer",
										     backgroundColor: currentOffer && currentOffer.id === offreStage.id ? "#e0e0e0" : "transparent"
									     }}
									     onClick={() => setCurrentOffer(currentOffer && currentOffer.id === offreStage.id ? null : offreStage)}>
										<Icon path={mdiBriefcasePlusOutline} size={1}/>
										<p className="m-0">{offreStage.nom}</p>
									</div>
								))}
							</div>
							{currentOffer &&
								<OfferPreview currentOffer={currentOffer} handleValidate={handleValidateOffer}
								              handlerefused={handleRejectOffer} style={{
									flex: 2,
									padding: "10px",
									backgroundColor: "#fff",
									borderRadius: "5px",
									boxShadow: "0 0 10px rgba(0,0,0,0.1)"
								}}/>}
						</div>
					</div>
				)}
				<div style={{
					display: "flex",
					justifyContent: "center",
					gap: "5px",
					marginTop: "20px"
				}}>
					{Array.from({length: totalPages}, (_, index) => (
						<button
							key={index}
							className={(currentPage === index + 1) ? "btn-filled" : ""}
							onClick={() => {
								handlePageChange(index + 1);
								setCurrentOffer(null);
							}}
						>
							{index + 1}
						</button>
					))}
				</div>
			</div>
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

export default DashboardHome;