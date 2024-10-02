import React from "react";
import { mdiTranslate } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslation } from "react-i18next";

const TemporaireFooterLanguage = () => {
    const { i18n } = useTranslation();

    const handleChangeLanguage = (language) => {
        i18n.changeLanguage(language);
        localStorage.setItem('language', language);
    }

    return (
        <div style={styles.footer}>
            <button onClick={() => handleChangeLanguage('fr')} style={styles.button}>
                <Icon path={mdiTranslate} size={1} /> FR
            </button>
            <button onClick={() => handleChangeLanguage('en')} style={styles.button}>
                <Icon path={mdiTranslate} size={1} /> EN
            </button>
        </div>
    );
}

const styles = {
    footer: {
        position: 'fixed',
        bottom: 0,
        width: '100%',
        backgroundColor: `rgba(0, 0, 0, 0)`,
        color: 'white',
        textAlign: 'center',
        padding: '10px 0',
    },
    button: {
        backgroundColor: 'transparent',
        border: 'none',
        color: 'red',
        fontSize: '25px',
        cursor: 'pointer',
        margin: '0 10px',
    }
};

export default TemporaireFooterLanguage;