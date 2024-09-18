import React, {useState} from "react";
import Icon from "@mdi/react";
import {mdiChevronLeft, mdiChevronRight} from "@mdi/js";

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
                <p>Mot de passe:</p>
                <input type="password" name="password" onChange={handleChange} value={utilisateur.password} required />

                <p>Confirmer le mot de passe:</p>
                <input type="password" name="confirmPassword" onChange={handleConfirmPasswordChange} required />

                <br/>
                <div className="form-dock">
                    <button onClick={() => {switchStep(false)}}>
                        <Icon path={mdiChevronLeft} size={1}/>
                    </button>
                    <div className={"toolbar-spacer"}>

                    </div>
                    <button type="submit" className={"btn-filled"}>Soumettre<Icon path={mdiChevronRight} size={1}/></button>
                </div>
            </form>
        </div>
    );
}

export default MotDePasse;