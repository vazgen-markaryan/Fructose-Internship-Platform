import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import InformationsBase from "./auth/signup/InformationsBase";
import CoordonneesUtilisateur from "./auth/signup/CoordonneesUtilisateur";
import MotDePasse from "./auth/signup/MotDePasse";
import SelectionRole from "./auth/signup/SelectionRole";
import InformationsEtudiant from "./auth/signup/InformationsEtudiant";
import InformationsEmployeur from "./auth/signup/InformationsEmployeur";
import InformationsGestionnaire from "./auth/signup/InformationsGestionnaire";
import {mdiArrowLeft} from "@mdi/js";
import Icon from "@mdi/react";

const CreerUtilisateur = () => {
    const [utilisateur, setUtilisateur] = useState({
        firstName: '',
        lastName: '',
        email: '',
        companyName: '',
        password: '',
        role: '',
    });

    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;

        setUtilisateur({ ...utilisateur, [name]: value });

        //TODO Seulement poour le futur Debug
        if (name === 'role') {
            console.log('Rôle sélectionné :', value);
         }
    };




    const handleSubmit = () => {
        utilisateur.fullName = utilisateur.firstName + " " + utilisateur.lastName
        console.log(utilisateur.fullName)
        fetch('/creer-utilisateur', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(utilisateur),
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) });
                }
                return response;
            })
            .then(() => {
                //TODO navigation temporaire car la page de connexion n'est pas encore créée
                navigate('/');
            })
            .catch(error => {
                setError(`Erreur: ${error.message}`); //Pour afficher erreur sur Écran
                console.error('Erreur:', error);
            });
    };

    const switchStep = (isForward) =>{
        if(isForward){
            next()
        } else {
            previous()
        }
    };

    const next = () => {
        if(currentStep + 1 <= 3){
            setCurrentStep(currentStep + 1)
        } else if (currentStep + 1 === 4){
            handleSubmit()
        }
    };

    const previous = () => {
        if(currentStep - 1 >= 0){
            setCurrentStep(currentStep - 1)
        }
    };

    const getPage = () => {
        if (currentStep === 0){
            return <SelectionRole utilisateur={utilisateur} handleChange={handleChange} switchStep={switchStep}></SelectionRole>
        } else if(currentStep === 1){
            return <InformationsBase utilisateur={utilisateur} handleChange={handleChange} switchStep={switchStep}></InformationsBase>;
        } else if (currentStep === 2){
            if(utilisateur.role === "Etudiant"){
                return <InformationsEtudiant utilisateur={utilisateur} handleChange={handleChange} switchStep={switchStep}></InformationsEtudiant>
            }else if (utilisateur.role === "Employeur"){
                return <InformationsEmployeur utilisateur={utilisateur} handleChange={handleChange} switchStep={switchStep}></InformationsEmployeur>
            }else if (utilisateur.role === "Professeur"){
                return <InformationsGestionnaire utilisateur={utilisateur} handleChange={handleChange} switchStep={switchStep}></InformationsGestionnaire>
            }

        } else if (currentStep === 3){
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
                    <div className={"signup-head " + (currentStep !== 0 ? "signup-head-instep":"")} style={{"background": "linear-gradient(rgba(0,0,0,0.4), rgb(255, 0, 108,0.8)), url('/assets/auth/signup/s1.jpg') center/cover", "backdropFilter":"blur(10px)"}}>
                        <div className="toolbar-items">
                            <Link to="/">
                                <img src="/assets/logo/logo.svg" alt="" className={"logo"}/>
                            </Link>
                        </div>
                        <br/>
                        <h5>Créer votre compte</h5>
                        <br/>
                        {
                            (currentStep !== 0)?
                            <div className="vertical-stepper">
                                <div className="vertical-stepper-item">

                                <div className="vertical-stepper-content">
                                <h6 className="vertical-stepper-title">Votre profil</h6>
                                <p className="vertical-stepper-desc">Informations cruciales pour votre profil</p>
                                </div>
                                </div>
                                <div className="vertical-stepper-item">

                                <div className="vertical-stepper-content">
                                <h6 className="vertical-stepper-title">Informations scolaires</h6>
                                <p className="vertical-stepper-desc">Information liées à votre cheminement scolaire</p>
                                </div>
                                </div>
                                <div className="vertical-stepper-item">

                                <div className="vertical-stepper-content">
                                <h6 className="vertical-stepper-title">Sécurité</h6>
                                <p className="vertical-stepper-desc">Créez votre mot de passe</p>
                                </div>
                                </div>
                                <div className="vertical-stepper-item">

                                <div className="vertical-stepper-content">
                                <h6 className="vertical-stepper-title">Finalisation</h6>
                                <p className="vertical-stepper-desc">Accèdez au tableau de bord</p>
                                </div>
                                </div>
                            </div>
                            :
                                <div>
                                    <h1>Votre carrière commence ici.</h1>
                                </div>
                        }
                        <br/>
                        <br/>

                    </div>
                    <div className="signup-content">
                        {getPage()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreerUtilisateur;