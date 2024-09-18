import React, {useState} from "react";
import Icon from "@mdi/react";
import {mdiChevronLeft, mdiChevronRight} from "@mdi/js";

const MotDePasse = ({utilisateur, handleChange, switchStep}) => {

    const [confirmPassword, setConfirmPassword] = useState('');

    const [errors, setErrors] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();
        const errorMessage = validateFields();
        if (Object.keys(errorMessage).length > 0) {
            setErrors(errorMessage)
        } else {
            switchStep(true)
        }
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const validateFields = () => {
        let errors = {};
        if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(utilisateur.password)) {
            errors.password = "Le mot de passe doit contenir au moins une lettre majuscule, un chiffre et un caractère spécial";
        }
        if (utilisateur.password !== confirmPassword) {
            errors.passwordConf = "Les mots de passe ne correspondent pas";
        }
        return errors
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <p>Mot de passe:</p>
                <input type="password" name="password" className={`${errors.password ? "field-invalid" : ""}`} onChange={handleChange} value={utilisateur.password} required />
                <p className={"field-invalid-text"}>{errors.password}</p>

                <p>Confirmer le mot de passe:</p>
                <input type="password" name="confirmPassword" className={`${errors.passwordConf ? "field-invalid" : ""}`} onChange={handleConfirmPasswordChange} required />
                <p className={"field-invalid-text"}>{errors.passwordConf}</p>

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