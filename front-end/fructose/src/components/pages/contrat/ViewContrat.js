import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ContratContext } from "../../providers/ContratProvider";
import { AuthContext } from "../../providers/AuthProvider";

const ViewContrat = () => {
    const { t } = useTranslation();
    const { fetchContrats } = useContext(ContratContext);
    const { currentUser } = useContext(AuthContext);
    const [contrats, setContrats] = useState([]);

    useEffect(() => {
        const loadContrats = async () => {
            const fetchedContrats = await fetchContrats();
            setContrats(fetchedContrats);
        };
        loadContrats();
    }, [fetchContrats]);

    // const isSignedByUser = (contrat) => {
    //     return (
    //
    //     );
    // };

    return (
        <>
            <h1>{t('Contrats')}</h1>
            <ul>
                {contrats.map((contrat) => (
                    <li key={contrat.id}>
                        <h2>{contrat.offreStage.titre}</h2>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default ViewContrat;