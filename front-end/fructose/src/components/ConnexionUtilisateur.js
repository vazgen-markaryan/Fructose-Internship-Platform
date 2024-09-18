import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import {mdiArrowLeft} from "@mdi/js";


const ConnexionUtilisateur = () => {

    const [utilisateur, setUtilisateur] = useState({
        email: '',
        password: ''
    });



    const [error, setError] = useState('');

    const navigate = useNavigate();


    const handleSubmit = () => {
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
                            <p>Courriel</p>
                            <input type="text"/>
                        </div>
                        <div className="input-container">
                            <p>Mot de passe</p>
                            <input type="text"/>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', marginTop: '20px'}}>
                            <div style={{flexGrow: 1}}></div>
                            <button className="btn-filled">
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