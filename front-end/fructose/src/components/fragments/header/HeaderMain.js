import {Link} from "react-router-dom";
import Icon from "@mdi/react";
import {mdiAccount, mdiMessage, mdiMessageOutline, mdiViewDashboardOutline} from "@mdi/js";
import React, {useContext, useState} from "react";
import {AuthContext} from "../../../providers/AuthProvider";
import {useTranslation} from "react-i18next";

const HeaderMain = ({theme}) => {

    const {t} = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false)
    const [notificationMenuOpen, setNotificationMenuOpen] = useState(false)
    const {currentUser, SignOutUser} = useContext(AuthContext);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        setNotificationMenuOpen(false);
    }

    const toggleNotificationMenu = () => {
        setNotificationMenuOpen(!notificationMenuOpen);
        setMenuOpen(false);
    }

    const closeAllMenus = () => {
        setMenuOpen(false);
        setNotificationMenuOpen(false);
    }

    const isMenuOpen = () => {
        return menuOpen || notificationMenuOpen;
    }

    const GetHeaderOptions = () => {
        if (currentUser == null) {
            return (
                <>
                    <Link to="/connexion">
                        <button style={{"backgroundColor": "transparent", "color": "inherit"}}><Icon path={mdiAccount} size={1}/></button>
                    </Link>
                    <Link to="/creer-utilisateur">
                        <button style={{"fontSize": "18px"}} className={"btn-filled"}>{t("header_main_page.signup")}</button>
                    </Link>
                </>
            )
        } else {
            return (
                <>
                    <div onClick={() => {closeAllMenus()}} className={"header-user-menu-obstruct"} style={{"display": (isMenuOpen()) ? "block" : "none"}}></div>

                    <Link to="/dashboard">
                        <button style={{"backgroundColor": "transparent", "color": "inherit", "padding": "0"}}><Icon path={mdiViewDashboardOutline} size={1}/></button>
                    </Link>
                    <button onClick={() => {toggleNotificationMenu()}} style={{"backgroundColor": "transparent", "color": "inherit", "padding": "0 16px"}}><Icon path={mdiMessageOutline} size={1}/></button>
                    <button onClick={() => {toggleMenu()}} style={{"backgroundColor": "black", "color": "white", "background": "url('/assets/auth/default-profile.jpg') center / cover", "width": "42px", "height": "42px", "borderRadius": "50%"}}></button>

                    <div className={"header-user-menu"} style={{"display": (menuOpen) ? "block" : "none"}}>
                        <div className={"header-user-menu-profile"}>
                            <h6>{currentUser.fullName}</h6>
                            <p className={"text-dark"}>{currentUser.email}</p>
                        </div>

                        <button onClick={() => {SignOutUser()}}>
                            {t("header_main_page.disconnect")}
                        </button>
                    </div>
                    <div className={"header-user-menu"} style={{"display": (notificationMenuOpen) ? "block" : "none"}}>
                        <div className={"header-user-menu-profile"}>
                            <h6><Icon path={mdiMessage} size={1}/>{t("header_main_page.notifications")}</h6>
                        </div>
                    </div>
                </>
            )
        }
    }

    return (
        <header style={{"color": ((theme === "dark") ? "black" : "white")}}>
            <Link to="/"><img src={"/assets/logo/logo" + ((theme === "dark") ? "-blk" : "") + ".png"} alt="" className={"logo"}/></Link>
            <div className={"toolbar-spacer"}></div>
            {GetHeaderOptions()}
        </header>
    )
}
export default HeaderMain