import {Link} from "react-router-dom";
import Icon from "@mdi/react";
import {mdiChevronRight} from "@mdi/js";
import React, {useContext} from "react";
import {AuthContext} from "../../../providers/AuthProvider";

const UserManagementDashboard = () => {
    const {currentUser} = useContext(AuthContext);

    if (currentUser != null) {
        if (currentUser.role === "EMPLOYEUR") {
            return (
                <section>
                    <div className={"toolbar-items"}>
                        <h4 className={"m-0 toolbar-spacer"}>Candidatures</h4>
                        <Link to="/dashboard/view-candidatures">
                            <button>Voir
                                <Icon path={mdiChevronRight} size={1}/>
                            </button>
                        </Link>
                    </div>
                </section>
            );
        }
    }
}

export default UserManagementDashboard