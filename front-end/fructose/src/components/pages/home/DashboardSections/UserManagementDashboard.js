import {Link} from "react-router-dom";
import Icon from "@mdi/react";
import {mdiChevronRight} from "@mdi/js";
import React, {useContext} from "react";
import {useTranslation} from "react-i18next";
import {AuthContext} from "../../../providers/AuthProvider";

const UserManagementDashboard = () => {
    const {t} = useTranslation();
    const {currentUser} = useContext(AuthContext);

    if (currentUser != null) {
        if (currentUser.role === "ADMIN") {
            return (
                <section>
                    <div className={"toolbar-items"}>
                        <h4 className={"m-0 toolbar-spacer"}>{t("dashboard_home_page.user_management")}</h4>
                        <Link to="./admin/manage-users">
                            <button>{t("dashboard_home_page.not_approved_users")}
                                <Icon path={mdiChevronRight} size={1}/>
                            </button>
                        </Link>
                    </div>
                </section>
            )
        }
    }
}

export default UserManagementDashboard