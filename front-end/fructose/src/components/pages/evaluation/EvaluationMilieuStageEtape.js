import React, {useState, useContext} from "react";
import {useTranslation} from "react-i18next";
import {Link, useLocation} from "react-router-dom";
import {AuthContext} from "../../providers/AuthProvider";
import PdfPreview from "../../../utilities/pdf/PdfPreview";

const EvaluationMilieuStageEtapes = () => {
    const {t} = useTranslation();
    const [currentStep, setCurrentStep] = useState(1);
    const {currentToken} = useContext(AuthContext);
    const location = useLocation();
    const initialCandidature = location.state?.candidature || {};
    const [errors, setErrors] = useState({});
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
    const [isPdfPreviewVisible, setIsPdfPreviewVisible] = useState(false);

    const [formData, setFormData] = useState({
        candidature: initialCandidature.candidature || "",
        sections: {
            section2: {commentaire: "", champs: {}}, section3: {commentaire: "", champs: {}},
        },
        stageType: "",
        capaciteEtudiant: "",
        nbHeuresParSemPremierMois: "",
        nbHeuresParSemDeuxiemeMois: "",
        nbHeuresParSemTroisiemeMois: "",
        tauxHoraire: "",
        milieuStageAPrivilegierPour: "",
        memeStagiaireProchainStage: false,
        quartTravailVariable: false,
        signatureSuperviseur: "",
        dateSignatureSuperviseur: "",
        quartTravail1Debut: "",
        quartTravail1Fin: "",
        quartTravail2Debut: "",
        quartTravail2Fin: "",
        quartTravail3Debut: "",
        quartTravail3Fin: "",
    });

    const ReponseEvaluation = {
        TOTAL_AGREE: t("evaluation_employeur.step.total_agree"),
        MOSTLY_AGREE: t("evaluation_employeur.step.mostly_agree"),
        MOSTLY_DISAGREE: t("evaluation_employeur.step.mostly_disagree"),
        TOTAL_DISAGREE: t("evaluation_employeur.step.total_disagree"),
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        const keys = name.split(".");

        setFormData((prev) => {
            const updatedFormData = {...prev};

            if (keys.length === 2) {
                const [section, key] = keys;
                updatedFormData.sections[section][key] = value;
            } else if (keys.length === 3) {
                const [section, type, key] = keys;
                if (type === "champs") {
                    if (!updatedFormData.sections[section].champs) {
                        updatedFormData.sections[section].champs = {};
                    }
                    updatedFormData.sections[section].champs[key] = value;
                }
            } else {
                updatedFormData[name] = value;
            }
            return updatedFormData;
        });
    };

    const handleNextStep = () => {
        const newErrors = {};

        const stepOptions = [{
            title: t("evaluation_milieu_stage.step.general.title"),
            fields: [t("evaluation_milieu_stage.step.general.stage_type"), t("evaluation_milieu_stage.step.general.hours_per_week_first_month"), t("evaluation_milieu_stage.step.general.hours_per_week_second_month"), t("evaluation_milieu_stage.step.general.hours_per_week_third_month"), t("evaluation_milieu_stage.step.general.hourly_rate"),],
        }, {
            title: t("evaluation_milieu_stage.step.section2.title"),
            items: [t("evaluation_milieu_stage.step.section2.fields.field1"), t("evaluation_milieu_stage.step.section2.fields.field2"), t("evaluation_milieu_stage.step.section2.fields.field3"), t("evaluation_milieu_stage.step.section2.fields.field4"), t("evaluation_milieu_stage.step.section2.fields.field5"),],
        }, {
            title: t("evaluation_milieu_stage.step.section3.title"),
            items: [t("evaluation_milieu_stage.step.section3.fields.field1"), t("evaluation_milieu_stage.step.section3.fields.field2"), t("evaluation_milieu_stage.step.section3.fields.field3"), t("evaluation_milieu_stage.step.section3.fields.field4"), t("evaluation_milieu_stage.step.section3.fields.field5"),],
        },];

        if (currentStep === 1) {
            if (!formData.stageType.trim()) {
                newErrors.stageType = t("evaluation_milieu_stage.required");
            }
            if (!formData.nbHeuresParSemPremierMois.trim()) {
                newErrors.nbHeuresParSemPremierMois = t("evaluation_milieu_stage.required");
            }
            if (!formData.nbHeuresParSemDeuxiemeMois.trim()) {
                newErrors.nbHeuresParSemDeuxiemeMois = t("evaluation_milieu_stage.required");
            }
            if (!formData.nbHeuresParSemTroisiemeMois.trim()) {
                newErrors.nbHeuresParSemTroisiemeMois = t("evaluation_milieu_stage.required");
            }
            if (!formData.tauxHoraire.trim()) {
                newErrors.tauxHoraire = t("evaluation_milieu_stage.required");
            }
        } else if (currentStep > 1 && currentStep < 4) {
            const section = `section${currentStep}`;
            const items = stepOptions[currentStep - 1].items;

            items.forEach((item) => {
                if (!formData.sections[section]?.champs?.[item]?.trim()) {
                    newErrors[`${section}.champs.${item}`] = t("evaluation_milieu_stage.required");
                }
            });
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setErrors({});
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePreviousStep = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const checkErrors = () => {
        const newErrors = {};

        // Validate the 4th section
        if (!formData.capaciteEtudiant.trim()) {
            newErrors.capaciteEtudiant = t("evaluation_milieu_stage.required");
        }
        if (!formData.milieuStageAPrivilegierPour.trim()) {
            newErrors.milieuStageAPrivilegierPour = t("evaluation_milieu_stage.required");
        }
        if (!formData.signatureSuperviseur.trim()) {
            newErrors.signatureSuperviseur = t("evaluation_milieu_stage.required");
        }
        if (!formData.quartTravail1Debut.trim()) {
            newErrors.quartTravail1Debut = t("evaluation_milieu_stage.required");
        }
        if (!formData.quartTravail1Fin.trim()) {
            newErrors.quartTravail1Fin = t("evaluation_milieu_stage.required");
        }
        return newErrors;
    }

    const handleSubmit = async () => {
        const newErrors = checkErrors();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        const preparedData = {
            candidatureDTO: {
                ...formData.candidature,
            },
            sections: Object.keys(formData.sections)
                .map((sectionKey) => ({
                    name: sectionKey,
                    commentaire: formData.sections[sectionKey].commentaire,
                    criteres: Object.keys(formData.sections[sectionKey].champs).map((question) => ({
                        question: question, reponse: formData.sections[sectionKey].champs[question],
                    })),
                })),
            stageType: formData.stageType,
            capaciteEtudiant: formData.capaciteEtudiant,
            nbHeuresParSemPremierMois: formData.nbHeuresParSemPremierMois,
            nbHeuresParSemDeuxiemeMois: formData.nbHeuresParSemDeuxiemeMois,
            nbHeuresParSemTroisiemeMois: formData.nbHeuresParSemTroisiemeMois,
            tauxHoraire: formData.tauxHoraire,
            milieuStageAPrivilegierPour: formData.milieuStageAPrivilegierPour,
            memeStagiaireProchainStage: formData.memeStagiaireProchainStage,
            quartTravailVariable: formData.quartTravailVariable,
            signatureSuperviseur: formData.signatureSuperviseur,
            dateSignatureSuperviseur: new Date().toISOString().split("T")[0],
            quartTravail1Debut: formData.quartTravail1Debut,
            quartTravail1Fin: formData.quartTravail1Fin,
            quartTravail2Debut: formData.quartTravail2Debut,
            quartTravail2Fin: formData.quartTravail2Fin,
            quartTravail3Debut: formData.quartTravail3Debut,
            quartTravail3Fin: formData.quartTravail3Fin,
        };
        try {
            const response = await fetch("/evaluations/milieu-stage/creer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": currentToken,
                },
                body: JSON.stringify(preparedData),
            });

            if (response.ok) {
                const pdfBytes = await response.arrayBuffer();
                const pdfBlob = new Blob([pdfBytes], {type: "application/pdf"});
                const pdfUrl = URL.createObjectURL(pdfBlob);

                setPdfPreviewUrl(pdfUrl);
                setIsPdfPreviewVisible(true);
            } else {
                console.error("Erreur lors de la soumission de l'évaluation");
            }
        } catch (error) {
            console.error("Erreur lors de la soumission de l'évaluation :", error);
        }
    };

    const renderStep = () => {
        const stepOptions = [{
            title: t("evaluation_milieu_stage.step.general.title"), fields: [{
                label: t("evaluation_milieu_stage.step.general.stage_type"),
                type: "select",
                name: "stageType",
                options: [{value: "", label: t("evaluation_milieu_stage.step.select")}, {
                    value: "PREMIER_STAGE", label: t("evaluation_milieu_stage.step.general.stage1")
                }, {value: "DEUXIEME_STAGE", label: t("evaluation_milieu_stage.step.general.stage2")}]
            }, {
                label: t("evaluation_milieu_stage.step.general.hours_per_week_first_month"),
                type: "number",
                name: "nbHeuresParSemPremierMois"
            }, {
                label: t("evaluation_milieu_stage.step.general.hours_per_week_second_month"),
                type: "number",
                name: "nbHeuresParSemDeuxiemeMois"
            }, {
                label: t("evaluation_milieu_stage.step.general.hours_per_week_third_month"),
                type: "number",
                name: "nbHeuresParSemTroisiemeMois"
            }, {
                label: t("evaluation_milieu_stage.step.general.hourly_rate"), type: "number", name: "tauxHoraire"
            }]
        }, {
            title: t("evaluation_milieu_stage.step.section2.title"),
            description: t("evaluation_milieu_stage.step.section2.description"),
            items: [t("evaluation_milieu_stage.step.section2.fields.field1"), t("evaluation_milieu_stage.step.section2.fields.field2"), t("evaluation_milieu_stage.step.section2.fields.field3"), t("evaluation_milieu_stage.step.section2.fields.field4"), t("evaluation_milieu_stage.step.section2.fields.field5"),],
            section: "section2"
        }, {
            title: t("evaluation_milieu_stage.step.section3.title"),
            description: t("evaluation_milieu_stage.step.section3.description"),
            items: [t("evaluation_milieu_stage.step.section3.fields.field1"), t("evaluation_milieu_stage.step.section3.fields.field2"), t("evaluation_milieu_stage.step.section3.fields.field3"), t("evaluation_milieu_stage.step.section3.fields.field4"), t("evaluation_milieu_stage.step.section3.fields.field5"),],
            section: "section3"
        }];
        if (currentStep === 1) {
            const {title, fields} = stepOptions[0];
            return (<section>
                <h3>{title}</h3>
                {fields.map((field, index) => (
                    <div key={index} style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                        <label>{field.label}</label>
                        {field.type === "select" ? (<select
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            style={{
                                width: "50%",
                                marginLeft: "10px",
                                border: errors[field.name] ? "1px solid red" : "1px solid #ccc"
                            }}
                        >
                            {field.options.map((option, idx) => (<option key={idx} value={option.value}>
                                {option.label}
                            </option>))}
                        </select>) : (<input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            style={{
                                width: "50%",
                                marginLeft: "10px",
                                border: errors[field.name] ? "1px solid red" : "1px solid #ccc"
                            }}
                        />)}
                        {errors[field.name] && (<span style={{color: "red", fontSize: "12px", marginLeft: "10px"}}>
                        {errors[field.name]}
                    </span>)}
                    </div>))}
            </section>);
        } else if (currentStep > 1 && currentStep <= stepOptions.length) {
            const {title, description, items, section} = stepOptions[currentStep - 1];
            return (<section>
                <h3>{title}</h3>
                <p>{description}</p>
                {items.map((item, idx) => (<div key={idx} style={{marginBottom: "15px"}}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <label htmlFor={`${section}.champs.${item}`} style={{flex: 1, marginRight: "10px"}}>
                            {item}
                        </label>
                        <select
                            id={`${section}.champs.${item}`}
                            name={`${section}.champs.${item}`}
                            value={formData.sections[section]?.champs?.[item] || ""}
                            onChange={handleChange}
                            style={{
                                width: "50%",
                                textAlign: "center",
                                textAlignLast: "center",
                                border: errors[`${section}.champs.${item}`] ? "1px solid red" : "1px solid #ccc",
                            }}
                        >
                            <option value="">{t("evaluation_milieu_stage.step.select")}</option>
                            {Object.entries(ReponseEvaluation).map(([key, label]) => (<option key={key} value={key}>
                                {label}
                            </option>))}
                        </select>
                    </div>
                    {errors[`${section}.champs.${item}`] && (<span style={{
                        color: "red", fontSize: "12px"
                    }}>{errors[`${section}.champs.${item}`]}</span>)}
                </div>))}
                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <label style={{marginBottom: "10px"}}>{t("evaluation_milieu_stage.step.comment")}</label>
                    <textarea
                        name={`${section}.commentaire`}
                        value={formData.sections[section]?.commentaire || ""}
                        onChange={handleChange}
                        style={{width: "60%", marginLeft: "10px", fontSize: 12}}
                    ></textarea>
                </div>
            </section>);
        } else if (currentStep === 4) {
            return (<section>
                <h3>{t("evaluation_milieu_stage.step.section4.title")}</h3>
                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <label>{t("evaluation_milieu_stage.step.section4.field1")}</label>
                    <select
                        name="milieuStageAPrivilegierPour"
                        value={formData.milieuStageAPrivilegierPour}
                        onChange={handleChange}
                        style={{
                            width: "50%",
                            marginLeft: "10px",
                            border: errors.milieuStageAPrivilegierPour ? "1px solid red" : "1px solid #ccc"
                        }}
                    >
                        <option value="">{t("evaluation_milieu_stage.step.select")}</option>
                        <option value="PREMIER_STAGE">{t("evaluation_milieu_stage.step.general.stage1")}</option>
                        <option value="DEUXIEME_STAGE">{t("evaluation_milieu_stage.step.general.stage2")}</option>
                    </select>
                    {errors.milieuStageAPrivilegierPour && (
                        <span style={{color: "red", fontSize: "12px", marginLeft: "10px"}}>
        {errors.milieuStageAPrivilegierPour}
    </span>)}
                </div>
                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <label>{t("evaluation_milieu_stage.step.section4.field2")}</label>
                    <input
                        type="text"
                        name="signatureSuperviseur"
                        value={formData.signatureSuperviseur}
                        onChange={handleChange}
                        style={{
                            width: "50%",
                            marginLeft: "10px",
                            border: errors.signatureSuperviseur ? "1px solid red" : "1px solid #ccc"
                        }}
                    />
                    {errors.signatureSuperviseur && (<span style={{color: "red", fontSize: "12px", marginLeft: "10px"}}>
        {errors.signatureSuperviseur}
    </span>)}
                </div>
                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <label>{t("evaluation_milieu_stage.step.section4.field3")}</label>
                    <select
                        name="capaciteEtudiant"
                        value={formData.capaciteEtudiant}
                        onChange={handleChange}
                        style={{
                            width: "50%",
                            marginLeft: "10px",
                            border: errors.capaciteEtudiant ? "1px solid red" : "1px solid #ccc"
                        }}
                    >
                        <option value="">{t("evaluation_milieu_stage.step.select")}</option>
                        <option
                            value="UN_STAGIAIRE">{t("evaluation_milieu_stage.step.capaciteEtudiant.UN_STAGIAIRE")}</option>
                        <option
                            value="DEUX_STAGIAIRES">{t("evaluation_milieu_stage.step.capaciteEtudiant.DEUX_STAGIAIRES")}</option>
                        <option
                            value="TROIS_STAGIAIRES">{t("evaluation_milieu_stage.step.capaciteEtudiant.TROIS_STAGIAIRES")}</option>
                        <option
                            value="PLUS_DE_TROIS">{t("evaluation_milieu_stage.step.capaciteEtudiant.PLUS_DE_TROIS")}</option>
                    </select>
                    {errors.capaciteEtudiant && (<span style={{color: "red", fontSize: "12px", marginLeft: "10px"}}>
        {errors.capaciteEtudiant}
    </span>)}
                </div>
                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <label>{t("evaluation_milieu_stage.step.section4.field4")}</label>
                    <input
                        type="radio"
                        name="memeStagiaireProchainStage"
                        value="yes"
                        checked={formData.memeStagiaireProchainStage === true}
                        onChange={() => setFormData((prev) => ({
                            ...prev, memeStagiaireProchainStage: true
                        }))}
                        style={{marginLeft: "10px"}}
                    /> {t("evaluation_milieu_stage.step.section4.yes")}
                    <input
                        type="radio"
                        name="memeStagiaireProchainStage"
                        value="no"
                        checked={formData.memeStagiaireProchainStage === false}
                        onChange={() => setFormData((prev) => ({
                            ...prev, memeStagiaireProchainStage: false
                        }))}
                        style={{marginLeft: "10px"}}
                    /> {t("evaluation_milieu_stage.step.section4.no")}
                </div>
                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <label>{t("evaluation_milieu_stage.step.section4.field5")}</label>
                    <div style={{marginLeft: "10px"}}>
                        <input
                            type="radio"
                            name="quartTravailVariable"
                            value="yes"
                            checked={formData.quartTravailVariable === true}
                            onChange={() => setFormData((prev) => ({...prev, quartTravailVariable: true}))}
                        /> {t("evaluation_milieu_stage.step.section4.yes")}
                        <input
                            type="radio"
                            name="quartTravailVariable"
                            value="no"
                            checked={formData.quartTravailVariable === false}
                            onChange={() => setFormData((prev) => ({...prev, quartTravailVariable: false}))}
                            style={{marginLeft: "10px"}}
                        /> {t("evaluation_milieu_stage.step.section4.no")}
                    </div>
                </div>
                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <label>{t("evaluation_milieu_stage.step.section4.field6")}</label>
                    <input
                        type="text"
                        name="quartTravail1Debut"
                        value={formData.quartTravail1Debut}
                        onChange={handleChange}
                        style={{
                            width: "50%",
                            marginLeft: "10px",
                            border: errors.quartTravail1Debut ? "1px solid red" : "1px solid #ccc"
                        }}
                    />
                    <input
                        type="text"
                        name="quartTravail1Fin"
                        value={formData.quartTravail1Fin}
                        onChange={handleChange}
                        style={{
                            width: "50%",
                            marginLeft: "10px",
                            border: errors.quartTravail1Fin ? "1px solid red" : "1px solid #ccc"
                        }}
                    />
                    {errors.quartTravail1Debut && (<span style={{color: "red", fontSize: "12px", marginLeft: "10px"}}>
        {errors.quartTravail1Debut}
    </span>)}
                    {errors.quartTravail1Fin && (<span style={{color: "red", fontSize: "12px", marginLeft: "10px"}}>
        {errors.quartTravail1Fin}
    </span>)}
                </div>
                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <label style={{width: "50%"}}>
                        {t("evaluation_milieu_stage.step.section4.field7")}
                    </label>
                    <input
                        type="text"
                        name="quartTravail2Debut"
                        value={formData.quartTravail2Debut}
                        onChange={handleChange}
                        style={{
                            width: "50%",
                            marginLeft: "10px",
                            border: errors.quartTravail2Debut ? "1px solid red" : "1px solid #ccc"
                        }}
                    />
                    <input
                        type="text"
                        name="quartTravail2Fin"
                        value={formData.quartTravail2Fin}
                        onChange={handleChange}
                        style={{
                            width: "50%",
                            marginLeft: "10px",
                            border: errors.quartTravail2Fin ? "1px solid red" : "1px solid #ccc"
                        }}
                    />
                </div>
                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <label style={{width: "50%"}}>
                        {t("evaluation_milieu_stage.step.section4.field8")}
                    </label>
                    <input
                        type="text"
                        name="quartTravail3Debut"
                        value={formData.quartTravail3Debut}
                        onChange={handleChange}
                        style={{
                            width: "50%",
                            marginLeft: "10px",
                            border: errors.quartTravail3Debut ? "1px solid red" : "1px solid #ccc"
                        }}
                    />
                    <input
                        type="text"
                        name="quartTravail3Fin"
                        value={formData.quartTravail3Fin}
                        onChange={handleChange}
                        style={{
                            width: "50%",
                            marginLeft: "10px",
                            border: errors.quartTravail3Fin ? "1px solid red" : "1px solid #ccc"
                        }}
                    />
                </div>
            </section>);
        } else {
            return <p>Étape invalide</p>;
        }
    };

    return (<div>
        <div className="bg-auth">
            <div className="bg-auth-point"></div>
            <div className="bg-auth-point"></div>
            <div className="bg-auth-point"></div>
        </div>

        <div className="auth-body">
            <div className={"signup-frame"}>
                <div className={"signup-head " + (currentStep !== 0 ? "signup-head-instep" : "")} style={{
                    "background": "linear-gradient(rgba(0,0,0,0.4), rgb(255, 0, 108,0.8)), url('/assets/auth/signup/s1.jpg') center/cover",
                    "backdropFilter": "blur(10px)"
                }}>
                    <div className="toolbar-items">
                        <Link to="/">
                            <img src="/assets/logo/logo.svg" alt="" className={"logo"}/>
                        </Link>
                    </div>
                    <br/>
                    <h5>{t("evaluation_milieu_stage.evaluation_steps.title")}</h5>
                    <br/>
                    {currentStep !== 0 ? (<div className="vertical-stepper">
                        <div className="vertical-stepper-item">
                            <div className="vertical-stepper-content">
                                <h6 className="vertical-stepper-title">
                                    {t("evaluation_milieu_stage.evaluation_steps.step1.title")}
                                </h6>
                            </div>
                        </div>
                        <div className="vertical-stepper-item">
                            <div className="vertical-stepper-content">
                                <h6 className="vertical-stepper-title">
                                    {t("evaluation_milieu_stage.evaluation_steps.step2.title")}
                                </h6>
                            </div>
                        </div>
                        <div className="vertical-stepper-item">
                            <div className="vertical-stepper-content">
                                <h6 className="vertical-stepper-title">
                                    {t("evaluation_milieu_stage.evaluation_steps.step3.title")}
                                </h6>
                            </div>
                        </div>
                        <div className="vertical-stepper-item">
                            <div className="vertical-stepper-content">
                                <h6 className="vertical-stepper-title">
                                    {t("evaluation_milieu_stage.evaluation_steps.step4.title")}
                                </h6>
                            </div>
                        </div>
                    </div>) : (<div>
                        <h1>{t("evaluation_milieu_stage.evaluation_steps.no_step")}</h1>
                    </div>)}
                    <br/>
                    <br/>
                </div>
                <div className="signup-content">
                    {!isPdfPreviewVisible ? (<>
                        {renderStep()}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "20px",
                                position: "absolute",
                                bottom: "0px",
                                width: "100%",
                            }}
                        >
                            {currentStep > 1 && (<button
                                onClick={handlePreviousStep}
                                style={{marginRight: "auto"}}
                            >
                                {t("evaluation_milieu_stage.step.previous")}
                            </button>)}
                            {currentStep < 4 && (<button
                                onClick={handleNextStep}
                                className="btn-filled"
                                style={{marginLeft: "auto", marginRight: "50px"}}
                            >
                                {t("evaluation_milieu_stage.step.next")}
                            </button>)}
                            {currentStep === 4 && (<div>
                                <button
                                    onClick={handleSubmit}
                                    className="btn-filled"
                                    style={{marginLeft: "auto", marginRight: "50px"}}
                                >
                                    {t("evaluation_milieu_stage.step.submit")}
                                </button>
                            </div>)}
                        </div>
                    </>) : (<div>
                        <PdfPreview file={pdfPreviewUrl} height={500} filename="evaluation_stagiaire.pdf"/>
                        <button
                            onClick={() => (window.location.href = "/dashboard")}
                            className="btn-filled"
                            style={{
                                marginTop: "20px", display: "block", marginLeft: "auto", marginRight: "auto",
                            }}
                        >
                            {t("evaluation_milieu_stage.step.back_to_dashboard")}
                        </button>
                    </div>)}
                </div>
            </div>
        </div>
    </div>);
};

export default EvaluationMilieuStageEtapes;