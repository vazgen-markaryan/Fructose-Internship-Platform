import React, {useState} from "react";
import {mdiChevronLeft, mdiChevronRight} from "@mdi/js";
import Icon from "@mdi/react";

const CoordonneesUtilisateur = ({utilisateur, handleChange, switchStep}) => {

    const [errors, setErrors] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();
        const errorMessage = validateFields();
        if (Object.keys(errorMessage).length > 0) {
            setErrors(errorMessage);
        } else {
            switchStep(true);
        }
    };

    const validateFields = () => {
        let errors = {};

        if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(utilisateur.phoneNumber)) {
            errors.phoneNumber = "Le numéro de téléphone doit être au format (123) 456-7890";
        }
        if (utilisateur.address.length < 3 || utilisateur.address.length > 100) {
            errors.address = "L'adresse doit contenir entre 3 et 100 caractères";
        }
        if (!/^[A-Za-z0-9\s]+$/.test(utilisateur.address)) {
            errors.address = "L'adresse doit contenir uniquement des lettres et des chiffres";
        }
        return errors;
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <p>Adresse:</p>
                <input type="text" name="address" className={`${errors.address ? "field-invalid" : ""}`} required value={utilisateur.address} onChange={handleChange}/>
                <p className={"field-invalid-text"}>{errors.address}</p>

                <p>Numéro de téléphone:</p>
                <input type="text" name="phoneNumber" className={`${errors.phoneNumber ? "field-invalid" : ""}`} required value={utilisateur.phoneNumber} onChange={handleChange}/>
                <p className={"field-invalid-text"}>{errors.phoneNumber}</p>

                <br/>

                <div className="form-dock">
                    <button onClick={() => {switchStep(false)}}>
                        <Icon path={mdiChevronLeft} size={1}/>
                    </button>
                    <div className={"toolbar-spacer"}>

                    </div>
                    <button type="submit" className={"btn-filled"}>Continuer<Icon path={mdiChevronRight} size={1}/></button>
                </div>
            </form>
        </div>
    );
}

export default CoordonneesUtilisateur;