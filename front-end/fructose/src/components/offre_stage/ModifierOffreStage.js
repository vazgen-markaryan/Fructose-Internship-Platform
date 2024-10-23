import React, {useContext, useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {mdiArrowLeft} from "@mdi/js";
import Icon from "@mdi/react";
import {AuthContext} from "../../providers/AuthProvider";
import {OffreStageContext} from "../../providers/OffreStageProvider";
import {getDepartement} from "../../utilities/api/apiService";

const ModifierOffreStage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { currentUser, currentToken } = useContext(AuthContext);
    const [offreStage, setOffreStage] = useState(null);
    const [errors, setErrors] = useState({});
    const { fetchOffreStage, updateOffreStage } = useContext(OffreStageContext);

    useEffect(() => {
        if (currentUser) {
            (async function () {
                if (currentUser.role === "EMPLOYEUR") {
                    try {
                        const response = await fetchOffreStage(id);
                        setOffreStage(response);
                    } catch (error) {
                        console.log("error" + error);
                    }
                }
            })();
        }
    }, [currentUser]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === 'dateDebut' || name === 'dateFin' || name === 'dateLimiteCandidature') {
            setOffreStage({ ...offreStage, [name]: new Date(value).toISOString().split('T')[0] });
        } else {
            setOffreStage({ ...offreStage, [name]: value });
        }
    };

    const validateFields = () => {
        const {
            nom, poste, description,
            compagnie, departementDTO, tauxHoraire,
            typeEmploi, adresse, modaliteTravail,
            nombreHeuresSemaine, nombrePostes,
        } = offreStage;

        const errors = {};

        if (nom.length < 3 || nom.length > 100) {
            errors.nom = "Nom must be between 3 and 100 characters.";
        }
        if (poste.length < 3 || poste.length > 100) {
            errors.poste = "Poste must be between 3 and 100 characters.";
        }
        if (description.length < 10 || description.length > 500) {
            errors.description = "Description must be between 10 and 500 characters.";
        }
        if (compagnie.length < 3 || compagnie.length > 100) {
            errors.compagnie = "Compagnie must be between 3 and 100 characters.";
        }
        if (tauxHoraire < 0) {
            errors.tauxHoraire = "Taux horaire must be positive.";
        }
        if (adresse.length < 3 || adresse.length > 100) {
            errors.adresse = "Adresse must be between 3 and 100 characters.";
        }
        if (nombreHeuresSemaine < 1) {
            errors.nombreHeuresSemaine = "Nombre d'heures par semaine must be at least 1.";
        } else if (nombreHeuresSemaine > 40) {
            errors.nombreHeuresSemaine = "Nombre d'heures par semaine must be at most 40.";
        }
        if (nombrePostes < 1) {
            errors.nombrePostes = "Nombre de postes must be at least 1.";
        }
        if (departementDTO === "select" || departementDTO === "") {
            errors.departementDTO = "Please select a department.";
        }
        if (typeEmploi === "select" || typeEmploi === "") {
            errors.typeEmploi = "Please select a type of employment.";
        }
        if (modaliteTravail === "select" || modaliteTravail === "") {
            errors.modaliteTravail = "Please select a work modality.";
        }

        return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const errorMessage = validateFields();
        if (Object.keys(errorMessage).length > 0) {
            setErrors(errorMessage);
        } else {
            try {
                // Prepare your date fields for submission
                offreStage.dateDebut = new Date(offreStage.dateDebut).toISOString().split('T')[0];
                offreStage.dateFin = new Date(offreStage.dateFin).toISOString().split('T')[0];
                offreStage.dateLimiteCandidature = new Date(offreStage.dateLimiteCandidature).toISOString().split('T')[0];

                // Update the departement field if necessary
                const departement = await getDepartement(offreStage.departementDTO);
                if (departement) {
                    offreStage.departementDTO = departement;
                }

                // Call the update API
                const response = await updateOffreStage(offreStage);
                console.log("Successfully updated offreStage:", response);

                // If successful, navigate back
                navigate(-1);

            } catch (error) {
                console.error("Error updating offre stage:", error.message); // Log the actual error message
            }
        }
    };



    if (!offreStage) {
        return <div>Loading...</div>; // Handle loading state
    }

    return (
        <>
            <div className="dashboard-card-toolbar">
                <button className="btn-icon-dashboard" onClick={() => navigate(-1)}>
                    <Icon path={mdiArrowLeft} size={1.4}/>
                </button>
                <h1>{t("modifier_offre_stage_page.title")}</h1>
            </div>
            <div className="dashboard-card">
                <section>
                    <form onSubmit={handleSubmit}>
                        <label>{t("modifier_offre_stage_page.nom")}</label>
                        <input value={offreStage.nom || ''} type="text" name="nom" onChange={handleInputChange}
                               required/>
                        <p className="field-invalid-text">{errors.nom}</p>

                        <label>{t("modifier_offre_stage_page.poste")}</label>
                        <input value={offreStage.poste || ''} type="text" name="poste" onChange={handleInputChange}
                               required/>
                        <p className="field-invalid-text">{errors.poste}</p>

                        <label>{t("modifier_offre_stage_page.description")}</label>
                        <input value={offreStage.description || ''} type="text" name="description"
                               onChange={handleInputChange} required/>
                        <p className="field-invalid-text">{errors.description}</p>

                        <label>{t("modifier_offre_stage_page.compagnie")}</label>
                        <input value={offreStage.compagnie || ''} type="text" name="compagnie"
                               onChange={handleInputChange} required/>
                        <p className="field-invalid-text">{errors.compagnie}</p>

                        <label>{t("modifier_offre_stage_page.adresse")}</label>
                        <input value={offreStage.adresse || ''} type="text" name="adresse" onChange={handleInputChange}
                               required/>
                        <p className="field-invalid-text">{errors.adresse}</p>

                        <label>{t("modifier_offre_stage_page.taux_horaire")}</label>
                        <input value={offreStage.tauxHoraire || ''} type="number" name="tauxHoraire"
                               onChange={handleInputChange} required min="0"/>
                        <p className="field-invalid-text">{errors.tauxHoraire}</p>

                        <label>{t("modifier_offre_stage_page.nombre_heures_semaine")}</label>
                        <input value={offreStage.nombreHeuresSemaine || ''} type="number" name="nombreHeuresSemaine"
                               onChange={handleInputChange} required min="1"/>
                        <p className="field-invalid-text">{errors.nombreHeuresSemaine}</p>

                        <label>{t("modifier_offre_stage_page.nombre_postes")}</label>
                        <input value={offreStage.nombrePostes || ''} type="number" name="nombrePostes"
                               onChange={handleInputChange} required min="1"/>
                        <p className="field-invalid-text">{errors.nombrePostes}</p>

                        <label>{t("modifier_offre_stage_page.type_emploi")}</label>
                        <select name="typeEmploi" onChange={handleInputChange} value={offreStage.typeEmploi || 'select'}
                                required>
                            <option value="select">{t("modifier_offre_stage_page.modalites_travail.select")}</option>
                            <option
                                value="virtuel">{t("modifier_offre_stage_page.modalites_travail.teletravail")}</option>
                            <option
                                value="presentiel">{t("modifier_offre_stage_page.modalites_travail.presentiel")}</option>
                            <option value="hybride">{t("modifier_offre_stage_page.modalites_travail.hybride")}</option>
                        </select>
                        <p className="field-invalid-text">{errors.typeEmploi}</p>

                        <label>{t("modifier_offre_stage_page.departement")}</label>
                        <select name="departementDTO" onChange={handleInputChange}
                                value={offreStage.departementDTO || ''} required>
                            <option value="">{t("departement.select")}</option>
                            <option value="cinema">{t("departement.cinema")}</option>
                            <option value="gestion_commerce">{t("departement.gestion_commerce")}</option>
                            <option
                                value="gestion_operations_chaine_logistique">{t("departement.gestion_operations_chaine_logistique")}</option>
                            <option value="journalisme_multimedia">{t("departement.journalisme_multimedia")}</option>
                            <option
                                value="langues_trilinguisme_cultures">{t("departement.langues_trilinguisme_cultures")}</option>
                            <option
                                value="photographie_design_graphique">{t("departement.photographie_design_graphique")}</option>
                            <option value="sciences_nature">{t("departement.sciences_nature")}</option>
                            <option
                                value="sciences_humaines_administration_economie">{t("departement.sciences_humaines_administration_economie")}</option>
                            <option
                                value="sciences_humaines_individu_relations_humaines">{t("departement.sciences_humaines_individu_relations_humaines")}</option>
                            <option
                                value="sciences_humaines_monde_en_action">{t("departement.sciences_humaines_monde_en_action")}</option>
                            <option value="soins_infirmiers">{t("departement.soins_infirmiers")}</option>
                            <option
                                value="soins_infirmiers_auxiliaires">{t("departement.soins_infirmiers_auxiliaires")}</option>
                            <option
                                value="techniques_education_enfance">{t("departement.techniques_education_enfance")}</option>
                            <option value="techniques_bureautique">{t("departement.techniques_bureautique")}</option>
                            <option
                                value="techniques_comptabilite_gestion">{t("departement.techniques_comptabilite_gestion")}</option>
                            <option value="techniques_informatique">{t("departement.techniques_informatique")}</option>
                            <option
                                value="techniques_travail_social">{t("departement.techniques_travail_social")}</option>
                            <option
                                value="technologie_architecture">{t("departement.technologie_architecture")}</option>
                            <option
                                value="technologie_estimation_evaluation_batiment">{t("departement.technologie_estimation_evaluation_batiment")}</option>
                            <option value="technologie_genie_civil">{t("departement.technologie_genie_civil")}</option>
                            <option
                                value="technologie_genie_electrique">{t("departement.technologie_genie_electrique")}</option>
                            <option
                                value="technologie_genie_physique">{t("departement.technologie_genie_physique")}</option>
                            <option value="tremplin_dec">{t("departement.tremplin_dec")}</option>
                        </select>
                        <p className="field-invalid-text">{errors.departementDTO}</p>

                        <label>{t("modifier_offre_stage_page.modalite_travail")}</label>
                        <select name="modaliteTravail" onChange={handleInputChange}
                                value={offreStage.modaliteTravail || 'select'} required>
                            <option value={"select"}>{t("modifier_offre_stage_page.types_emploi.select")}</option>
                            <option
                                value="temps_partiel">{t("modifier_offre_stage_page.types_emploi.temps_partiel")}</option>
                            <option
                                value="temps_plein">{t("modifier_offre_stage_page.types_emploi.temps_plein")}</option>
                        </select>
                        <p className="field-invalid-text">{errors.modaliteTravail}</p>

                        <label>{t("modifier_offre_stage_page.date_limite_candidate")}</label>
                        <input
                            className={`${errors.dateLimiteCandidature ? "field-invalid" : ""}`}
                            type="date"
                            name="dateLimiteCandidature"
                            onChange={handleInputChange}
                            value={offreStage.dateLimiteCandidature}
                            required
                            min={new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]}
                            onKeyDown={(e) => {
                                const currentDate = new Date(e.target.value);
                                const minDate = new Date(new Date().setDate(new Date().getDate() + 7));  // 7 days from today
                                if (e.key === 'ArrowDown' && currentDate <= minDate) {
                                    e.preventDefault(); // Prevent going below 7 days from today
                                }
                            }}
                        />
                        <p className="field-invalid-text">{errors.dateLimiteCandidature}</p>

                        <label>{t("modifier_offre_stage_page.date_debut")}</label>
                        <input
                            className={`${errors.dateDebut ? "field-invalid" : ""}`}
                            type="date"
                            name="dateDebut"
                            onChange={handleInputChange}
                            value={offreStage.dateDebut}
                            required
                            min={offreStage.dateLimiteCandidature instanceof Date && !isNaN(offreStage.dateLimiteCandidature.getTime())
                                ? new Date(new Date(offreStage.dateLimiteCandidature).setDate(new Date(offreStage.dateLimiteCandidature).getDate() + 1)).toISOString().split('T')[0]
                                : ""}
                            onKeyDown={(e) => {
                                const minDate = new Date(new Date(offreStage.dateLimiteCandidature).setDate(new Date(offreStage.dateLimiteCandidature).getDate() + 1));

                                if (e.key === 'ArrowDown' && offreStage.dateDebut.getTime() <= minDate.getTime()) {
                                    e.preventDefault(); // Prevent going below dateLimiteCandidature + 1 day
                                }
                            }}
                        />
                        <p className="field-invalid-text">{errors.dateDebut}</p>

                        <label>{t("modifier_offre_stage_page.date_fin")}</label>
                        <input
                            className={`${errors.dateFin ? "field-invalid" : ""}`}
                            type="date"
                            name="dateFin"
                            onChange={handleInputChange}
                            value={offreStage.dateFin}
                            required
                            min={offreStage.dateDebut instanceof Date && !isNaN(offreStage.dateDebut.getTime())
                                ? new Date(new Date(offreStage.dateDebut).setDate(new Date(offreStage.dateDebut).getDate() + 1)).toISOString().split('T')[0]
                                : ""}
                            onKeyDown={(e) => {
                                const currentDate = new Date(e.target.value);
                                const minDate = new Date(new Date(offreStage.dateDebut).setDate(new Date(offreStage.dateDebut).getDate() + 1));

                                if (e.key === 'ArrowDown' && currentDate <= minDate) {
                                    e.preventDefault(); // Prevent going below dateDebut + 1 day
                                }
                            }}
                        />
                        <p className={"field-invalid-text"}>{errors.dateFin}</p>
                        <br/>
                        <br/>
                        <button type="submit">{t("modifier_offre_stage_page.modify_offre_stage")}</button>
                    </form>
                </section>
            </div>
        </>
    );
};

export default ModifierOffreStage;