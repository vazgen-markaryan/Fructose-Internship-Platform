import React, {useEffect, useState} from "react";
import Icon from "@mdi/react";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import { useTranslation } from "react-i18next";

const InformationsEmployeur = ({ utilisateur, handleChange, switchStep }) => {

    const { t } = useTranslation();

    const [errors, setErrors] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();
        const errorMessage = validateFields(utilisateur);
        if (Object.keys(errorMessage).length > 0) {
            setErrors(errorMessage);
        } else {
            switchStep(true);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        handleChange(event);

        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

        const newErrors = validateFields({ ...utilisateur, [name]: value });
        setErrors(newErrors);
    };

    const validateFields = (user = {}) => {
        let validationErrors = {};

        if (user.companyName?.length < 3 || user.companyName?.length > 100) {
            validationErrors.companyNameLength = t("information_employeur_page.error.company_name_lenght");
        }

        else if (!/^[A-Za-zÀ-ÿ&'\s-]+$/.test(user.companyName)) {
            validationErrors.companyName = t("information_employeur_page.error.company_name_invalid");
        }

        return validationErrors;
    };

    useEffect(() => {
        setErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };

            if (utilisateur?.companyName?.length < 3 || utilisateur?.companyName?.length > 100) {
                updatedErrors.companyNameLength = t("information_employeur_page.error.company_name_lenght");
            }

            else if (!/^[A-Za-zÀ-ÿ&'\s-]+$/.test(utilisateur?.companyName)) {
                updatedErrors.companyName = t("information_employeur_page.error.company_name_invalid");
            }

            else {
                delete updatedErrors.companyNameLength;
                delete updatedErrors.companyName;
            }

            return updatedErrors;
        });
    }, [utilisateur?.companyName, t]);

    return (
        <div className={"form-signup-condensed"}>
            <h4>{t("information_employeur_page.title")}</h4>
            <p>{t("information_employeur_page.description")}</p>
            <br/>
            <form onSubmit={handleSubmit}>
                <div className={"input-container"}>
                    <p>{t("information_employeur_page.company_name")}:</p>
                    <input type="text" name="companyName" className={`${errors.companyName || errors.companyNameLength ? "field-invalid" : ""}`} required value={utilisateur.companyName || ""} onChange={handleInputChange}/>
                    <p className={"field-invalid-text"}>{errors.companyName}</p>
                    <p className={"field-invalid-text"}>{errors.companyNameLength}</p>
                </div>

                <div className="form-dock">
                    <button onClick={() => { switchStep(false) }}><Icon path={mdiChevronLeft} size={1} /></button>
                    <div className={"toolbar-spacer"}></div>
                    <button type="submit" className={"btn-filled"}>{t("information_employeur_page.continue")}<Icon path={mdiChevronRight} size={1} /></button>
                </div>
            </form>
        </div>
    );
};

export default InformationsEmployeur;