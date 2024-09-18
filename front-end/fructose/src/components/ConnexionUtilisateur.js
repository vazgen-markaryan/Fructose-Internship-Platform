import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import {mdiArrowLeft} from "@mdi/js";


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
                console.error('Erreur:', error);
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
                                <Link to="/"><Icon path={mdiArrowLeft} size={1}/></Link>
                                <p className="m-0">Fructose</p>
                            </div>
                        </div>
                        <h1>Connexion</h1>
                    </div>
                    <div className="login-content">
                        <div className="input-container">
                            <label>Email:</label>
                            <input type="text" name="email" required value={utilisateur.email} onChange={handleChange}/>
                            {errors.email && <p style={{color: 'red'}}>{errors.email}</p>}
                        </div>
                        <div className="input-container">
                            <label>Mot de passe:</label>
                            <input type="password" name="password" onChange={handleChange} value={utilisateur.password} required/>
                            {errors.password && <p style={{color: 'red'}}>{errors.password}</p>}
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', marginTop: '20px'}}>
                            <div style={{flexGrow: 1}}></div>
                            <button className="btn-filled" onClick={handleSubmit}>
                                Continuer <span className="mdi mdi-chevron-right"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConnexionUtilisateur;