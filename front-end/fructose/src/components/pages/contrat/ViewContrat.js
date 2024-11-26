import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ContratContext } from "../../providers/ContratProvider";
import { AuthContext } from "../../providers/AuthProvider";

const ViewContrat = (candidatureId) => {
    const { t } = useTranslation();
    const { currentUser } = useContext(AuthContext);
    const { fetchContratByCandidatureId } = useContext(ContratContext);
    const [contrat, setContrat] = useState(null);

    useEffect(() => {
        fetchContratByCandidatureId(candidatureId)
            .then(response => response.json())
            .then(data => setContrat(data))
            .catch(error => console.error("Erreur " + error));
    }, [fetchContratByCandidatureId, candidatureId]);




};

export default ViewContrat;