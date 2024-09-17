import {Link, useNavigate} from "react-router-dom";
import React, {useState} from "react";

const InformationsEtudiant = ({utilisateur, handleChange, switchStep}) => {

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

                <label>Programme:</label>
                <select name="program" onChange={handleChange} value={utilisateur.program} required>
                    <option value="420.B0">Techniques de l'informatique</option>
                    <option value="123.A1">Techniques de l'architecture</option>
                </select>

                <br/>

                <button onClick={() => {switchStep(false)}}>Reculer</button>
                <button type={"submit"}>Continuer</button>
            </form>
        </div>
    );
}

export default InformationsEtudiant;