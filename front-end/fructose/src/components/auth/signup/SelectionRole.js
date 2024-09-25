import React from "react";
import {mdiChevronLeft, mdiChevronRight, mdiSchool} from "@mdi/js";
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
            <h4>Qui êtes vous?</h4>
            <p>Sélectionner le type d'utilisateur qui vous correspond</p>
            <br/>
            <form onSubmit={handleSubmit}>
                <div style={{"maxWidth":"500px", "margin":"auto"}}>
                    <div className={"toolbar-items"}>
                        <div style={{"width": "30%"}}>
                            <Icon path={mdiSchool} size={1} />
                            <h6>Étudiant</h6>
                        </div>
                        <div>
                            <h6>Employeur</h6>
                        </div>
                        <div>
                            <h6>Professeur</h6>
                        </div>
                    </div>
                </div>


                <label htmlFor="etudiant">Etudiant</label>
                <input id="etudiant" type="radio" name="role" value="Etudiant" onChange={handleChange} checked={utilisateur.role === "Etudiant"}/>
                <label htmlFor="employeur">Employeur</label>
                <input id="employeur" type="radio" name="role" value="Employeur" onChange={handleChange} checked={utilisateur.role === "Employeur"}/>
                <label htmlFor="professeur">Professeur</label>
                <input id="professeur" type="radio" name="role" value="Professeur" onChange={handleChange} checked={utilisateur.role === "Professeur"}/>
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