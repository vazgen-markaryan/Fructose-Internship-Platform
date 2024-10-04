import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

const CreerOffreStage = () => {
    const [offreStage, setOffreStage] = useState({
        nom: '',
        poste: '',
        description: '',
        compagnie: '',
        programmeEtude: '',
        tauxHoraire: 0.0,
        typeEmploi: '',
        adresse: '',
        modaliteTravail: '',
        dateDebut: new Date(),
        dateFin: new Date(),
        nombreHeuresSemaine: 0,
        nombrePostes: 0,
        dateLimiteCandidature: new Date()
    });

    const navigate = useNavigate();

    const [errors, setErrors] = useState({});

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === 'dateDebut' || name === 'dateFin' || name === 'dateLimiteCandidature') {
            setOffreStage({ ...offreStage, [name]: new Date(value) });
        } else {
            setOffreStage({ ...offreStage, [name]: value });
        }
    }

    const validateFields = () => {
        const { nom, poste, description, compagnie, programmeEtude, tauxHoraire, typeEmploi, adresse, modaliteTravail, dateDebut, dateFin, nombreHeuresSemaine, nombrePostes, dateLimiteCandidature } = offreStage;

        const errors = {};

        if (!/^[A-Za-z\s]+$/.test(nom)) {
            errors.nom = "Le nom doit contenir uniquement des lettres et des espaces";
        }else if (nom.length < 3 || nom.length > 100) {
            errors.nom = "Le nom doit contenir entre 3 et 100 caractères";
        }
        if (!/^[A-Za-z\s]+$/.test(poste)) {
            errors.poste = "Le poste doit contenir uniquement des lettres et des espaces";
        }
        else if (poste.length < 3 || poste.length > 100) {
            errors.poste = "Le poste doit contenir entre 3 et 100 caractères";
        }
        if (!/^[\x20-\x7E]*$/.test(description)) {
            errors.description = "La description doit contenir uniquement des caractères ASCII";
        }
        else if (description.length < 3 || description.length > 500) {
            errors.description = "La description doit contenir entre 3 et 500 caractères";
        }
        if (!/^[\x20-\x7E]*$/.test(compagnie)) {
            errors.compagnie =  "La compagnie doit contenir uniquement des caractères ASCII";
        }
        else if (compagnie.length < 3 || compagnie.length > 100) {
            errors.compagnie = "La compagnie doit contenir entre 3 et 100 caractères";
        }
        if (tauxHoraire < 0) {
            errors.tauxHoraire =  "Le taux horaire doit être positif";
        }
        if (typeEmploi.length < 3 || typeEmploi.length > 100) {
            errors.typeEmploi = "Le type d'emploi doit contenir entre 3 et 100 caractères";
        }
        if(!/^[\x20-\x7E]*$/.test(adresse)) {
            errors.adresse =  "L'adresse doit contenir uniquement des caractères ASCII";
        }
        else if (adresse.length < 3 || adresse.length > 100) {
            errors.adresse = "L'adresse doit contenir entre 3 et 100 caractères";
        }
        if (modaliteTravail.length < 3 || modaliteTravail.length > 100) {
            errors.modaliteTravail = "La modalité de travail doit contenir entre 3 et 100 caractères";
        }
        if (dateDebut < new Date()) {
            errors.dateDebut = "La date de début doit être dans le futur";
        }
        if (dateFin < dateDebut) {
            errors.dateFin = "La date de fin doit être après la date de début";
        }
        if (nombreHeuresSemaine < 1) {
            errors.nombreHeuresSemaine = "Le nombre d'heures par semaine ne peut pas être inférieur à 1";
        }
        else if (nombreHeuresSemaine > 168) {
            errors.nombreHeuresSemaine = "Le nombre d'heures par semaine ne doit pas dépasser 168 heures";
        }
        if (nombrePostes < 0) {
            errors.nombrePostes = "Le nombre de postes doit être positif";
        }
        if (dateLimiteCandidature < new Date()) {
            errors.dateLimiteCandidature = "La date limite de candidature doit être au moins 7 jours après aujourd'hui";
        }
        if (programmeEtude === "select" || programmeEtude === "") {
            errors.programmeEtude = "Veuillez sélectionner un programme d'étude";
        }
        if (typeEmploi === "select" || typeEmploi === "") {
            errors.typeEmploi = "Veuillez sélectionner un type d'emploi";
        }
        if (modaliteTravail === "select" || modaliteTravail === "") {
            errors.modaliteTravail = "Veuillez sélectionner une modalité de travail";
        }


        for (const key in offreStage) {
            console.log(key, offreStage[key]);
        }

        for (const key in errors) {
            console.log(key, errors[key]);
        }

        return errors;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const errorMessage = validateFields();
        if (Object.keys(errorMessage).length > 0) {
            setErrors(errorMessage);
        } else {
            console.log(offreStage);
        }

        fetch('/creer-offre-stage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(offreStage)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text();
                }
                return response;
            }).then(() => {
                // Rediriger l'utilisateur vers la page d'accueil
                navigate('/');
            }).catch(error => {
                setErrors('Erreur: ${error.message}');
                console.error('Erreur:', error);
            }
        );
    };

    return (
        <div>
            <h1>Offre de stage</h1>
            <form onSubmit={handleSubmit}>
                <label>Nom:</label>
                <input className={`${errors.nom ? "field-invalid" : ""}`} value={offreStage.nom} type="text" name="nom" onChange={handleInputChange} required/>

                <label>Poste:</label>
                <input className={`${errors.poste ? "field-invalid" : ""}`} value={offreStage.poste} type="text" name="poste" onChange={handleInputChange} required/>

                <label>Description:</label>
                <input className={`${errors.description ? "field-invalid" : ""}`} value={offreStage.description} type="text" name="description" onChange={handleInputChange} required/>

                <label>Compagnie:</label>
                <input className={`${errors.compagnie ? "field-invalid" : ""}`} value={offreStage.compagnie} type="text" name="compagnie" onChange={handleInputChange} required/>

                <label>Programme d'étude:</label>
                <select name="programmeEtude" onChange={handleInputChange} value={offreStage.programmeEtude} required>
                    <option value={"select"}>Sélectionner un programme</option>
                    <option value="Informatique">Technique de l'informatique</option>
                    <option value="Physique">Genie physique</option>
                    <option value="Infirmiers">Soin infirmiers</option>
                </select>


                <label>Taux horaire:</label>
                <input className={`${errors.tauxHoraire ? "field-invalid" : ""}`} value={offreStage.tauxHoraire} type="number" name="tauxHoraire" onChange={handleInputChange} required/>

                <label>Type d'emploi:</label>
                <select name="typeEmploi" onChange={handleInputChange} value={offreStage.typeEmploi} required>
                    <option value={"select"}>Sélectionner un type d'emploie</option>
                    <option value="Presentiel">Présentiel</option>
                    <option value="Virtuel">Virtuel</option>
                    <option value="Hybride">Hybride</option>
                </select>

                <label>Adresse:</label>
                <input className={`${errors.adresse ? "field-invalid" : ""}`} value={offreStage.adresse} type="text" name="adresse" onChange={handleInputChange} required/>

                <label>Modalité de travail:</label>
                <select name="modaliteTravail" onChange={handleInputChange} value={offreStage.modaliteTravail} required>
                    <option value="select">Sélectionner une modalité de travail</option>
                    <option value="Tempsplein">Temps plein</option>
                    <option value="Tempspartiel">Temps partiel</option>
                </select>

                <label>Date limite de candidature:</label>
                <input
                    className={`${errors.dateLimiteCandidature ? "field-invalid" : ""}`}
                    type="date"
                    name="dateLimiteCandidature"
                    onChange={handleInputChange}
                    value={offreStage.dateLimiteCandidature.toISOString().split('T')[0]}
                    required
                    min={new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]}
                />

                <label>Date de début:</label>
                <input
                    className={`${errors.dateDebut ? "field-invalid" : ""}`}
                    type="date"
                    name="dateDebut"
                    onChange={handleInputChange}
                    value={offreStage.dateDebut.toISOString().split('T')[0]}
                    required
                    min={new Date(new Date(offreStage.dateLimiteCandidature).setDate(new Date(offreStage.dateLimiteCandidature).getDate() + 1)).toISOString().split('T')[0]}
                />

                <label>Date de fin:</label>
                <input
                    className={`${errors.dateFin ? "field-invalid" : ""}`}
                    type="date"
                    name="dateFin"
                    onChange={handleInputChange}
                    value={offreStage.dateFin.toISOString().split('T')[0]}
                    required
                    min={new Date(new Date(offreStage.dateDebut).setDate(new Date(offreStage.dateDebut).getDate() + 1)).toISOString().split('T')[0]}
                />

                <label>Nombre d'heures par semaine:</label>
                <input className={`${errors.nombreHeuresSemaine ? "field-invalid" : ""}`} value={offreStage.nombreHeuresSemaine} type="number" name="nombreHeuresSemaine" onChange={handleInputChange} required/>

                <label>Nombre de postes:</label>
                <input className={`${errors.nombrePostes ? "field-invalid" : ""}`} value={offreStage.nombrePostes} type="number" name="nombrePostes" onChange={handleInputChange} required/>

                <br/>
                <br/>
                <button type="submit">Créer offre de stage</button>
            </form>

            <nav>
                <ul>
                    <li><Link to="/">Retour à l'accueil</Link></li>
                </ul>
            </nav>
        </div>
    );
}
export default CreerOffreStage;