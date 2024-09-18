import React, {useState} from "react";
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
                <label>Nom:</label>
                <input type="text" name="lastName" required value={utilisateur.lastName} onChange={handleChange}/>
                <p style={{color: 'red'}}>{errors.lastName}</p>

                <label>Prénom:</label>
                <input type="text" name="firstName" required value={utilisateur.firstName} onChange={handleChange}/>
                <p style={{color: 'red'}}>{errors.firstName}</p>

                <label>Email:</label>
                <input type="text" name="email" required value={utilisateur.email} onChange={handleChange}/>
                <p style={{color: 'red'}}>{errors.email}</p>

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

export default InformationsBase;