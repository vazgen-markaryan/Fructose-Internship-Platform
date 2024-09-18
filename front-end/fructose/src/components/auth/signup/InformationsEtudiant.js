import {Link, useNavigate} from "react-router-dom";
import React, {useState} from "react";
import Icon from "@mdi/react";
import {mdiChevronLeft, mdiChevronRight} from "@mdi/js";

const InformationsEtudiant = ({utilisateur, handleChange, switchStep}) => {

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
        if (!/^\d{7}$/.test(utilisateur.matricule)) {
            errors.matricule = "Le Matricule doit contenir 7 chiffres";
        }
        return errors
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <p>Matricule:</p>
                <input type="text" name="matricule" className={`${errors.matricule ? "field-invalid" : ""}`} required value={utilisateur.matricule} onChange={handleChange} />
                <p className={"field-invalid-text"}>{errors.matricule}</p>

                <p>Programme:</p>
                <select name="program" className={`${errors.program ? "field-invalid" : ""}`} onChange={handleChange} value={utilisateur.program} required>
                    <option value="420.B0">Techniques de l'informatique</option>
                    <option value="123.A1">Techniques de l'architecture</option>
                </select>
                <p className={"field-invalid-text"}>{errors.program}</p>

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

export default InformationsEtudiant;