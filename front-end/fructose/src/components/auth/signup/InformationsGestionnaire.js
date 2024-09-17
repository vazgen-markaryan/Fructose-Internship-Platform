import React, {useState} from "react";

const InformationsGestionnaire = ({utilisateur, handleChange, switchStep}) => {

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
        if (!/^\d{7}$/.test(utilisateur.matricule)) {
            return "Le Matricule doit contenir 7 chiffres";
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Matricule:</label>
                <input type="text" name="matricule" required value={utilisateur.matricule} onChange={handleChange} />

                <br/>

                <button onClick={() => {switchStep(false)}}>Reculer</button>
                <button type={"submit"}>Continuer</button>
            </form>
        </div>
    );
}

export default InformationsGestionnaire;