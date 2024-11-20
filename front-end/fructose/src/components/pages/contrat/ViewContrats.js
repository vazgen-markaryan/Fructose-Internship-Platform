import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ContratContext } from "../../providers/ContratProvider";
import { AuthContext } from "../../providers/AuthProvider";

const ViewContrats = () => {
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
        <div>
            <h1>Contrats</h1>
            {contrats && contrats.length > 0 ? (
                <ul>
                    {contrats.map((contrat) => (
                        <li key={contrat.id}>{contrat.offreStage.titre}</li>
                    ))}
                </ul>
            ) : (
                <p>No contracts available</p>
            )}
        </div>
    );
};

export default ViewContrats;