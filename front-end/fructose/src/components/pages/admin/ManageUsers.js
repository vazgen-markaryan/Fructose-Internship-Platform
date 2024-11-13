import React, {useContext, useEffect, useState} from "react";
import {
    mdiAccountOutline,
    mdiAccountQuestion,
    mdiAccountSchoolOutline,
    mdiAccountTieOutline,
    mdiArrowLeft,
    mdiBriefcaseClockOutline,
    mdiCheck,
    mdiClockOutline,
    mdiClose,
    mdiFileClockOutline,
    mdiFolderAccountOutline,
    mdiHumanMaleBoard,
} from "@mdi/js";
import Icon from "@mdi/react";
import {AuthContext} from "../../providers/AuthProvider";
import {Link} from "react-router-dom";
import {AdminContext} from "../../providers/AdminProvider";
import {useTranslation} from "react-i18next";

const ManageUsers = () => {
	
	const {t} = useTranslation();
	const {isUserInit} = useContext(AuthContext);
	const {GetUnapprovedUsers, ApproveUser, RejectUser} = useContext(AdminContext);
	const [users, setUsers] = useState(null);
	const [currentUserIndex, setCurrentUserIndex] = useState(null);
	const [isSwitching, setIsSwitching] = useState(false);
	
	useEffect(() => {
		if (isUserInit) {
			(async function () {
				try {
					const response = await GetUnapprovedUsers();
					const data = await response.text();
					setUsers(JSON.parse(data));
				} catch (error) {
					console.error("Erreur lors de la récupération des Utilisateurs:", error);
				}
			})();
		}
	}, [isUserInit, GetUnapprovedUsers]);
	
	const ApproveUserById = async (id) => {
		await ApproveUser(id).then(response => {
			if (response.ok) {
				DeleteCurrentUserFromMemory()
			}
		})
			.catch((error) => {
				console.log(error)
			});
	}
	
	const RejectUserById = async (id) => {
		await RejectUser(id).then(response => {
			if (response.ok) {
				DeleteCurrentUserFromMemory()
			}
		})
			.catch((error) => {
				console.log(error)
			});
	}
	
	const DeleteCurrentUserFromMemory = () => {
		if (users[currentUserIndex + 1] != null) {
			SwitchUser(currentUserIndex, true)
		} else if (users[currentUserIndex - 1] != null) {
			SwitchUser(currentUserIndex - 1, false)
		} else {
			SwitchUser(null, false)
		}
		setTimeout(() => {
			setUsers([
				...users.slice(0, currentUserIndex),
				...users.slice(currentUserIndex + 1)
			]);
		}, 401)
	}
	
	const SwitchUser = (index, bypassSkip) => {
		if (currentUserIndex !== index || bypassSkip) {
			setIsSwitching(true);
			setTimeout(() => {
				setIsSwitching(false)
				setCurrentUserIndex(index)
			}, 400)
		}
	}
	
	const getStatutElement = () => {
		if (currentUserIndex !== null) {
			if (!users[currentUserIndex].is_approved) {
				return (
					<>
						<p className="m-0 text-orange">{t("manage_users_page.in_probation")}</p>
						<Icon path={mdiClockOutline} size={0.8} className="text-orange"/>
					</>
				);
			} else if (users[currentUserIndex].is_approved) {
				return (
					<>
						<p className="m-0 text-green">{t("manage_users_page.approved")}</p>
						<Icon path={mdiCheck} size={0.8} className="text-green"/>
					</>
				);
			}
		}
		return null;
	};
	
	const getUserListItems = () => {
		if (users.length > 0) {
			return (
				<>
					<div className="menu-list">
						{users.map((item, index) => (
							<div key={index} onClick={() => {
								SwitchUser(index, false)
							}}
							     className={`menu-list-item ${users[currentUserIndex] && index === currentUserIndex ? "menu-list-item-selected" : ""}`}>
								{
									(item.role === "ETUDIANT") ?
										<Icon path={mdiAccountSchoolOutline} size={1}/>
										:
										(item.role === "EMPLOYEUR") ?
											<Icon path={mdiAccountTieOutline} size={1}/>
											:
											(item.role === "PROFESSEUR") ?
												<Icon path={mdiHumanMaleBoard} size={1}/>
												:
												<Icon path={mdiAccountOutline} size={1}/>
								}
								<div>
									<p className="m-0">{item.fullName}</p>
									<p className="m-0 text-dark">{item.email}</p>
								</div>
							</div>
						))}
					</div>
				</>
			);
		} else {
			return (
				<div className="dashboard-placeholder-card" style={{backgroundColor: "transparent"}}>
					<div style={{textAlign: "center"}}>
						<Icon path={mdiAccountQuestion} size={2}/>
						<h6 style={{margin: "8px 0 14px 0"}}>{t("manage_users_page.no_users_to_approve")}</h6>
						<p className="text-dark">{t("manage_users_page.when_created")}</p>
					</div>
				</div>
			);
		}
	};
	
	const getUserDetailsSection = () => {
		if (currentUserIndex != null) {
			return (
				<div className={`dashboard-card ${(isSwitching) ? "disappearing" : ""}`} style={{width: "35%"}}>
					<div className="toolbar-items" style={{padding: "10px 10px 10px 16px"}}>
						<h6 className="m-0">{t("manage_users_page.user_details")}</h6>
						<span className="toolbar-spacer"></span>
						<button className="btn-icon" onClick={() => SwitchUser(null, false)}>
							<Icon path={mdiClose}
							      size={1}/></button>
					</div>
					<div className="user-profile-section">
						<div className="user-profile-section-banner"></div>
						<div className="user-profile-section-profile-picture"
						     style={{"backgroundImage": "url('/assets/auth/default-profile.jpg')"}}>
						</div>
					</div>
					<section>
						<div className="toolbar-items">
							<div>
								<h4 className="m-0">{users[currentUserIndex].fullName}</h4>
								<p className="text-dark m-0">{users[currentUserIndex].email}</p>
							</div>
							<div className="toolbar-spacer"></div>
							{getStatutElement()}
						</div>
						<br/>
						<p>{t("manage_users_page.details")}</p>
						<table style={{width: "100%"}}>
							<tbody>
								<tr>
									<td>{t("manage_users_page.role")}</td>
									<td style={{textAlign: "right"}}>{t(`bd_role_traduction.${users[currentUserIndex].role}`)}</td>
								</tr>
								{users[currentUserIndex].departementDTO &&
									<tr>
										<td>{t("manage_users_page.department")}</td>
										<td style={{textAlign: "right"}}>{t("programme." + users[currentUserIndex].departementDTO.nom)}</td>
									</tr>
								}
								{users[currentUserIndex].matricule &&
									<tr>
										<td>{t("manage_users_page.matricule")}</td>
										<td style={{textAlign: "right"}}>{users[currentUserIndex].matricule}</td>
									</tr>
								}
								<tr>
									<td>{t("manage_users_page.company")}</td>
									<td style={{textAlign: "right"}}>{users[currentUserIndex].companyName}</td>
								</tr>
							</tbody>
						</table>
						<br/>
						<p>{t("manage_users_page.actions")}</p>
						<button className="btn-option" onClick={() => {
							ApproveUserById(users[currentUserIndex].id)
						}}>
							<Icon path={mdiCheck} size={1}/>{t("manage_users_page.approve")}
						</button>
						<button className="btn-option" onClick={() => {
							RejectUserById(users[currentUserIndex].id)
						}}>
							<Icon path={mdiClose} size={1}/>{t("manage_users_page.delete")}
						</button>
						<button className="btn-option">
							<Icon path={mdiFolderAccountOutline} size={1}/>
							{t("manage_users_page.global_view")}
						</button>
					</section>
				</div>
			);
		}
		return null;
	};
	
	const getUserListSection = () => {
		return (
			<div style={{width: "65%"}}>
				<div className="dashboard-card" style={{height: "450px", overflowY: "auto"}}>
					<section>
						{
							(users === null) ?
								<div className="loader-container">
									<div className="loader"></div>
								</div>
								:
								getUserListItems()
						}
					</section>
				</div>
				<br/>
				<div className="dashboard-card">
					<section>
						<h5>{t("manage_users_page.related_options")}</h5>
						<p><Icon path={mdiFileClockOutline} size={0.7}/>
							<Link>{t("manage_users_page.not_approved_cvs")}</Link></p>
						<p><Icon path={mdiBriefcaseClockOutline} size={0.7}/>
							<Link>{t("manage_users_page.not_approved_stage")}</Link>
						</p>
					</section>
				</div>
			</div>
		);
	};
	
	return (
		<>
			<div className="dashboard-card-toolbar">
				<Link to="/dashboard">
					<button className="btn-icon-dashboard">
						<Icon path={mdiArrowLeft} size={1.4}/>
					</button>
				</Link>
				<h1>{t("manage_users_page.not_approved_users")}</h1>
			</div>
			<div style={{display: "flex", gap: "20px", alignItems: "start"}}>
				{getUserListSection()}
				{getUserDetailsSection()}
			</div>
		</>
	);
};

export default ManageUsers;