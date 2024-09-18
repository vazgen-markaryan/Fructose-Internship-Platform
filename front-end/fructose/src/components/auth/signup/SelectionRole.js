import React from "react";
import {mdiChevronLeft, mdiChevronRight} from "@mdi/js";
import Icon from "@mdi/react";

const SelectionRole = ({utilisateur, handleChange, switchStep}) => {

    const handleSubmit = (event) => {
        event.preventDefault();
        const errorMessage = validateFields();
        if (errorMessage) {
            console.log(errorMessage)
        } else {
            switchStep(true)
        }
    };

    const validateFields = () => {
        if (!/^[A-Za-z\s]+$/.test(utilisateur.role)) {
            return "Le rôle doit contenir uniquement des lettres et des espaces";
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="etudiant">Etudiant</label>
                <input id="etudiant" type="radio" name="role" value="Etudiant" onChange={handleChange} checked={utilisateur.role === "Etudiant"}/>
                <label htmlFor="employeur">Employeur</label>
                <input id="employeur" type="radio" name="role" value="Employeur" onChange={handleChange} checked={utilisateur.role === "Employeur"}/>
                <label htmlFor="gestionnaire">Gestionnaire de Stage</label>
                <input id="gestionnaire" type="radio" name="role" value="Gestionnaire de Stage" onChange={handleChange} checked={utilisateur.role === "Gestionnaire de Stage"}/>
                <br/>
                <div className="form-dock">
                    <div className={"toolbar-spacer"}>

                    </div>
                    <button type="submit" className={"btn-filled"}>Continuer<Icon path={mdiChevronRight} size={1}/></button>
                </div>


            </form>
        </div>
    );
}

export default SelectionRole;