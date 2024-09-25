import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import {mdiArrowLeft, mdiChevronRight} from "@mdi/js";


const ConnexionUtilisateur = () => {
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
            validationErrors.email = 'Email est requis';
        }

        if (!utilisateur.password) {
            validationErrors.password = 'Mot de passe est requis';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        fetch('/connexion', {
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
                setBackendError(error.message);
            });
    };

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
                        <h1>Connexion</h1>
                    </div>
                    <div className="login-content">


                        <div className="input-container">
                            <p>Courriel:</p>
                            <input className={`${errors.email ? "field-invalid" : ""}`} type="text" name="email" required value={utilisateur.email} onChange={handleChange}/>
                            {errors.email && <p className={"field-invalid-text"}>{errors.email}</p>}
                        </div>
                        <div className="input-container">
                            <p>Mot de passe:</p>
                            <input className={`${errors.password ? "field-invalid" : ""}`} type="password" name="password" onChange={handleChange} value={utilisateur.password} required/>
                            {errors.password && <p className={"field-invalid-text"}>{errors.password}</p>}
                        </div>

                        {backendError && <p style={{color: 'red', textAlign: 'center'}}>{backendError}</p>}

                        <div style={{display: 'flex', alignItems: 'center', marginTop: '20px'}}>
                            <div style={{flexGrow: 1}}></div>
                            <button className="btn-filled" onClick={handleSubmit}>
                                Continuer <Icon path={mdiChevronRight} size={1}/>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ConnexionUtilisateur;