import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";

const EvaluationEtapes = () => {
    const {t} = useTranslation();
    const [currentStep, setCurrentStep] = useState(1); // Étape actuelle
    const [formData, setFormData] = useState({
        nomEleve: "",
        programme: "",
        entreprise: "",
        superviseur: "",
        fonction: "",
        telephone: "",
        productivite: {commentaire: "", champs: {}},
        qualiteTravail: {commentaire: "", champs: {}},
        relationsInterpersonnelles: {commentaire: "", champs: {}},
        habiletesPersonnelles: {commentaire: "", champs: {}},
        appreciationGlobale: {commentaire: ""},
    });

    // Gestion des données du formulaire
    const handleChange = (e) => {
        const {name, value} = e.target;
        const [section, key] = name.split('.');
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }));
    };

    // Navigation entre les étapes
    const handleNextStep = () => {
        if (currentStep < 6) setCurrentStep((prev) => prev + 1);
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) setCurrentStep((prev) => prev - 1);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <section>
                        <div>
                            <h3 style={{display: "inline", marginRight: "10px"}}>Étape 1: Productivité</h3>
                            <p className="text-center" style={{fontStyle: "italic", margin: 0, paddingBottom: 20}}>
                                Capacité d’optimiser son rendement au travail
                            </p>
                        </div>
                        {["Planifier et organiser son travail de façon efficace",
                            "Comprendre rapidement les directives relatives à son \n" +
                            "Maintenir un rythme de travail soutenu ",
                            "Établir ses priorités",
                            "Respecter ses échéanciers"].map((item, idx) => (
                            <div key={idx} style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: "15px"
                            }}>
                                <label htmlFor={item} style={{flex: 1, textAlign: "left", marginRight: "10px"}}>
                                    {item}
                                </label>
                                <div style={{flex: 2, display: "flex", justifyContent: "left"}}>
                                    <select
                                        id={item}
                                        name={`productivite.${item}`}
                                        onChange={handleChange}
                                        style={{
                                            width: "50%",
                                            textAlign: "center",
                                            textAlignLast: "center",
                                        }}
                                    >
                                        <option value="">Sélectionner</option>
                                        <option value="totalement">Totalement en accord</option>
                                        <option value="plutot">Plutôt en accord</option>
                                        <option value="plutotPas">Plutôt en désaccord</option>
                                        <option value="pas">Totalement en désaccord</option>
                                        <option value="na">N/A</option>
                                    </select>
                                </div>

                            </div>
                        ))}
                        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                            <label style={{marginBottom: "10px"}}>Commentaire :</label>
                            <textarea
                                name="productivite.commentaire"
                                value={formData.productivite.commentaire}
                                onChange={handleChange}
                                className="form-control"
                                style={{width: "60%", marginLeft: "10px", fontSize: 12}}
                            ></textarea>

                        </div>
                    </section>
                );
            case 2:
                return (
                    <section>
                        <div>
                            <h3 style={{display: "inline", marginRight: "10px"}}>Étape 2: QUALITÉ DU TRAVAIL</h3>
                            <p className="text-center" style={{fontStyle: "italic", margin: 0, paddingBottom: 20}}>
                                Capacité de s’acquitter des tâches sous sa responsabilité en s’imposant personnellement
                                des normes de qualité
                            </p>
                        </div>
                        {["respecter les mandats qui lui ont été confiés",
                            "porter attention aux détails dans la réalisation de ses \n" +
                            "tâches",
                            "vérifier son travail, s’assurer que rien n’a été oublié ",
                            "rechercher des occasions de se perfectionner ",
                            "faire une bonne analyse des problèmes rencontrés "].map((item, idx) => (
                            <div key={idx} style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: "15px"
                            }}>
                                <label htmlFor={item} style={{flex: 1, textAlign: "left", marginRight: "10px"}}>
                                    {item}
                                </label>
                                <div style={{flex: 2, display: "flex", justifyContent: "center"}}>
                                    <select
                                        id={item}
                                        name={`qualiteTravail.${item}`}
                                        onChange={handleChange}
                                        style={{
                                            width: "50%",
                                            textAlign: "center",
                                            textAlignLast: "center",
                                        }}
                                    >
                                        <option value="">Sélectionner</option>
                                        <option value="totalement">Totalement en accord</option>
                                        <option value="plutot">Plutôt en accord</option>
                                        <option value="plutotPas">Plutôt en désaccord</option>
                                        <option value="pas">Totalement en désaccord</option>
                                        <option value="na">N/A</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                            <label style={{marginBottom: "10px"}}>Commentaire :</label>
                            <textarea
                                name="productivite.commentaire"
                                value={formData.qualiteTravail.commentaire}
                                onChange={handleChange}
                                className="form-control"
                                style={{width: "60%", marginLeft: "10px", fontSize: 12}}
                            ></textarea>
                        </div>
                    </section>
                );
            case 3:
                return (
                    <section>
                        <div>
                            <h3 style={{display: "inline", marginRight: "10px"}}>Étape 3: QUALITÉS DES RELATIONS</h3>
                            <p className="text-center" style={{fontStyle: "italic", margin: 0, paddingBottom: 20}}>
                                Capacité d’établir des interrelations harmonieuses dans son milieu de travail
                            </p>
                        </div>
                        {[" Établir facilement des contacts avec les gens ",
                            "Contribuer activement au travail d’équipe ",
                            "S’adapter facilement à la culture de l’entreprise ",
                            "Accepter les critiques constructives",
                            "Être respectueux envers les gens",
                            "Aire preuve d’écoute active en essayant de comprendre le point de vue de l’autre "].map((item, idx) => (
                            <div key={idx} style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: "15px"
                            }}>
                                <label htmlFor={item} style={{flex: 1, textAlign: "left", marginRight: "10px"}}>
                                    {item}
                                </label>
                                <div style={{flex: 2, display: "flex", justifyContent: "center"}}>
                                    <select
                                        id={item}
                                        name={`habiletesPersonnelles.${item}`}
                                        onChange={handleChange}
                                        style={{
                                            width: "50%",
                                            textAlign: "center",
                                            textAlignLast: "center",
                                        }}
                                    >
                                        <option value="">Sélectionner</option>
                                        <option value="totalement">Totalement en accord</option>
                                        <option value="plutot">Plutôt en accord</option>
                                        <option value="plutotPas">Plutôt en désaccord</option>
                                        <option value="pas">Totalement en désaccord</option>
                                        <option value="na">N/A</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                            <label style={{marginBottom: "10px"}}>Commentaire :</label>
                            <textarea
                                name="relationsInterpersonnelles.commentaire"
                                value={formData.relationsInterpersonnelles.commentaire}
                                onChange={handleChange}
                                className="form-control"
                                style={{width: "60%", marginLeft: "10px", fontSize: 12}}
                            ></textarea>
                        </div>
                    </section>
                );
            case 4:
                return (
                    <section>
                        <div>
                            <h3 style={{display: "inline", marginRight: "10px"}}>Étape 4: HABILETÉS PERSONNELLES</h3>
                            <p className="text-center" style={{fontStyle: "italic", margin: 0, paddingBottom: 20}}>
                                Capacité de faire preuve d’attitudes ou de comportements matures et responsables
                            </p>
                        </div>
                        {[" Démontrer de l’intérêt et de la motivation au travail  ",
                            "Exprimer clairement ses idées ",
                            "Faire preuve d’initiative  ",
                            "Travailler de façon sécuritaire ",
                            "Démontrer un bon sens des responsabilités ne requérant qu’un minimum de supervision",
                            "Être ponctuel et assidu à son travail "].map((item, idx) => (
                            <div key={idx} style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: "15px"
                            }}>
                                <label htmlFor={item} style={{flex: 1, textAlign: "left", marginRight: "10px"}}>
                                    {item}
                                </label>
                                <div style={{flex: 2, display: "flex", justifyContent: "center"}}>
                                    <select
                                        id={item}
                                        name={`habiletesPersonnelles.${item}`}
                                        onChange={handleChange}
                                        style={{
                                            width: "50%",
                                            textAlign: "center",
                                            textAlignLast: "center",
                                        }}
                                    >
                                        <option value="">Sélectionner</option>
                                        <option value="totalement">Totalement en accord</option>
                                        <option value="plutot">Plutôt en accord</option>
                                        <option value="plutotPas">Plutôt en désaccord</option>
                                        <option value="pas">Totalement en désaccord</option>
                                        <option value="na">N/A</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                            <label style={{marginBottom: "10px"}}>Commentaire :</label>
                            <textarea
                                name="habiletesPersonnelles.commentaire"
                                value={formData.habiletesPersonnelles.commentaire}
                                onChange={handleChange}
                                className="form-control"
                                style={{width: "60%", marginLeft: "10px", fontSize: 12}}
                            ></textarea>
                        </div>
                    </section>
                );
            case 5:
                return (
                    <section>
                        <h3 className="text-center">Étape 5 : Appréciation globale</h3>
                        <div style={{marginBottom: "20px"}}>
                            <label>Les habiletés démontrées :</label>
                            {[
                                "Dépassent de beaucoup les attentes",
                                "Dépassent les attentes",
                                "Répondent pleinement aux attentes",
                                "Répondent partiellement aux attentes",
                                "Ne répondent pas aux attentes",
                            ].map((option, idx) => (
                                <div key={idx}>
                                    <input
                                        type="radio"
                                        id={`appreciation-${idx}`}
                                        name="appreciationGlobale"
                                        value={option}
                                        onChange={handleChange}
                                        style={{marginRight: "10px"}}
                                    />
                                    <label htmlFor={`appreciation-${idx}`}>{option}</label>
                                </div>
                            ))}
                        </div>
                        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                            <labelc style={{marginBottom: "10px"}}>Précisez votre appréciation :</labelc>
                            <textarea
                                name="appreciationGlobaleCommentaire"
                                value={formData.appreciationGlobale.commentaire}
                                onChange={handleChange}
                                className="form-control"
                                style={{width: "60%", marginLeft: "10px", fontSize: 12}}
                            ></textarea>
                        </div>
                    </section>
                );
            case 6:
                return (
                    <section>
                        <h3 className="text-center">Étape 6 : Évaluation finale</h3>
                        <div style={{marginBottom: "15px"}}>
                            <label>Cette évaluation a été discutée avec le stagiaire :</label>
                            <div>
                                <input
                                    type="radio"
                                    id="evaluation-oui"
                                    name="evaluationDiscutee"
                                    value="Oui"
                                    onChange={handleChange}
                                    style={{marginRight: "10px"}}
                                />
                                <label htmlFor="evaluation-oui">Oui</label>
                                <input
                                    type="radio"
                                    id="evaluation-non"
                                    name="evaluationDiscutee"
                                    value="Non"
                                    onChange={handleChange}
                                    style={{marginLeft: "20px", marginRight: "10px"}}
                                />
                                <label htmlFor="evaluation-non">Non</label>
                            </div>
                        </div>
                        <div style={{marginBottom: "15px"}}>
                            <label>
                                Veuillez indiquer le nombre d’heures réel par semaine d’encadrement
                                accordé au stagiaire :
                            </label>
                            <input
                                type="number"
                                name="nombreHeures"
                                onChange={handleChange}
                                className="form-control"
                                style={{width: "20%", marginTop: "10px"}}
                            />
                        </div>
                        <div style={{marginBottom: "15px"}}>
                            <label>L’entreprise aimerait accueillir cet élève pour son prochain stage :</label>
                            <div>
                                <input
                                    type="radio"
                                    id="stage-oui"
                                    name="prochainStage"
                                    value="Oui"
                                    onChange={handleChange}
                                    style={{marginRight: "10px"}}
                                />
                                <label htmlFor="stage-oui">Oui</label>
                                <input
                                    type="radio"
                                    id="stage-non"
                                    name="prochainStage"
                                    value="Non"
                                    onChange={handleChange}
                                    style={{marginLeft: "20px", marginRight: "10px"}}
                                />
                                <label htmlFor="stage-non">Non</label>
                                <input
                                    type="radio"
                                    id="stage-peutetre"
                                    name="prochainStage"
                                    value="Peut-être"
                                    onChange={handleChange}
                                    style={{marginLeft: "20px", marginRight: "10px"}}
                                />
                                <label htmlFor="stage-peutetre">Peut-être</label>
                            </div>
                        </div>
                    </section>
                );
            default:
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
                                    onClick={() => console.log(formData)}
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
