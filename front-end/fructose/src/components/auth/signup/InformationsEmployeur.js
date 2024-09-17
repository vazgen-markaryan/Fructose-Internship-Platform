import {Link, useNavigate} from "react-router-dom";
import React, {useState} from "react";

const InformationsEmployeur = ({utilisateur, handleChange, switchStep}) => {

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
        if (!/^[A-Za-z0-9&'\s-]+$/.test(utilisateur.companyName)) {
            return "Le nom de compagnie doit contenir uniquement des lettres, chiffres, espaces, et les caractères spéciaux (&, ', -).";
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Nom de la compagnie:</label>
                <input type="text" name="companyName" required value={utilisateur.companyName} onChange={handleChange} />
                <br/>

                <button onClick={() => {switchStep(false)}}>Reculer</button>
                <button type={"submit"}>Continuer</button>
            </form>
        </div>
    );
}

export default InformationsEmployeur;