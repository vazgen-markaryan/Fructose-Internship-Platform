import  React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import InformationsBase from "./auth/signup/InformationsBase";
import MotDePasse from "./auth/signup/MotDePasse";
import SelectionRole from "./auth/signup/SelectionRole";
import InformationsEtudiant from "./auth/signup/InformationsEtudiant";
import InformationsEmployeur from "./auth/signup/InformationsEmployeur";
import InformationsProfesseur from "./auth/signup/InformationsProfesseur";
import {useTranslation} from "react-i18next";

const CreerUtilisateur = () => {
    const [utilisateur, setUtilisateur] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'Etudiant',
    });

    const {t} = useTranslation();

    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleChange = (event) => {
        const {name, value} = event.target;

        setUtilisateur({...utilisateur, [name]: value});
    };

    const handleSubmit = () => {
        setError("")
        utilisateur.fullName = utilisateur.firstName + " " + utilisateur.lastName
        fetch('/creer-utilisateur', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(utilisateur),
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text)
                    });
                }
                return response;
            })
            .then(() => {
                //TODO navigation temporaire car la page de connexion n'est pas encore créée
                navigate('/');
            })
            .catch(error => {
                console.log(error)
            });
    };

    const switchStep = (isForward) => {
        if (isForward) {
            next()
        } else {
            previous()
        }
    };

    const next = () => {
        if (currentStep + 1 <= 3) {
            setCurrentStep(currentStep + 1)
        } else if (currentStep + 1 === 4) {
            handleSubmit()
        }
    };

    const previous = () => {
        if (currentStep - 1 >= 0) {
            setCurrentStep(currentStep - 1)
        }
    };

    const getPage = () => {
        if (currentStep === 0) {
            return <SelectionRole utilisateur={utilisateur} handleChange={handleChange} switchStep={switchStep}></SelectionRole>
        } else if (currentStep === 1) {
            return <InformationsBase utilisateur={utilisateur} handleChange={handleChange} switchStep={switchStep}></InformationsBase>;
        } else if (currentStep === 2) {
            if (utilisateur.role === "ETUDIANT") {
                return <InformationsEtudiant utilisateur={utilisateur} handleChange={handleChange} switchStep={switchStep}></InformationsEtudiant>
            } else if (utilisateur.role === "EMPLOYEUR") {
                return <InformationsEmployeur utilisateur={utilisateur} handleChange={handleChange} switchStep={switchStep}></InformationsEmployeur>
            } else if (utilisateur.role === "PROFESSEUR") {
                return <InformationsProfesseur utilisateur={utilisateur} handleChange={handleChange} switchStep={switchStep}></InformationsProfesseur>
            }

        } else if (currentStep === 3) {
            return <MotDePasse utilisateur={utilisateur} handleChange={handleChange} switchStep={switchStep}></MotDePasse>
        }
    };

    const [currentStep, setCurrentStep] = useState(0)

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
                        <h5>{t("creer_utilisateur_page.creer_compte")}</h5>
                        <br/>
                        {
                            (currentStep !== 0) ?
                                <div className="vertical-stepper">
                                    <div className="vertical-stepper-item">

                                        <div className="vertical-stepper-content">
                                            <h6 className="vertical-stepper-title">{t("creer_utilisateur_page.profile")}</h6>
                                            <p className="vertical-stepper-desc">{t("creer_utilisateur_page.profile_2")}</p>
                                        </div>
                                    </div>
                                    <div className="vertical-stepper-item">

                                        <div className="vertical-stepper-content">
                                            <h6 className="vertical-stepper-title">{t("creer_utilisateur_page.school")}</h6>
                                            <p className="vertical-stepper-desc">{t("creer_utilisateur_page.school_2")}</p>
                                        </div>
                                    </div>
                                    <div className="vertical-stepper-item">

                                        <div className="vertical-stepper-content">
                                            <h6 className="vertical-stepper-title">{t("creer_utilisateur_page.security")}</h6>
                                            <p className="vertical-stepper-desc">{t("creer_utilisateur_page.pasword")}</p>
                                        </div>
                                    </div>
                                    <div className="vertical-stepper-item">

                                        <div className="vertical-stepper-content">
                                            <h6 className="vertical-stepper-title">{t("creer_utilisateur_page.finalization")}</h6>
                                            <p className="vertical-stepper-desc">{t("creer_utilisateur_page.dashboard")}</p>
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
                        {getPage()}
                        <p className={"field-invalid-text"} style={{"textAlign": "center"}}>{error}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreerUtilisateur;