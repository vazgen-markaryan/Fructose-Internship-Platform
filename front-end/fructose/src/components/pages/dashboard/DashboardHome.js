import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../../providers/AuthProvider";
import {Link} from "react-router-dom";
import Icon from "@mdi/react";
import {
	mdiAlertCircleOutline,
	mdiBriefcasePlusOutline,
	mdiBriefcaseRemoveOutline,
	mdiCheck,
	mdiChevronRight,
	mdiClockOutline,
	mdiClose,
	mdiFileDocumentOutline,
	mdiPlus
} from "@mdi/js";
import {OffreStageContext} from "../../../providers/OffreStageProvider";
import {CvContext} from "../../../providers/CvProvider";
import {useTranslation} from "react-i18next";
import DashboardHomeAdmin from "./DashboardHomeAdmin";
import OfferPreview from "./offre-stage/OfferPreview";

const DashboardHome = () => {

	const {t} = useTranslation();
	const {currentUser, isUserInit} = useContext(AuthContext);
	const {GetCvs} = useContext(CvContext);
	const [cvs, setCvs] = useState([]);
	const [offresStage, setOffresStage] = useState([]);
	const [currentOffer, setCurrentOffer] = useState(null);
	const {fetchOffresStage} = useContext(OffreStageContext);
	const {deleteOffreStage} = useContext(OffreStageContext);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	useEffect(() => {
		if (currentUser) {
			(async function () {
				if (currentUser.role === "ETUDIANT") {
					try {
						const response = await GetCvs();
						const data = await response.text();
						setCvs(JSON.parse(data));
					} catch (error) {
						console.log("error" + error);
					}
				}
				if (currentUser.role === "EMPLOYEUR" || currentUser.role === "ETUDIANT") {
					try {
						const response = await fetchOffresStage();
						setOffresStage(response);
					} catch (error) {
						console.log("error" + error);
					}
				}
			})();
		}
	}, [currentUser, GetCvs, fetchOffresStage]);

	const handleDeleteOffreStage = async (offreStageId) => {
		try {
			const response = await deleteOffreStage(offreStageId);
			if (response.ok) {
				setOffresStage((prevOffreStages) => prevOffreStages.filter((offreStage) => offreStage.id !== offreStageId));
				setCurrentOffer(null);
				console.log("Offre stage deleted successfully");
			} else {
				console.error("Error deleting offre stage:", response.statusText);
			}
		} catch (error) {
			console.error("Error deleting offre stage:", error);
		}
	};

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const GetOffreStageSection = () => {
		if (currentUser != null) {
			if (currentUser.role === "ETUDIANT") {
				if (offresStage.length !== 0) {
					return (
						<section>
							<div className={"toolbar-items"}>
								<h4 className={"m-0 toolbar-spacer"}>{t("dashboard_home_page.my_offers")}</h4>
								<Link to="/dashboard/discover-offers">
									<button>{t("dashboard_home_page.explore")}
										<Icon path={mdiChevronRight} size={1}/>
									</button>
								</Link>
							</div>
							<div style={{
								"padding": "10px 0",
								display: "flex",
								gap: "10px",
								width: "100%"
							}}>
								{offresStage.reverse().slice(0, 3).map((item, index) => (
									<Link to={`/dashboard/discover-offers?offer=${item.id}`} key={index}
										  style={{textDecoration: "none", flex: 1}}>
										<div className="card">
											<div className="card-image">
												<h5>{item.poste}</h5>
											</div>
											<div className="card-content">
												<p style={{
													fontSize: "11px",
													textTransform: "uppercase"
												}} className="text-dark">
													{t("programme." + item.departementDTO.nom)}
												</p>
												<p>{item.ownerDTO.companyName}</p>
												{
													(item.nombrePostes <= 5) ?
														<span className="badge text-mini"><Icon
															path={mdiAlertCircleOutline}
															size={0.5}/>{t("dashboard_home_page.limited_places")}</span>
														: <></>
												}
											</div>
										</div>
									</Link>
								))}
							</div>
						</section>
					);
				} else {
					return (
						<section>
							<div className={"toolbar-items"}>
								<h4 className={"m-0 toolbar-spacer"}>{t("dashboard_home_page.my_offers")}</h4>
								<Link to="/dashboard/discover-offers">
									<button>{t("dashboard_home_page.explore")}
										<Icon path={mdiChevronRight} size={1}/>
									</button>
								</Link>
							</div>
							<div style={{"padding": "10px 0"}}>
								<div style={{
									"width": "400px",
									"height": "320px",
									"display": "flex",
									"alignItems": "center",
									"justifyContent": "center",
									"backgroundColor": "#eee",
									"borderRadius": "5px"
								}}>
									<div style={{"textAlign": "center"}}>
										<Icon path={mdiBriefcaseRemoveOutline} size={1}/>
										<p>{t("dashboard_home_page.no_offers")}</p>
									</div>
								</div>
							</div>
						</section>
					);
				}
			} else if (currentUser.role === "EMPLOYEUR") {
				const startIndex = (currentPage - 1) * itemsPerPage;
				const selectedOffresStage = offresStage.slice(startIndex, startIndex + itemsPerPage);

				return (
					<section>
						<div className={"toolbar-items"}>
							<h4 className={"m-0 toolbar-spacer"}>{t("dashboard_home_page.offers")}</h4>
							{currentUser.role === "EMPLOYEUR" && (
								<Link to="/dashboard/creer-offre-stage">

									<button className={"btn-filled"}>
										<Icon path={mdiBriefcasePlusOutline} size={1}/>
										{t("dashboard_home_page.add_offer")}
									</button>
								</Link>
							)}
						</div>
						<div style={{"padding": "10px 0"}}>
							{offresStage.length === 0 ? (
								<div style={{
									"width": "400px",
									"display": "flex",
									"alignItems": "center",
									"backgroundColor": "#eee",
									"borderRadius": "5px",
									"gap": "5px",
									"padding": "10px"
								}}>
									<Icon path={mdiBriefcasePlusOutline} size={1}/>
									<p className="m-0">{t("dashboard_home_page.no_offers")}</p>
								</div>
							) : (
								<div style={{
									"width": "auto",
									"backgroundColor": "#eee",
									"borderRadius": "5px",
									"padding": "10px"
								}}>
									<div style={{display: "flex", gap: "20px"}}>
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
													{currentUser.role === "EMPLOYEUR" && offreStage && (
														<div>
															{offreStage.isApproved ? (
																<Icon path={mdiCheck} size={1} color="green"/>
															) : offreStage.isRefused ? (
																<Icon path={mdiClose} size={1} color="red"/>
															) : (
																<Icon path={mdiClockOutline} size={1} color="orange"/>
															)}
														</div>
													)}
													<p className="m-0">{offreStage.nom}</p>
												</div>
											))}
										</div>
										{currentOffer &&
											<OfferPreview
												currentOffer={currentOffer}
												handleDeleteOffreStage={handleDeleteOffreStage}
												style={{
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
								marginTop: "20px"
							}}>
								{Array.from({length: Math.ceil(offresStage.length / itemsPerPage)}, (_, index) => (
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
					</section>
				);
			} else if (currentUser.role === "ADMIN") {
				return (
					<DashboardHomeAdmin/>
				);
			}
		}
	}

	const GetUserManagementSection = () => {
		if (currentUser != null) {
			if (currentUser.role === "ADMIN") {
				return (
					<section>
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
	}

	const GetPortfolioSection = () => {
		if (currentUser != null) {
			if (currentUser.role === "ETUDIANT") {
				return (
					<section>
						<div className={"toolbar-items"}>
							<h4 className={"m-0 toolbar-spacer"}>{t("dashboard_home_page.portfolio")}</h4>
							<Link to="/dashboard/manage-cvs">
								<button>{t("dashboard_home_page.manage")}
									<Icon path={mdiChevronRight} size={1}/>
								</button>
							</Link>
							<Link to="/dashboard/upload-cv">
								<button>{t("dashboard_home_page.add_cv")}
									<Icon path={mdiPlus} size={1}/>
								</button>
							</Link>
						</div>
						<div style={{"padding": "10px 0"}}>
							{cvs.length === 0 ? (
								<div style={{
									"width": "400px",
									"display": "flex",
									"alignItems": "center",
									"backgroundColor": "#eee",
									"borderRadius": "5px",
									"gap": "5px",
									"padding": "10px"
								}}>
									<Icon path={mdiFileDocumentOutline} size={1}/>
									<p className="m-0">{t("dashboard_home_page.no_cv")}</p>
								</div>
							) : (
								<div style={{
									"width": "400px",
									"backgroundColor": "#eee",
									"borderRadius": "5px",
									"padding": "10px"
								}}>
									{cvs.map((cv, index) => (
										<div key={index}
											 style={{
												 "display": "flex",
												 "alignItems": "center",
												 "gap": "5px"
											 }}>
											<Icon path={mdiFileDocumentOutline} size={1}/>
											<p className="m-0">{cv.filename}</p>
										</div>
									))}
								</div>
							)}
						</div>
					</section>
				)
			}
		}
	}

	return (
		<>
			<div className="dashboard-card-titlebar">
				<h1>{t("dashboard_home_page.home")}</h1>
				<h5>{t("dashboard_home_page.hello")} {(currentUser != null) ? currentUser.fullName :
					<div className={"loading-placeholder"}></div>}
				</h5>
			</div>
			<div style={{"display": "flex", "gap": "20px"}}>
				<div style={{"width": "70%"}}>
					<div className="dashboard-card">
						{GetOffreStageSection()}
						{GetPortfolioSection()}
						{GetUserManagementSection()}
						<div style={{"height": "520px"}}>
						</div>
					</div>
				</div>
				<div style={{"width": "30%"}}>
					<div className="dashboard-card">
						<section>
							<h4>{t("dashboard_home_page.user_info")}</h4>
							<ul>
								<li>
									<p>{t("dashboard_home_page.full_name")}: {(currentUser != null) ? currentUser.fullName :
										<span className={"loading-placeholder"}></span>}
									</p>
								</li>
								<li>
									<p>{t("dashboard_home_page.email")}: {(currentUser != null) ? currentUser.email :
										<span className={"loading-placeholder"}></span>}
									</p>
								</li>
								{currentUser && currentUser.role === "ETUDIANT" && (
									<li>
										<p>{t("dashboard_home_page.studentID")}: {currentUser.matricule}</p>
									</li>
								)}
								{currentUser && currentUser.role === "PROFESSEUR" && (
									<li>
										<p>{t("dashboard_home_page.employeID")}: {currentUser.matricule}</p>
									</li>
								)}
								<li>
									<p>{t("dashboard_home_page.role")}: {(currentUser != null) ? t(`bd_role_traduction.${currentUser.role}`) :
										<span className={"loading-placeholder"}></span>}
									</p>
								</li>
							</ul>
						</section>
					</div>
				</div>
			</div>
		</>
	);
}

export default DashboardHome;