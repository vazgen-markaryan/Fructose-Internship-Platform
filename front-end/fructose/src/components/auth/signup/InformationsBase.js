import React, {useState} from "react";
import {mdiChevronLeft, mdiChevronRight} from "@mdi/js";
import Icon from "@mdi/react";
const InformationsBase = ({utilisateur, handleChange, switchStep}) => {

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
        if (!/^[A-Za-z\s]+$/.test(utilisateur.firstName)) {
            errors.firstName = "Le prénom doit contenir uniquement des lettres et des espaces";
        }
        if (!/^[A-Za-z\s]+$/.test(utilisateur.lastName)) {
            errors.lastName = "Le nom doit contenir uniquement des lettres et des espaces";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(utilisateur.email)) {
            errors.email = "L'adresse courriel doit être valide";
        }
        return errors;
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <p>Nom:</p>
                <input className={`${errors.firstName ? "field-invalid" : ""}`} type="text" name="lastName" required value={utilisateur.lastName} onChange={handleChange}/>
                <p className={"field-invalid-text"}>{errors.firstName}</p>

                <p>Prénom:</p>
                <input className={`${errors.lastName ? "field-invalid" : ""}`} type="text" name="firstName" required value={utilisateur.firstName} onChange={handleChange}/>
                <p className={"field-invalid-text"}>{errors.lastName}</p>

                <p>Email:</p>
                <input className={`${errors.email ? "field-invalid" : ""}`} type="text" name="email" required value={utilisateur.email} onChange={handleChange}/>
                <p className={"field-invalid-text"}>{errors.email}</p>

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

export default InformationsBase;