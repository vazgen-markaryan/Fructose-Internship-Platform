import React, { useCallback, useContext, useEffect, useState } from "react";
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
import { AuthContext } from "../../../../providers/AuthProvider";
import { Link } from "react-router-dom";
import {AdminContext} from "../../../../providers/AdminProvider";
import {useTranslation} from "react-i18next";

const ManageUsers = () => {
    const {t} = useTranslation();

    const { isUserInit } = useContext(AuthContext);
    const { GetUnapprovedUsers, ApproveUser, RejectUser } = useContext(AdminContext);

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
    }, [isUserInit]);

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
        if (users[currentUserIndex + 1] != null){
            SwitchUser(currentUserIndex, true)
        } else if (users[currentUserIndex - 1] != null) {
            SwitchUser(currentUserIndex - 1, false)
        } else {
            SwitchUser(null, false)
        }
        setTimeout(()=>{
            setUsers([
                ...users.slice(0, currentUserIndex),
                ...users.slice(currentUserIndex + 1)
            ]);
        },401)
    }

    const SwitchUser = (index, bypassSkip) => {
        if (currentUserIndex !== index || bypassSkip){
            setIsSwitching(true);
            setTimeout(()=>{
                setIsSwitching(false)
                setCurrentUserIndex(index)
            },400)
        }
    }

    const getStatutElement = () => {
        if (currentUserIndex !== null) {
            if (!users[currentUserIndex].is_approved) {
                return (
                    <>
                        <p className="m-0 text-orange">En approbation</p>
                        <Icon path={mdiClockOutline} size={0.8} className="text-orange" />
                    </>
                );
            } else if (users[currentUserIndex].is_approved) {
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
                            <div key={index} onClick={() => {SwitchUser(index, false)}} className={`menu-list-item ${users[currentUserIndex] && index === currentUserIndex ? "menu-list-item-selected" : ""}`}>
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
        if (currentUserIndex != null) {
            return (
                <div className={`dashboard-card ${(isSwitching)? "disappearing": ""}`} style={{ width: "35%" }}>
                    <div className="toolbar-items" style={{ padding: "10px 10px 10px 16px" }}>
                        <h6 className="m-0">Détails de l'utilisateur</h6>
                        <span className="toolbar-spacer"></span>
                        <button className="btn-icon" onClick={() => SwitchUser(null, false)}><Icon path={mdiClose} size={1} /></button>
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
                                <h4 className="m-0">{users[currentUserIndex].fullName}</h4>
                                <p className="text-dark m-0">{users[currentUserIndex].email}</p>
                            </div>
                            <div className="toolbar-spacer"></div>
                            {getStatutElement()}
                        </div>
                        <br />
                        <p>Details</p>
                        <table style={{width: "100%"}}>
                            <tbody>
                                <tr>
                                    <td>Role</td>
                                    <td style={{textAlign: "right"}}>{users[currentUserIndex].role}</td>
                                </tr>
                                <tr>
                                    <td>Département</td>
                                    <td style={{textAlign: "right"}}>{t("programme." + users[currentUserIndex].departementDTO.nom)}</td>
                                </tr>
                                <tr>
                                    <td>Matricule</td>
                                    <td style={{textAlign: "right"}}>{users[currentUserIndex].matricule}</td>
                                </tr>
                                <tr>
                                    <td>Compagnie</td>
                                    <td style={{textAlign: "right"}}>{users[currentUserIndex].companyName}</td>
                                </tr>
                            </tbody>
                        </table>
                        <br/>
                        <p>Actions</p>
                        <button className="btn-option" onClick={()=>{ApproveUserById(users[currentUserIndex].id)}}>
                            <Icon path={mdiCheck} size={1} />
                            Accepter
                        </button>
                        <button className="btn-option" onClick={()=>{RejectUserById(users[currentUserIndex].id)}}>
                            <Icon path={mdiClose} size={1} />
                            Refuser
                        </button>
                        {
                         /*
                         <button className="btn-option">
                            <Icon path={mdiAccountCancelOutline} size={1} />
                            Expulser
                         </button>
                         */
                        }
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
        return (
            <div style={{ width: "65%"}}>
                <div className="dashboard-card" style={{ height: "450px", overflowY: "auto" }}>
                    <section>
                        {
                            (users === null)?
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
                        <h5>Options connexes</h5>
                        <p><Icon path={mdiFileClockOutline} size={0.7} /> <Link>CVs Non approuvés</Link></p>
                        <p><Icon path={mdiBriefcaseClockOutline} size={0.7} /> <Link>Offres de stage Non approuvés</Link></p>
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