const InformationsBase = ({utilisateur, handleChange, switchStep}) => {

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
        if (!/^[A-Za-z\s]+$/.test(utilisateur.fullName)) {
            return "Le nom complet doit contenir uniquement des lettres et des espaces";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(utilisateur.email)) {
            return "L'adresse courriel doit être valide";
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Nom:</label>
                <input type="text" name="lastName" required value={utilisateur.lastName} onChange={handleChange} />

                <label>Prénom:</label>
                <input type="text" name="firstName" required value={utilisateur.firstName} onChange={handleChange} />

                <label>Email:</label>
                <input type="email" name="email" required value={utilisateur.email} onChange={handleChange} />

                <br/>

                <button onClick={() => {switchStep(false)}}>Reculer</button>
                <button type={"submit"}>Continuer</button>
            </form>
        </div>
    );
}

export default InformationsBase;