import React, {useState} from "react";

const CoordonneesUtilisateur = ({utilisateur, handleChange, switchStep}) => {

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

        if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(utilisateur.phoneNumber)) {
            errors.phoneNumber = "Le numéro de téléphone doit être au format (123) 456-7890";
        }
        if (utilisateur.address.length < 3 || utilisateur.address.length > 100) {
            errors.address = "L'adresse doit contenir entre 3 et 100 caractères";
        }
        if (!/^[A-Za-z0-9\s]+$/.test(utilisateur.address)) {
            errors.address = "L'adresse doit contenir uniquement des lettres et des chiffres";
        }
        return errors;
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Adresse:</label>
                <input type="text" name="address" required value={utilisateur.address} onChange={handleChange}/>
                <p style={{color: 'red'}}>{errors.address}</p>

                <label>Numéro de téléphone:</label>
                <input type="text" name="phoneNumber" required value={utilisateur.phoneNumber} onChange={handleChange}/>
                <p style={{color: 'red'}}>{errors.phoneNumber}</p>

                <br/>
                <button onClick={() => {
                    switchStep(false)
                }}>Reculer
                </button>
                <button type={"submit"}>Continuer</button>
            </form>
        </div>
    );
}

export default CoordonneesUtilisateur;