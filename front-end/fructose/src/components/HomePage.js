import React from "react";
import {Link} from "react-router-dom";
import {mdiAccount} from "@mdi/js";
import Icon from "@mdi/react";

const HomePage = () => {
    return (
        <div style={{"backgroundColor": "#21277c", "minHeight": "100vh", "color": "white"}}>
            <div className="toolbar-items" style={{"padding": "0 20px", "height": "75px"}}>
                <Link to="/"><img src="/assets/logo/logo.svg" alt="" className={"logo"}/></Link>
                <div className={"toolbar-spacer"}></div>
                <Link to="/connexion"><button style={{"backgroundColor":"transparent", "color":"white"}}><Icon path={mdiAccount} size={1} /></button></Link>
                <Link to="/creer-utilisateur"><button style={{"fontSize":"18px"}} className={"btn-filled"}>S'inscrire</button></Link>
            </div>
            <div style={{"padding": "50px"}}>
                <h1 style={{"fontSize":"96px", "position": "absolute", "bottom": "20%"}}>Votre carrière <br/> commence <span style={{"backgroundColor": "#ff006c", "padding":"0 12px"}}>ici.</span></h1>
            </div>
        </div>
    );
}
export default HomePage;