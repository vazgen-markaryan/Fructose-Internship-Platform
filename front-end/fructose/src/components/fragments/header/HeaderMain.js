import {Link} from "react-router-dom";
import Icon from "@mdi/react";
import {mdiAccount, mdiViewDashboard} from "@mdi/js";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../../providers/AuthProvider";

const HeaderMain = ({theme}) => {
    const [menuOpen, setMenuOpen] = useState(false)


    const { currentUser, SignOutUser } = useContext(AuthContext);


    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }

    const GetHeaderOptions = () => {
        if(currentUser == null){
            return (
                <>
                    <Link to="/connexion"><button style={{"backgroundColor":"transparent", "color":"inherit"}}><Icon path={mdiAccount} size={1} /></button></Link>
                    <Link to="/creer-utilisateur"><button style={{"fontSize":"18px"}} className={"btn-filled"}>S'inscrire</button></Link>
                </>
                )
        } else {
            return (
                <>
                    <Link to="/dashboard"><button style={{"backgroundColor":"transparent", "color":"inherit"}}><Icon path={mdiViewDashboard} size={1} /></button></Link>
                    <button onClick={() => {toggleMenu()}} style={{"backgroundColor":"black", "color":"white", "background": "url('/assets/auth/default-profile.jpg') center / cover", "width": "42px", "height": "42px", "borderRadius": "50%"}}></button>
                    <div className={"header-user-menu"} style={{"display": (menuOpen)?"block":"none"}}>
                        <div className={"header-user-menu-profile"}>
                            <h6>{(currentUser != null)?currentUser.fullName:<div className={"loading-placeholder"}></div>}</h6>
                            <p className={"text-dark"}>{(currentUser != null)?currentUser.email:<div className={"loading-placeholder"}></div>}</p>
                        </div>

                        <button onClick={()=>{SignOutUser()}}>
                            Deconnexion
                        </button>
                    </div>
                </>
            )
        }
    }

    return(
        <header style={{"color":((theme === "dark")?"black":"white")}}>
                <Link to="/"><img src={"/assets/logo/logo" + ((theme === "dark") ? "-blk": "") + ".png"} alt="" className={"logo"}/></Link>
                <div className={"toolbar-spacer"}></div>
            {
                GetHeaderOptions()
            }
        </header>
    )
}
export default HeaderMain