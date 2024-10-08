import React, {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import {mdiArrowLeft, mdiChevronRight} from "@mdi/js";
import AuthService from "../services/AuthService";

import {mdiChevronRight} from "@mdi/js";
import {useTranslation} from "react-i18next";

const ConnexionUtilisateur = () => {
    const {t} = useTranslation();

    const [utilisateur, setUtilisateur] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();
    const [backendError, setBackendError] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUtilisateur({ ...utilisateur, [name]: value });

        // Effacer le message d'erreur lorsque l'utilisateur commence à taper
        setErrors({ ...errors, [name]: '' });
    };

    const handleSubmit = () => {
        let validationErrors = {};

        if (!utilisateur.email) {
            validationErrors.email = t("connexion_page.error.email");
        }

        if (!utilisateur.password) {
            validationErrors.password = t("connexion_page.error.password");
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        AuthService.SignInUser(utilisateur.email, utilisateur.password)
            .then(async response => {
                if (!response.ok) {
                    localStorage.setItem("FOSE_AUTH", await response.text());
                }

            })
            .then(() => {
                navigate('/');
            })
            .catch(error => {
                setBackendError(error.message);
            })
    };

    useEffect(() => {
        // Si utilisateur change la langue pendant qu'erreur est affichée, traduire les messages d'erreur
        setErrors(prevErrors => ({
            email: prevErrors.email ? t("connexion_page.error.email") : '',
            password: prevErrors.password ? t("connexion_page.error.password") : ''
        }));
    }, [t]);

    return (
        <div>
            <div className="bg-auth">
                <div className="bg-auth-point"></div>
                <div className="bg-auth-point"></div>
                <div className="bg-auth-point"></div>
            </div>

            <div className="auth-body">
                <div className="login-frame">
                    <div className="login-head">
                        <div className="toolbar-items">
                            <span className="mdi mdi-arrow-left"></span>
                            <div className="toolbar-items">
                                <Link to="/"><img src="/assets/logo/logo.svg" alt="" className={"logo"}/></Link>
                            </div>
                        </div>
                        <h1>{t("connexion_page.connexion")}</h1>
                    </div>
                    <div className="login-content">
                        <div className="input-container">
                            <p>{t("connexion_page.email")}:</p>
                            <input className={`${errors.email ? "field-invalid" : ""}`} type="text" name="email" required value={utilisateur.email} onChange={handleChange}/>
                            {errors.email && <p className={"field-invalid-text"}>{errors.email}</p>}
                        </div>
                        <div className="input-container">
                            <p>{t("connexion_page.password")}:</p>
                            <input className={`${errors.password ? "field-invalid" : ""}`} type="password"
                                   name="password" onChange={handleChange} value={utilisateur.password} required/>
                            {errors.password && <p className={"field-invalid-text"}>{errors.password}</p>}
                        </div>

                        {backendError && <p style={{color: 'red', textAlign: 'center'}}>{backendError}</p>}

                        <div style={{display: 'flex', alignItems: 'center', marginTop: '20px'}}>
                            <div style={{flexGrow: 1}}></div>
                            <button className="btn-filled" onClick={handleSubmit}>
                                {t("connexion_page.continue")} <Icon path={mdiChevronRight} size={1}/>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ConnexionUtilisateur;