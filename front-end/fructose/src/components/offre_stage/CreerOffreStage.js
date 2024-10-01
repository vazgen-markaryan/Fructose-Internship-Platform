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

    const [error, setError] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setOffreStage({ ...offreStage, [name]: value });
    }

    const validateFields = () => {
        const { nom, poste, description, compagnie, programmeEtude, tauxHoraire, typeEmploi, adresse, modaliteTravail, dateDebut, dateFin, nombreHeuresSemaine, nombrePostes, dateLimiteCandidature } = offreStage;

        if (!/^[A-Za-z\s]+$/.test(nom)) {
            return "Le nom doit contenir uniquement des lettres et des espaces";
        }
        if (nom.length < 3 || nom.length > 100) {
            return "Le nom doit contenir entre 3 et 100 caractères";
        }
        if (!/^[A-Za-z\s]+$/.test(poste)) {
            return "Le poste doit contenir uniquement des lettres et des espaces";
        }
        if (poste.length < 3 || poste.length > 100) {
            return "Le poste doit contenir entre 3 et 100 caractères";
        }
        if (!/^[\x20-\x7E]*$/.test(description)) {
            return "La description doit contenir uniquement des caractères ASCII";
        }
        if (description.length < 3 || description.length > 500) {
            return "La description doit contenir entre 3 et 500 caractères";
        }
        if (!/^[\x20-\x7E]*$/.test(compagnie)) {
            return "La compagnie doit contenir uniquement des caractères ASCII";
        }
        if (compagnie.length < 3 || compagnie.length > 100) {
            return "La compagnie doit contenir entre 3 et 100 caractères";
        }
        if (tauxHoraire < 0) {
            return "Le taux horaire doit être positif";
        }
        if (typeEmploi.length < 3 || typeEmploi.length > 100) {
            return "Le type d'emploi doit contenir entre 3 et 100 caractères";
        }
        if(!/^[\x20-\x7E]*$/.test(adresse)) {
            return "L'adresse doit contenir uniquement des caractères ASCII";
        }
        if (adresse.length < 3 || adresse.length > 100) {
            return "L'adresse doit contenir entre 3 et 100 caractères";
        }
        if (modaliteTravail.length < 3 || modaliteTravail.length > 100) {
            return "La modalité de travail doit contenir entre 3 et 100 caractères";
        }
        if (dateDebut < new Date()) {
            return "La date de début doit être dans le futur";
        }
        if (dateFin < dateDebut) {
            return "La date de fin doit être après la date de début";
        }
        if (nombreHeuresSemaine < 1) {
            return "Le nombre d'heures par semaine ne peut pas être inférieur à 1";
        }
        else if (nombreHeuresSemaine > 168) {
            return "Le nombre d'heures par semaine ne doit pas dépasser 168 heures";
        }
        if (nombrePostes < 0) {
            return "Le nombre de postes doit être positif";
        }
        if (dateLimiteCandidature < new Date()) {
            return "La date limite de candidature doit être au moins 7 jours après aujourd'hui";
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const error = validateFields();
        if (error) {
            setError(error);
        } else {
            setError('');
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
                setError('Erreur: ${error.message}');
                console.error('Erreur:', error);
            }
        );
    };

    return (
        <div>
            <h1>Offre de stage</h1>
            <form onSubmit={handleSubmit}>
                <label>Nom:</label>
                <input type="text" name="nom" onChange={handleChange} required/>

                <label>Poste:</label>
                <input type="text" name="poste" onChange={handleChange} required/>

                <label>Description:</label>
                <input type="text" name="description" onChange={handleChange} required/>

                <label>Compagnie:</label>
                <input type="text" name="compagnie" onChange={handleChange} required/>

                <label>Programme d'étude:</label>
                <select name="programmeEtude" onChange={handleChange} value={offreStage.programmeEtude} required>
                    <option value="Informatique">Technique de l'informatique</option>
                    <option value="Physique">Genie physique</option>
                    <option value="Infirmiers">Soin infirmiers</option>
                </select>


                <label>Taux horaire:</label>
                <input type="number" name="tauxHoraire" onChange={handleChange} required/>

                <label>Type d'emploi:</label>
                <select name="typeEmploi" onChange={handleChange} value={offreStage.typeEmploi} required>
                    <option value="Presentiel">Présentiel</option>
                    <option value="Virtuel">Virtuel</option>
                    <option value="Hybride">Hybride</option>
                </select>

                <label>Adresse:</label>
                <input type="text" name="adresse" onChange={handleChange} required/>

                <label>Modalité de travail:</label>
                <select name="modaliteTravail" onChange={handleChange} value={offreStage.modaliteTravail} required>
                    <option value="Tempsplein">Temps plein</option>
                    <option value="Tempspartiel">Temps partiel</option>
                </select>

                <label>Date limite de candidature:</label>
                <input
                    type="date"
                    name="dateLimiteCandidature"
                    onChange={handleChange}
                    required
                    min={new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]}
                />

                <label>Date de début:</label>
                <input
                    type="date"
                    name="dateDebut"
                    onChange={handleChange}
                    required
                    min={new Date(new Date(offreStage.dateLimiteCandidature).setDate(new Date(offreStage.dateLimiteCandidature).getDate() + 1)).toISOString().split('T')[0]}
                />

                <label>Date de fin:</label>
                <input
                    type="date"
                    name="dateFin"
                    onChange={handleChange}
                    required
                    min={new Date(new Date(offreStage.dateDebut).setDate(new Date(offreStage.dateDebut).getDate() + 1)).toISOString().split('T')[0]}
                />

                <label>Nombre d'heures par semaine:</label>
                <input type="number" name="nombreHeuresSemaine" onChange={handleChange} required/>

                <label>Nombre de postes:</label>
                <input type="number" name="nombrePostes" onChange={handleChange} required/>

                <br/>
                <br/>
                <button type="submit">Créer offre de stage</button>
            </form>
            {error && <p>{error}</p>}

            <nav>
                <ul>
                    <li><Link to="/">Retour à l'accueil</Link></li>
                </ul>
            </nav>
        </div>
    );
}
export default CreerOffreStage;