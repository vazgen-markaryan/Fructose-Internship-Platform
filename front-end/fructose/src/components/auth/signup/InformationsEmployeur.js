import {Link, useNavigate} from "react-router-dom";
import React, {useState} from "react";
import Icon from "@mdi/react";
import {mdiChevronLeft, mdiChevronRight} from "@mdi/js";

const InformationsEmployeur = ({utilisateur, handleChange, switchStep}) => {

    const [errors, setErrors] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();
        const errorMessage = validateFields();
        if (Object.keys(errorMessage).length > 0) {
            setErrors(errorMessage);
        } else {
            switchStep(true)
        }
    };

    const validateFields = () => {
        let errors = {};
        if (!/^[A-Za-z0-9&'\s-]+$/.test(utilisateur.companyName)) {
            errors.companyName = "Le nom de compagnie doit contenir uniquement des lettres, chiffres, espaces, et les caractères spéciaux (&, ', -).";
        }
        return errors
    };

    return (
        <div className={"form-signup-condensed"}>
            <h4>Informations sur l'employeur</h4>
            <p>Entrez les informations requises sur la compagnie qui offre les stages</p>
            <br/>
            <form onSubmit={handleSubmit}>
                <div className={"input-container"}>
                    <p>Nom de la compagnie:</p>
                    <input type="text" name="companyName" className={`${errors.companyName ? "field-invalid" : ""}`} required value={utilisateur.companyName} onChange={handleChange} />
                    <p className={"field-invalid-text"}>{errors.companyName}</p>
                </div>

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

export default InformationsEmployeur;