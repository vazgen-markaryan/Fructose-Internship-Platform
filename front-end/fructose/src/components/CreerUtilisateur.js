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
                <div className="signup-frame">
                    <div className="signup-head">
                        <div className="toolbar-items">
                            <Link to="/"><Icon path={mdiArrowLeft} title="User Profile" size={1}/><span className="mdi mdi-arrow-left"></span></Link>
                            <p className="m-0">Fructose</p>
                        </div>
                        <br/>
                        <h1>Bienvenue</h1>
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