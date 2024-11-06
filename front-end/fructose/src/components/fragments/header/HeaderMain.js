import {Link} from "react-router-dom";
import Icon from "@mdi/react";
import {mdiAccount, mdiMessage, mdiMessageOutline, mdiTranslate, mdiViewDashboardOutline, mdiWeb} from "@mdi/js";
import React, {useContext, useState} from "react";
import {AuthContext} from "../../providers/AuthProvider";
import {useTranslation} from "react-i18next";

const HeaderMain = ({theme}) => {

    const {t, i18n} = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false)
    const [notificationMenuOpen, setNotificationMenuOpen] = useState(false)
    const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
    const {currentUser, SignOutUser} = useContext(AuthContext);

    const handleChangeLanguage = (language) => {
        i18n.changeLanguage(language);
        localStorage.setItem('language', language);
    }

    const toggleMenu = () => {
        closeAllMenus()
        setMenuOpen(!menuOpen);
    }

    const toggleNotificationMenu = () => {
        closeAllMenus()
        setNotificationMenuOpen(!notificationMenuOpen);
    }

    const toggleLanguageMenu = () => {
        closeAllMenus()
        setLanguageMenuOpen(!languageMenuOpen);
    }

    const closeAllMenus = () => {
        setMenuOpen(false);
        setNotificationMenuOpen(false);
        setLanguageMenuOpen(false)
    }

    const isMenuOpen = () => {
        return menuOpen || notificationMenuOpen || languageMenuOpen;
    }

    const GetHeaderOptions = () => {
        if (currentUser == null) {
            return (
                <>
                    <button onClick={() => {
                        toggleLanguageMenu()
                    }} className="btn-icon"><Icon path={mdiWeb} size={1}/></button>
                    <Link to="/connexion">
                        <button className="btn-icon" style={{marginRight: "10px"}}>
                            <Icon path={mdiAccount} size={1}/></button>
                    </Link>
                    <Link to="/creer-utilisateur">
                        <button className={"btn-filled"}>{t("header_main_page.signup")}</button>
                    </Link>
                </>
            )
        } else {
            return (
                <>
                    <div onClick={() => {
                        closeAllMenus()
                    }} className={"header-user-menu-obstruct"}
                         style={{"display": (isMenuOpen()) ? "block" : "none"}}></div>

                    <Link to="/dashboard">
                        <button className="btn-icon">
                            <Icon path={mdiViewDashboardOutline} size={1}/></button>
                    </Link>
                    <button onClick={() => {
                        toggleNotificationMenu()
                    }} className="btn-icon"><Icon path={mdiMessageOutline} size={1}/></button>
                    <button onClick={() => {
                        toggleLanguageMenu()
                    }} className="btn-icon" style={{marginRight: "10px"}}>
                        <Icon path={mdiWeb} size={1}/></button>
                    <button onClick={() => {
                        toggleMenu()
                    }} style={{
                        "backgroundColor": "black",
                        "color": "white",
                        "background": "url('/assets/auth/default-profile.jpg') center / cover",
                        "width": "42px",
                        "height": "42px",
                        "borderRadius": "50%"
                    }}></button>

                    <div className={"header-user-menu"} style={{"display": (languageMenuOpen) ? "block" : "none"}}>
                        <button onClick={() => handleChangeLanguage('fr')}>
                            <Icon path={mdiTranslate} size={1}/> FR
                        </button>
                        <button onClick={() => handleChangeLanguage('en')}>
                            <Icon path={mdiTranslate} size={1}/> EN
                        </button>
                    </div>
                    <div className={"header-user-menu"} style={{"display": (menuOpen) ? "block" : "none"}}>
                        <div className={"header-user-menu-profile"}>
                            <h6>{currentUser.fullName}</h6>
                            <p className={"text-dark"}>{currentUser.email}</p>
                        </div>

                        <button onClick={() => {
                            SignOutUser()
                        }}>
                            {t("header_main_page.disconnect")}
                        </button>
                    </div>
                    <div className={"header-user-menu"} style={{"display": (notificationMenuOpen) ? "block" : "none"}}>
                        <div className={"header-user-menu-profile"}>
                            <h6>
                                <Icon path={mdiMessage} size={1}/>{t("header_main_page.notifications")}
                            </h6>
                        </div>
                    </div>
                </>
            )
        }
    }

    return (
        <header style={{"color": ((theme === "dark") ? "black" : "white")}}>
            <Link to="/"><img src={"/assets/logo/logo" + ((theme === "dark") ? "-blk" : "") + ".png"} alt=""
                              className={"logo"}/></Link>
            <div className={"toolbar-spacer"}></div>
            {GetHeaderOptions()}
        </header>
    )
}
export default HeaderMain