import React from "react";

const CoordonneesUtilisateur = ({utilisateur, handleChange, switchStep}) => {

    const handleSubmit = (event) => {
        event.preventDefault();

        const errorMessage = validateFields();
        if (errorMessage) {
            console.log(errorMessage)
            return;
        } else {
            switchStep(true)
        }
    };

    const validateFields = () => {
        if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(utilisateur.phoneNumber)) {
            return "Le numéro de téléphone doit être au format (123) 456-7890";
        }
        if (utilisateur.address.length < 3 || utilisateur.address.length > 100) {
            return "L'adresse doit contenir entre 3 et 100 caractères";
        }
        if (!/^[A-Za-z0-9\s]+$/.test(utilisateur.address)) {
            return "L'adresse doit contenir uniquement des lettres et des chiffres";
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Adresse:</label>
                <input type="text" name="address" required value={utilisateur.address} onChange={handleChange} />

                <label>Numéro de téléphone:</label>
                <input type="text" name="phoneNumber" required value={utilisateur.phoneNumber} onChange={handleChange} />
                <br/>
                <button onClick={() => {switchStep(false)}}>Reculer</button>
                <button type={"submit"}>Continuer</button>
            </form>
        </div>
    );
}

export default CoordonneesUtilisateur;