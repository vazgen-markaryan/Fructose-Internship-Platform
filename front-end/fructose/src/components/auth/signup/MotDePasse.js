import React, {useState} from "react";

const MotDePasse = ({utilisateur, handleChange, switchStep}) => {

    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const errorMessage = validateFields();
        if (errorMessage) {
            console.log(errorMessage)
        } else {
            switchStep(true)
        }
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const validateFields = () => {
        if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(utilisateur.password)) {
            return "Le mot de passe doit contenir au moins une lettre majuscule, un chiffre et un caractère spécial";
        }
        if (utilisateur.password !== confirmPassword) {
            return "Les mots de passe ne correspondent pas";
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Mot de passe:</label>
                <input type="password" name="password" onChange={handleChange} value={utilisateur.password} required />

                <label>Confirmer le mot de passe:</label>
                <input type="password" name="confirmPassword" onChange={handleConfirmPasswordChange} required />

                <br/>
                <button type={"submit"}>Continuer</button>
            </form>
        </div>
    );
}

export default MotDePasse;