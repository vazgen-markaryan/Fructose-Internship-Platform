import React, {useEffect, useState} from "react";
import Icon from "@mdi/react";
import {mdiChevronLeft, mdiChevronRight} from "@mdi/js";
import {useTranslation} from "react-i18next";

const InformationsEtudiant = ({utilisateur, handleChange, switchStep}) => {
    const {t} = useTranslation();

    const [errors, setErrors] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();
        const errorMessage = validateFields();
        if (Object.keys(errorMessage).length > 0) {
            setErrors(errorMessage);
        } else {
            switchStep(true)
        }
    };

    const validateFields = () => {
        let errors = {};
        if (!/^\d{7}$/.test(utilisateur.matricule)) {
            errors.matricule = t("information_etudiant_page.error.matricule");
        }
        if(utilisateur.departement.length === 0){
            errors.departement = t("information_etudiant_page.error.department");
        }
        return errors
    }

    useEffect(() => {
        // Si utilisateur change la langue pendant qu'erreur est affichée, traduire les messages d'erreur
        setErrors(prevErrors => ({
            matricule: prevErrors.matricule ? t("information_etudiant_page.error.matricule") : '',
            departement: prevErrors.departement ? t("information_etudiant_page.error.departement") : '',
        }));
    }, [t]);

    return (
        <div className={"form-signup-condensed"}>
            <h4>{t("information_etudiant_page.information")}</h4>
            <p>{t("information_etudiant_page.description")}</p>
            <br/>
            <form onSubmit={handleSubmit}>
                <div className={"input-container"}>
                    <p>{t("information_etudiant_page.matricule")}:</p>
                    <input type="text" name="matricule" className={`${errors.matricule ? "field-invalid" : ""}`} required value={utilisateur.matricule} onChange={handleChange}/>
                    <p className={"field-invalid-text"}>{errors.matricule}</p>
                </div>
                <div className={"input-container"}>
                    <p>{t("information_etudiant_page.program")}:</p>
                    <select name="departement" className={`${errors.departement ? "field-invalid" : ""}`} onChange={handleChange} value={utilisateur.departement} required>
                        <option value="">{t("information_etudiant_page.select_program")}</option>
                        <option value="Cinéma">{t("information_etudiant_page.programme.cinema")}</option>
                        <option value="Gestion de commerces">{t("information_etudiant_page.programme.gestion_commerce")}</option>
                        <option value="Gestion des opérations et de la chaîne logistique">{t("information_etudiant_page.programme.gestion_operations_chaine_logistique")}</option>
                        <option value="Journalisme multimédia">{t("information_etudiant_page.programme.journalisme_multimedia")}</option>
                        <option value="Langues – profil Trilinguisme et cultures">{t("information_etudiant_page.programme.langues_trilinguisme_cultures")}</option>
                        <option value="Photographie et design graphique">{t("information_etudiant_page.programme.photographie_design_graphique")}</option>
                        <option value="Sciences de la nature">{t("information_etudiant_page.programme.sciences_nature")}</option>
                        <option value="Sciences humaines – profil Administration et économie">{t("information_etudiant_page.programme.sciences_humaines_administration_economie")}</option>
                        <option value="Sciences humaines – profil Individu et relations humaines">{t("information_etudiant_page.programme.sciences_humaines_individu_relations_humaines")}</option>
                        <option value="Sciences humaines – profil Monde en action">{t("information_etudiant_page.programme.sciences_humaines_monde_en_action")}</option>
                        <option value="Soins infirmiers">{t("information_etudiant_page.programme.soins_infirmiers")}</option>
                        <option value="Soins infirmiers pour auxiliaires">{t("information_etudiant_page.programme.soins_infirmiers_auxiliaires")}</option>
                        <option value="Techniques d’éducation à l’enfance">{t("information_etudiant_page.programme.techniques_education_enfance")}</option>
                        <option value="Techniques de bureautique">{t("information_etudiant_page.programme.techniques_bureautique")}</option>
                        <option value="Techniques de comptabilité et de gestion">{t("information_etudiant_page.programme.techniques_comptabilite_gestion")}</option>
                        <option value="Techniques de l’informatique">{t("information_etudiant_page.programme.techniques_informatique")}</option>
                        <option value="Techniques de travail social">{t("information_etudiant_page.programme.techniques_travail_social")}</option>
                        <option value="Technologie de l’architecture">{t("information_etudiant_page.programme.technologie_architecture")}</option>
                        <option value="Technologie de l’estimation et de l’évaluation en bâtiment">{t("information_etudiant_page.programme.technologie_estimation_evaluation_batiment")}</option>
                        <option value="Technologie du génie civil">{t("information_etudiant_page.programme.technologie_genie_civil")}</option>
                        <option value="Technologie du génie électrique: automatisation et contrôle">{t("information_etudiant_page.programme.technologie_genie_electrique")}</option>
                        <option value="Technologie du génie physique">{t("information_etudiant_page.programme.technologie_genie_physique")}</option>
                        <option value="Tremplin DEC">{t("information_etudiant_page.programme.tremplin_dec")}</option>
                    </select>
                    <p className={"field-invalid-text"}>{errors.departement}</p>
                </div>
                <br/>

                <div className="form-dock">
                    <button onClick={() => {switchStep(false)}}><Icon path={mdiChevronLeft} size={1}/></button>
                    <div className={"toolbar-spacer"}></div>
                    <button type="submit" className={"btn-filled"}>{t("information_etudiant_page.continue")}<Icon path={mdiChevronRight} size={1}/></button>
                </div>
            </form>
        </div>
    );
}

export default InformationsEtudiant;