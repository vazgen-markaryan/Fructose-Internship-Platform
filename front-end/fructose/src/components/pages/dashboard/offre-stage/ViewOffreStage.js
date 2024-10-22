import React, {useContext} from "react";
import {AuthContext} from "../../../../providers/AuthProvider";
import {useTranslation} from "react-i18next";

const ViewOffreStage = () => {

    const {t} = useTranslation();
    const {currentUser} = useContext(AuthContext);

    return (
        <>
            <div className={"dashboard-layout"}>
                <section>
                    <h1>test</h1>
                    <h5>test{(currentUser != null) ? currentUser.fullName : <div className={"loading-placeholder"}></div>}</h5>
                </section>
            </div>
        </>
    )
}

export default ViewOffreStage