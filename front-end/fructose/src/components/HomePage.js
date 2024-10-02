import React from "react";
import {Link} from "react-router-dom";
import {mdiAccount} from "@mdi/js";
import Icon from "@mdi/react";
import {useTranslation} from "react-i18next";

const HomePage = () => {
    const {t} = useTranslation();
    return (
        <div style={{"backgroundColor": "#21277c", "minHeight": "100vh", "color": "white"}}>
            <div className="toolbar-items" style={{"padding": "0 20px", "height": "75px"}}>
                <Link to="/"><img src="/assets/logo/logo.svg" alt="" className={"logo"}/></Link>
                <div className={"toolbar-spacer"}></div>
                <Link to="/connexion"><button style={{"backgroundColor":"transparent", "color":"white"}}><Icon path={mdiAccount} size={1} /></button></Link>
                <Link to="/creer-utilisateur"><button style={{"fontSize":"18px"}} className={"btn-filled"}>{t("home_page.signup")}</button></Link>
            </div>
            <div style={{"padding": "50px"}}>
                <h1 style={{"fontSize":"96px", "position": "absolute", "bottom": "20%"}}>{t("home_page.carriere")}<br/>{t("home_page.commence")}<span style={{"backgroundColor": "#ff006c", "padding":"0 12px"}}>{t("home_page.ici")}.</span></h1>
            </div>
        </div>
    );
}
export default HomePage;