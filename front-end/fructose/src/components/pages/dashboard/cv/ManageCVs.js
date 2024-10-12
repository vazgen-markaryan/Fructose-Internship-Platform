import React, {useContext} from "react";
import HeaderMain from "../../../fragments/header/HeaderMain";
import {
    mdiArrowRight,
    mdiBriefcasePlusOutline,
    mdiBriefcaseRemoveOutline,
    mdiChevronRight,
    mdiCog,
    mdiCogOutline
} from "@mdi/js";
import Icon from "@mdi/react";
import {AuthContext} from "../../../../providers/AuthProvider";
import {Link} from "react-router-dom";

const ManageCVs = () => {
    const { currentUser } = useContext(AuthContext);

    return(
        <>
            <div className={"dashboard-layout"}>
                <section>
                    <h1>Accueil</h1>
                    <h5>Bonjour {(currentUser != null)?currentUser.fullName:<div className={"loading-placeholder"}></div>}</h5>
                </section>
            </div>


        </>
    )
}
export default ManageCVs