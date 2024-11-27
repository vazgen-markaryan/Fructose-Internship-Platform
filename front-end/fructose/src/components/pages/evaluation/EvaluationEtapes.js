import React, {useState, useContext} from "react";
import {useTranslation} from "react-i18next";
import {Link, useLocation} from "react-router-dom";
import {AuthContext} from "../../providers/AuthProvider";

const EvaluationEtapes = () => {
    const {t} = useTranslation();
    const [currentStep, setCurrentStep] = useState(1); // Étape actuelle
    const {currentToken} = useContext(AuthContext);
    const location = useLocation();
    const initialCandidature = location.state?.candidature || {};
    // Structure des données du formulaire
    const [formData, setFormData] = useState({
        nomEleve: initialCandidature.nomEleve || "",
        programme: initialCandidature.programme || "",
        entreprise: initialCandidature.entreprise || "",
        superviseur: initialCandidature.superviseur || "",
        fonction: initialCandidature.fonction || "",
        telephone: initialCandidature.telephone || "",
        productivite: {commentaire: "", champs: {}},
        qualiteTravail: {commentaire: "", champs: {}},
        relationsInterpersonnelles: {commentaire: "", champs: {}},
        habiletesPersonnelles: {commentaire: "", champs: {}},
        appreciationGlobale: {commentaire: "", valeur: ""},
        evaluationDiscutee: "",
        nombreHeures: "",
        prochainStage: "",
        commentairesAccomplissementMandat: "",
    });

    // Gestion des changements dans les champs
    const handleChange = (e) => {
        const {name, value} = e.target;
        const keys = name.split(".");

        setFormData((prev) => {
            const updatedFormData = {...prev};

            // Gestion des champs imbriqués
            if (keys.length === 2) {
                const [section, key] = keys;
                updatedFormData[section][key] = value;
            } else if (keys.length === 3) {
                const [section, type, key] = keys;
                if (type === "champs") {
                    updatedFormData[section].champs[key] = value;
                }
            } else {
                updatedFormData[name] = value;
            }

            return updatedFormData;
        });
    };

    // Navigation entre les étapes
    const handleNextStep = () => {
        if (currentStep < 6) setCurrentStep((prev) => prev + 1);
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) setCurrentStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        const preparedData = {
            nomEleve: formData.nomEleve,
            programme: formData.programme,
            entreprise: formData.entreprise,
            superviseur: formData.superviseur,
            fonction: formData.fonction,
            telephone: formData.telephone,
            appreciationGlobale: formData.appreciationGlobale.valeur,
            commentaireAppreciationGlobale: formData.appreciationGlobale.commentaire,
            discuterAvecEtudiant: formData.evaluationDiscutee,
            nombreHeureEncadrement: parseFloat(formData.nombreHeures),
            acceuilleEleveProchainStage: formData.prochainStage,
            commentairesAccomplissementMandat: formData.commentairesAccomplissementMandat,
            signature: "Marie Curie",
            sections: Object.keys(formData)
                .filter((key) => ["productivite", "qualiteTravail", "relationsInterpersonnelles", "habiletesPersonnelles"].includes(key))
                .map((sectionKey) => ({
                    name: sectionKey,
                    commentaire: formData[sectionKey].commentaire,
                    criteres: Object.keys(formData[sectionKey].champs).map((question) => ({
                        question: question,
                        reponse: formData[sectionKey].champs[question],
                    })),
                })),
        };

        try {
            const response = await fetch("/evaluations/creer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${currentToken}`,
                },
                body: JSON.stringify(preparedData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Évaluation soumise avec succès :", data);
            } else {
                console.error("Erreur lors de la soumission de l'évaluation");
            }
        } catch (error) {
            console.error("Erreur lors de la soumission de l'évaluation :", error);
        }

    };


    // Rendu des étapes
    const renderStep = () => {
        const stepOptions = [
            {
                title: "Étape 1: Productivité",
                description: "Capacité d’optimiser son rendement au travail",
                items: [
                    "Planifier et organiser son travail de façon efficace",
                    "Comprendre rapidement les directives relatives à son travail",
                    "Maintenir un rythme de travail soutenu",
                    "Établir ses priorités",
                    "Respecter ses échéanciers"
                ],
                section: "productivite"
            },
            {
                title: "Étape 2: QUALITÉ DU TRAVAIL",
                description: "Capacité de s’acquitter des tâches sous sa responsabilité en s’imposant personnellement des normes de qualité",
                items: [
                    "Respecter les mandats qui lui ont été confiés",
                    "Porter attention aux détails dans la réalisation de ses tâches",
                    "Vérifier son travail, s’assurer que rien n’a été oublié",
                    "Rechercher des occasions de se perfectionner",
                    "Faire une bonne analyse des problèmes rencontrés"
                ],
                section: "qualiteTravail"
            },
            {
                title: "Étape 3: QUALITÉS DES RELATIONS",
                description: "Capacité d’établir des interrelations harmonieuses dans son milieu de travail",
                items: [
                    "Établir facilement des contacts avec les gens",
                    "Contribuer activement au travail d’équipe",
                    "S’adapter facilement à la culture de l’entreprise",
                    "Accepter les critiques constructives",
                    "Être respectueux envers les gens",
                    "Faire preuve d’écoute active en essayant de comprendre le point de vue de l’autre"
                ],
                section: "relationsInterpersonnelles"
            },
            {
                title: "Étape 4: HABILETÉS PERSONNELLES",
                description: "Capacité de faire preuve d’attitudes ou de comportements matures et responsables",
                items: [
                    "Démontrer de l’intérêt et de la motivation au travail",
                    "Exprimer clairement ses idées",
                    "Faire preuve d’initiative",
                    "Travailler de façon sécuritaire",
                    "Démontrer un bon sens des responsabilités ne requérant qu’un minimum de supervision",
                    "Être ponctuel et assidu à son travail"
                ],
                section: "habiletesPersonnelles"
            }
        ];

        if (currentStep <= stepOptions.length) {
            const {title, description, items, section} = stepOptions[currentStep - 1];
            return (
                <section>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    {items.map((item, idx) => (
                        <div key={idx} style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: "15px"
                        }}>
                            <label htmlFor={`${section}.champs.${item}`}
                                   style={{flex: 1, textAlign: "left", marginRight: "10px"}}>{item}</label>
                            <select
                                id={`${section}.champs.${item}`}
                                name={`${section}.champs.${item}`}
                                value={formData[section].champs[item] || ""}
                                onChange={handleChange}
                                style={{width: "50%", textAlign: "center", textAlignLast: "center"}}
                            >
                                <option value="">Sélectionner</option>
                                <option value="totalement">Totalement en accord</option>
                                <option value="plutot">Plutôt en accord</option>
                                <option value="plutotPas">Plutôt en désaccord</option>
                                <option value="pas">Totalement en désaccord</option>
                                <option value="na">N/A</option>
                            </select>
                        </div>
                    ))}
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                        <label style={{marginBottom: "10px"}}>Commentaire :</label>
                        <textarea
                            name={`${section}.commentaire`}
                            value={formData[section].commentaire || ""}
                            onChange={handleChange}
                            style={{width: "60%", marginLeft: "10px", fontSize: 12}}
                        ></textarea>
                    </div>
                </section>
            );
        } else if (currentStep === 5) {
            return (
                <section>
                    <h3>Étape 5: Appréciation globale</h3>
                    <label>Les habiletés démontrées :</label>
                    {[
                        "Dépassent de beaucoup les attentes",
                        "Dépassent les attentes",
                        "Répondent pleinement aux attentes",
                        "Répondent partiellement aux attentes",
                        "Ne répondent pas aux attentes"
                    ].map((option, idx) => (
                        <div key={idx}>
                            <input
                                type="radio"
                                name="appreciationGlobale.valeur"
                                value={option}
                                onChange={handleChange}
                                checked={formData.appreciationGlobale.valeur === option}
                            />
                            <label>{option}</label>
                        </div>
                    ))}
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                        <label>Précisez votre appréciation :</label>
                        <textarea
                            name="appreciationGlobale.commentaire"
                            value={formData.appreciationGlobale.commentaire || ""}
                            onChange={handleChange}
                            style={{width: "60%", marginLeft: "10px", fontSize: 12}}
                        ></textarea>
                    </div>
                </section>
            );
        } else if (currentStep === 6) {
            return (
                <section>
                    <h3>Étape 6: Évaluation finale</h3>
                    <label>Cette évaluation a été discutée avec le stagiaire :</label>
                    <div>
                        <input
                            type="radio"
                            name="evaluationDiscutee"
                            value="Oui"
                            onChange={handleChange}
                            checked={formData.evaluationDiscutee === "Oui"}
                        />
                        <label>Oui</label>
                        <input
                            type="radio"
                            name="evaluationDiscutee"
                            value="Non"
                            onChange={handleChange}
                            checked={formData.evaluationDiscutee === "Non"}
                        />
                        <label>Non</label>
                    </div>
                    <label>Nombre d’heures réel d’encadrement :</label>
                    <input
                        type="number"
                        name="nombreHeures"
                        value={formData.nombreHeures || ""}
                        onChange={handleChange}
                    />
                    <label>L’entreprise aimerait accueillir l’élève :</label>
                    <div>
                        <input
                            type="radio"
                            name="prochainStage"
                            value="Oui"
                            onChange={handleChange}
                            checked={formData.prochainStage === "Oui"}
                        />
                        <label>Oui</label>
                        <input
                            type="radio"
                            name="prochainStage"
                            value="Non"
                            onChange={handleChange}
                            checked={formData.prochainStage === "Non"}
                        />
                        <label>Non</label>
                        <input
                            type="radio"
                            name="prochainStage"
                            value="Peut-être"
                            onChange={handleChange}
                            checked={formData.prochainStage === "Peut-être"}
                        />
                        <label>Peut-être</label>
                    </div>
                </section>
            );
        } else {
            return <p>Étape invalide</p>;
        }
    };

    return (

        <div>
            <div className="bg-auth">
                <div className="bg-auth-point"></div>
                <div className="bg-auth-point"></div>
                <div className="bg-auth-point"></div>
            </div>

            <div className="auth-body">
                <div className={"signup-frame"}>
                    <div className={"signup-head " + (currentStep !== 0 ? "signup-head-instep" : "")} style={{
                        "background": "linear-gradient(rgba(0,0,0,0.4), rgb(255, 0, 108,0.8)), url('/assets/auth/signup/s1.jpg') center/cover",
                        "backdropFilter": "blur(10px)"
                    }}>
                        <div className="toolbar-items">
                            <Link to="/">
                                <img src="/assets/logo/logo.svg" alt="" className={"logo"}/>
                            </Link>
                        </div>
                        <br/>
                        <h5>Évaluation</h5>
                        <br/>
                        {
                            (currentStep !== 0) ?
                                <div className="vertical-stepper">
                                    <div className="vertical-stepper-item">
                                        <div className="vertical-stepper-content">
                                            <h6 className="vertical-stepper-title">Étape 1: Productivité</h6>
                                            <p className="text-center"
                                               style={{fontStyle: "italic", margin: 0}}>
                                                Capacité d’optimiser son rendement au travail
                                            </p>
                                        </div>
                                    </div>
                                    <div className="vertical-stepper-item">
                                        <div className="vertical-stepper-content">
                                            <h6 className="vertical-stepper-title">Étape 2: Qualité du travail</h6>
                                            <p className="text-center"
                                               style={{fontStyle: "italic", margin: 0}}>
                                                Capacité de s’acquitter des tâches sous sa responsabilité en s’imposant
                                                personnellement
                                                des normes de qualité
                                            </p>
                                        </div>
                                    </div>
                                    <div className="vertical-stepper-item">
                                        <div className="vertical-stepper-content">
                                            <h6 className="vertical-stepper-title">Étape 3: Qualités des relations</h6>
                                            <p className="text-center"
                                               style={{fontStyle: "italic", margin: 0}}>
                                                Capacité d’établir des interrelations harmonieuses dans son milieu de
                                                travail
                                            </p>
                                        </div>
                                    </div>
                                    <div className="vertical-stepper-item">
                                        <div className="vertical-stepper-content">
                                            <h6 className="vertical-stepper-title">Étape 4: Habiletés personnelles</h6>
                                            <p className="text-center"
                                               style={{fontStyle: "italic", margin: 0}}>
                                                Capacité de faire preuve d’attitudes ou de comportements matures et
                                                responsables
                                            </p>
                                        </div>
                                    </div>
                                    <div className="vertical-stepper-item">
                                        <div className="vertical-stepper-content">
                                            <h6 className="vertical-stepper-title">Étape 5: Appréciation globale</h6>
                                        </div>
                                    </div>
                                    <div className="vertical-stepper-item">
                                        <div className="vertical-stepper-content">
                                            <h6 className="vertical-stepper-title">Étape 6: Évaluation finale</h6>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div>
                                    <h1>{t("creer_utilisateur_page.carriere")}.</h1>
                                </div>
                        }
                        <br/>
                        <br/>
                    </div>
                    <div className="signup-content">
                        {renderStep()}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "20px",
                                position: "absolute",
                                bottom: "0px",
                                width: "100%",
                            }}
                        >
                            {currentStep > 1 && (
                                <button
                                    onClick={handlePreviousStep}
                                    style={{marginRight: "auto"}}
                                >
                                    Précédent
                                </button>
                            )}
                            {currentStep < 6 && (
                                <button
                                    onClick={handleNextStep}
                                    className="btn-filled"
                                    style={{marginLeft: "auto", marginRight: "50px"}}
                                >
                                    Suivant
                                </button>
                            )}
                            {currentStep === 6 && (
                                <button
                                    onClick={handleSubmit}
                                    className="btn-filled"
                                    style={{marginLeft: "auto", marginRight: "50px"}}
                                >
                                    Soumettre
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EvaluationEtapes;
