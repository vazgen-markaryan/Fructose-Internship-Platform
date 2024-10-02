import React, {useEffect, useState} from "react";
import Icon from "@mdi/react";
import {mdiChevronLeft, mdiChevronRight} from "@mdi/js";
import {useTranslation} from "react-i18next";

const MotDePasse = ({utilisateur, handleChange, switchStep}) => {

    const {t} = useTranslation();
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

    const handleInputChange = (event) => {
        const { name } = event.target;
        handleChange(event);
        // Efface les erreurs pour le champ modifié
        setErrors({ ...errors, [name]: '' });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let validationErrors = {};

        if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(utilisateur.password)) {
            validationErrors.password = t("mot_de_passe_page.error.password_wrong");
        }
        if (utilisateur.password !== confirmPassword) {
            validationErrors.passwordConf = t("mot_de_passe_page.error.password_doesnt_match");
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            switchStep(true);
        }
    };

    useEffect(() => {
        setErrors(prevErrors => ({
            password: prevErrors.password ? t("mot_de_passe_page.error.password_wrong") : '',
            passwordConf: prevErrors.passwordConf ? t("mot_de_passe_page.error.password_doesnt_match") : ''
        }));
    }, [t]);

    return (
        <div className={"form-signup-condensed"}>
            <h4>{t("mot_de_passe_page.title")}</h4>
            <p>{t("mot_de_passe_page.description")}.</p>
            <p>{t("mot_de_passe_page.description_2")}.</p>
            <br/>
            <form onSubmit={handleSubmit}>
                <div className={"input-container"}>
                    <p>{t("mot_de_passe_page.password")}:</p>
                    <input type="password" name="password" className={`${errors.password ? "field-invalid" : ""}`} onChange={handleInputChange} value={utilisateur.password} required/>
                    {errors.password && <p className={"field-invalid-text"}>{errors.password}</p>}
                </div>
                <div className={"input-container"}>
                    <p>{t("mot_de_passe_page.confirm_password")}:</p>
                    <input type="password" name="confirmPassword" className={`${errors.passwordConf ? "field-invalid" : ""}`} onChange={(e) => { setConfirmPassword(e.target.value); setErrors({...errors, passwordConf: ''}); }} required/>
                    {errors.passwordConf && <p className={"field-invalid-text"}>{errors.passwordConf}</p>}
                </div>
                <br/>
                <div className="form-dock">
                    <button onClick={() => {switchStep(false)}}><Icon path={mdiChevronLeft} size={1}/></button>
                    <div className={"toolbar-spacer"}></div>
                    <button type="submit" className={"btn-filled"}>{t("mot_de_passe_page.submit")}<Icon path={mdiChevronRight} size={1}/></button>
                </div>
            </form>
        </div>
    );
};

export default MotDePasse;
