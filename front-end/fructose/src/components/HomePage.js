import React from "react";
import HeaderMain from "./fragments/header/HeaderMain";
import {useTranslation} from "react-i18next";

const HomePage = () => {
    const {t} = useTranslation();
    return (
        <div style={{"backgroundColor": "#21277c", "minHeight": "100vh", "color": "white"}}>
            <HeaderMain></HeaderMain>
            <div style={{"padding": "50px"}}>
                <h1 style={{"fontSize":"96px", "position": "absolute", "bottom": "20%"}}>{t("home_page.carriere")}<br/>{t("home_page.commence")}<span style={{"backgroundColor": "#ff006c", "padding":"0 12px"}}>{t("home_page.ici")}.</span></h1>
            </div>
        </div>
    );
}
export default HomePage;