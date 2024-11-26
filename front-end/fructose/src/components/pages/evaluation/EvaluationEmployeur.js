import {AuthContext} from "../../providers/AuthProvider";
import React ,{useContext, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {CandidatureContext} from "../../providers/CandidatureProvider";

const EvaluationEmployeur = () => {
    const {currentUser} = useContext(AuthContext);
    const {t} = useTranslation();
    const {fetchStagiaireByOwner} = useContext(CandidatureContext);

    const [candidatures, setCandidatures] = React.useState([]);

    useEffect(() => {
        if (currentUser != null && currentUser.role === "EMPLOYEUR") {
            fetchStagiaireByOwner()
                .then(data => setCandidatures(data || [])) // Default to an empty array
                .catch(error => {
                    console.error("Error fetching data:", error);
                    setCandidatures([]); // Handle errors gracefully
                });
        }
    }, [currentUser, fetchStagiaireByOwner]);



    if (currentUser != null && currentUser.role === "EMPLOYEUR") {
        return (
            <section>
                <div className={"toolbar-items"}>
                    <h4 className={"m-0 toolbar-spacer"}>{t("evalutaion.evaluationEmployeur")}</h4>
                </div>
                <ul>
                    {candidatures.map((candidature, index) => (
                        <li key={index}>
                            {candidature.nomOffre} - {candidature.compagnie} - {candidature.etat}
                        </li>
                    ))}
                </ul>
            </section>
        );
    }

    return null;
};

export default EvaluationEmployeur;