import React, {useEffect, useState} from "react";
import {mdiChevronLeft, mdiChevronRight} from "@mdi/js";
import Icon from "@mdi/react";
import {useTranslation} from "react-i18next";

const InformationsBase = ({utilisateur, handleChange, switchStep}) => {
    const {t} = useTranslation();

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

        if (utilisateur.firstName.length < 2) {
            errors.firstName = t("information_base_page.error.first_name_short");
        } else if (!/^[A-Za-z\s]+$/.test(utilisateur.firstName)) {
            errors.firstName = t("information_base_page.error.first_name_letters_only");
        }

        if (utilisateur.lastName.length < 2) {
            errors.lastName = t("information_base_page.error.last_name_short");
        } else if (!/^[A-Za-z\s]+$/.test(utilisateur.lastName)) {
            errors.lastName = t("information_base_page.error.last_name_letters_only");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(utilisateur.email)) {
            errors.email = t("information_base_page.error.email");
        }

        return errors;
    };

    const handleInputChange = (event) => {
        const {name} = event.target;

        // Appelle la fonction handleChange passée en props pour mettre à jour le parent
        handleChange(event);

        // Supprime le message d'erreur pour ce champ si une modification est détectée
        setErrors((prevErrors) => ({...prevErrors, [name]: ""}));
    };

    // useEffect pour re-traduire les erreurs si la langue change
    useEffect(() => {
        setErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };

            // Re-traduit chaque message d'erreur existant selon la nouvelle langue
            if (prevErrors.firstName) {
                updatedErrors.firstName = utilisateur.firstName.length < 2
                    ? t("information_base_page.error.first_name_short")
                    : t("information_base_page.error.first_name_letters_only");
            }

            if (prevErrors.lastName) {
                updatedErrors.lastName = utilisateur.lastName.length < 2
                    ? t("information_base_page.error.last_name_short")
                    : t("information_base_page.error.last_name_letters_only");
            }

            if (prevErrors.email) {
                updatedErrors.email = t("information_base_page.error.email");
            }

            return updatedErrors;
        });
    }, [utilisateur.firstName, utilisateur.lastName, utilisateur.email, t]);

    return (
        <div className={"form-signup-condensed"}>
            <h4>{t("information_base_page.information")}</h4>
            <p>{t("information_base_page.description")}</p>
            <br/>
            <form onSubmit={handleSubmit}>
                <div className={"input-container"}>
                    <p>{t("information_base_page.first_name")}:</p>
                    <input className={`${errors.firstName ? "field-invalid" : ""}`} type="text" name="firstName" required value={utilisateur.firstName} onChange={handleInputChange}/>
                    <p className={"field-invalid-text"}>{errors.firstName}</p>
                </div>
                <div className={"input-container"}>
                    <p>{t("information_base_page.last_name")}:</p>
                    <input className={`${errors.lastName ? "field-invalid" : ""}`} type="text" name="lastName" required value={utilisateur.lastName} onChange={handleInputChange}/>
                    <p className={"field-invalid-text"}>{errors.lastName}</p>
                </div>
                <div className={"input-container"}>
                    <p>{t("information_base_page.email")}:</p>
                    <input className={`${errors.email ? "field-invalid" : ""}`} type="text" name="email" required value={utilisateur.email} onChange={handleInputChange}/>
                    <p className={"field-invalid-text"}>{errors.email}</p>
                </div>
                <br/>

                <div className="form-dock">
                    <button onClick={() => {switchStep(false)}}><Icon path={mdiChevronLeft} size={1}/></button>
                    <div className={"toolbar-spacer"}>

                    </div>
                    <button type="submit" className={"btn-filled"}>{t("information_base_page.continue")}<Icon path={mdiChevronRight} size={1}/></button>
                </div>
            </form>
        </div>
    );
}

export default InformationsBase;
