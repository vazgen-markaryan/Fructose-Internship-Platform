import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

const CreerUtilisateur = () => {
    const [utilisateur, setUtilisateur] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        adress: '',
        matricule: '',
        role: ''
    });

    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUtilisateur({ ...utilisateur, [name]: value });

        //TODO Seulement poour le futur Debug
        // if (name === 'role') {
        //     console.log('Rôle sélectionné :', value);
        // }
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const validateFields = () => {
        const { fullName, email, password, phoneNumber, adress, matricule, role } = utilisateur;

        if (!/^[A-Za-z\s]+$/.test(fullName)) {
            return "Le nom complet doit contenir uniquement des lettres et des espaces";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return "L'adresse courriel doit être valide";
        }
        if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(password)) {
            return "Le mot de passe doit contenir au moins une lettre majuscule, un chiffre et un caractère spécial";
        }
        if (password !== confirmPassword) {
            return "Les mots de passe ne correspondent pas";
        }
        if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(phoneNumber)) {
            return "Le numéro de téléphone doit être au format (123) 456-7890";
        }
        if (adress.length < 3 || adress.length > 100) {
            return "L'adresse doit contenir entre 3 et 100 caractères";
        }
        if (!/^[A-Za-z0-9\s]+$/.test(adress)) {
            return "L'adresse doit contenir uniquement des lettres et des chiffres";
        }
        if (!/^\d{7}$/.test(matricule)) {
            return "Le Matricule doit contenir 7 chiffres";
        }
        if (!/^[A-Za-z\s]+$/.test(role)) {
            return "Le rôle doit contenir uniquement des lettres et des espaces";
        }
        return null;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const errorMessage = validateFields();
        if (errorMessage) {
            setError(errorMessage);
            return;
        }

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
            <h1>Créer Utilisateur</h1>
            <form onSubmit={handleSubmit}>
                <label>Nom complet:</label>
                <input type="text" name="fullName" onChange={handleChange} required />

                <label>Email:</label>
                <input type="email" name="email" onChange={handleChange} required />

                <label>Mot de passe:</label>
                <input type="password" name="password" onChange={handleChange} required />

                <label>Confirmer le mot de passe:</label>
                <input type="password" name="confirmPassword" onChange={handleConfirmPasswordChange} required />

                <label>Téléphone:</label>
                <input type="text" name="phoneNumber" onChange={handleChange} required />

                <label>Adresse:</label>
                <input type="text" name="adress" onChange={handleChange} required />

                <label>Matricule:</label>
                <input type="text" name="matricule" onChange={handleChange} required />

                <label>Rôle:</label>
                <select name="role" onChange={handleChange} value={utilisateur.role} required>
                    <option value="">Sélectionner un rôle</option>
                    <option value="Etudiant">Etudiant</option>
                    <option value="Professeur">Professeur</option>
                    <option value="Employeur">Employeur</option>
                    <option value="Gestionnaire de Stage">Gestionnaire de Stage</option>
                </select><br/>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <input type="submit" value="Créer Utilisateur" />

                <nav>
                    <ul>
                        <li><Link to="/">Retour à l'accueil</Link></li>
                    </ul>
                </nav>
            </form>
        </div>
    );
}

export default CreerUtilisateur;