import React, { useCallback, useContext, useEffect, useState } from "react";
import {
    mdiAccountCancelOutline,
    mdiAccountCheckOutline,
    mdiAccountOutline,
    mdiAccountQuestion, mdiAccountQuestionOutline,
    mdiAccountSchoolOutline,
    mdiAccountTieOutline,
    mdiArrowLeft,
    mdiBriefcaseClockOutline,
    mdiCheck,
    mdiClockOutline,
    mdiClose,
    mdiDeleteOutline,
    mdiDownloadOutline,
    mdiFileClockOutline,
    mdiFileOutline,
    mdiFileQuestionOutline,
    mdiFileUploadOutline,
    mdiFolderAccountOutline,
    mdiHumanMaleBoard,
} from "@mdi/js";
import Icon from "@mdi/react";
import { AuthContext } from "../../../../providers/AuthProvider";
import { Link } from "react-router-dom";
import {AdminContext} from "../../../../providers/AdminProvider";
import {useTranslation} from "react-i18next";

const ManageUsers = () => {
    const {t} = useTranslation();

    const { GetUnapprovedUsers } = useContext(AdminContext);
    const { isUserInit } = useContext(AuthContext);

    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

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
    }, [isUserInit]);

    const getStatutElement = () => {
        if (currentUser) {
            if (!currentUser.is_approved) {
                return (
                    <>
                        <p className="m-0 text-orange">En approbation</p>
                        <Icon path={mdiClockOutline} size={0.8} className="text-orange" />
                    </>
                );
            } else if (currentUser.is_approved) {
                return (
                    <>
                        <p className="m-0 text-green">Approuvé</p>
                        <Icon path={mdiCheck} size={0.8} className="text-green" />
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
                            <div key={index} onClick={() => {setCurrentUser(users[index])}} className={`menu-list-item ${currentUser && item.id === currentUser.id ? "menu-list-item-selected" : ""}`}>
                                {
                                    (item.role === "ETUDIANT")?
                                        <Icon path={mdiAccountSchoolOutline} size={1} />
                                        :
                                        (item.role === "EMPLOYEUR")?
                                            <Icon path={mdiAccountTieOutline} size={1} />
                                            :
                                            (item.role === "PROFESSEUR")?
                                                <Icon path={mdiHumanMaleBoard} size={1} />
                                                :
                                        <Icon path={mdiAccountOutline} size={1} />
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
                <div className="dashboard-placeholder-card" style={{ backgroundColor: "transparent" }}>
                    <div style={{ textAlign: "center" }}>
                        <Icon path={mdiAccountQuestion} size={2} />
                        <h6 style={{ margin: "8px 0 14px 0" }}>Aucun Utilisateur à approuver</h6>
                        <p className="text-dark">Lorsqu'un utilisateur sera créé, il apparaitra ici.</p>
                    </div>
                </div>
            );
        }
    };


    const getUserDetailsSection = () => {
        if (currentUser) {
            return (
                <div className="dashboard-card" style={{ width: "35%" }}>
                    <div className="toolbar-items" style={{ padding: "10px 10px 10px 16px" }}>
                        <h6 className="m-0">Détails de l'utilisateur</h6>
                        <span className="toolbar-spacer"></span>
                        <button className="btn-icon" onClick={() => setCurrentUser(null)}><Icon path={mdiClose} size={1} /></button>
                    </div>
                        <div className="user-profile-section">
                            <div className="user-profile-section-banner">

                            </div>
                            <div className="user-profile-section-profile-picture" style={{"backgroundImage": "url('/assets/auth/default-profile.jpg')"}}>

                            </div>
                        </div>
                    <section>
                        <div className="toolbar-items">
                            <div>
                                <h4 className="m-0">{currentUser.fullName}</h4>
                                <p className="text-dark m-0">{currentUser.email}</p>
                            </div>
                            <div className="toolbar-spacer"></div>
                            {getStatutElement()}
                        </div>
                        <br />
                        <p>Details</p>
                        <table style={{width: "100%"}}>
                            <tr>
                                <td>Role</td>
                                <td style={{textAlign: "right"}}>{currentUser.role}</td>
                            </tr>
                            <tr>
                                <td>Département</td>
                                <td style={{textAlign: "right"}}>{t("programme." + currentUser.departementDTO.nom)}</td>
                            </tr>
                            <tr>
                                <td>Matricule</td>
                                <td style={{textAlign: "right"}}>{currentUser.matricule}</td>
                            </tr>
                            <tr>
                                <td>Compagnie</td>
                                <td style={{textAlign: "right"}}>{currentUser.companyName}</td>
                            </tr>
                        </table>
                        <br/>
                        <p>Actions</p>
                        <button className="btn-option">
                            <Icon path={mdiCheck} size={1} />
                            Accepter
                        </button>
                        <button className="btn-option">
                            <Icon path={mdiClose} size={1} />
                            Refuser
                        </button>
                        <button className="btn-option">
                            <Icon path={mdiAccountCancelOutline} size={1} />
                            Expulser
                        </button>
                        <button className="btn-option">
                            <Icon path={mdiFolderAccountOutline} size={1} />
                            Vue Globale
                        </button>
                    </section>
                </div>
            );
        }
        return null;
    };

    const getUserListSection = () => {
        if (users.length === 0) {
            return (
                <div className="dashboard-card" style={{ width: "65%" }}>
                    <section style={{ height: "450px" }}>
                        <div className="loader-container">
                            <div className="loader"></div>
                        </div>
                    </section>
                </div>
            );
        } else {
            return (
                <div style={{ width: "65%"}}>
                    <div className="dashboard-card" style={{ height: "450px", overflowY: "auto" }}>
                        <section>
                            {getUserListItems()}
                        </section>
                    </div>
                    <br/>
                    <div className="dashboard-card">
                        <section>
                            <h5>Options connexes</h5>
                            <p><Icon path={mdiFileClockOutline} size={0.7} /> <Link>CVs Non approuvés</Link></p>
                            <p><Icon path={mdiBriefcaseClockOutline} size={0.7} /> <Link>Offres de stage Non approuvés</Link></p>
                        </section>
                    </div>
                </div>
            );
        }
    };

    return (
        <>
            <div className="dashboard-card-toolbar">
                <Link to="/dashboard">
                    <button className="btn-icon-dashboard">
                        <Icon path={mdiArrowLeft} size={1.4} />
                    </button>
                </Link>
                <h1>Utilisateurs non approuvés</h1>
            </div>
            <div style={{ display: "flex", gap: "20px", alignItems: "start" }}>
                {getUserListSection()}
                {getUserDetailsSection()}
            </div>
        </>
    );
};

export default ManageUsers;