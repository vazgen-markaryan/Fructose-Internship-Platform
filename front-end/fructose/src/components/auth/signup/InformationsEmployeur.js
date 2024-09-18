import {Link, useNavigate} from "react-router-dom";
import React, {useState} from "react";
import Icon from "@mdi/react";
import {mdiChevronLeft, mdiChevronRight} from "@mdi/js";

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