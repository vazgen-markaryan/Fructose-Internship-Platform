import React, {useContext, useEffect, useState} from "react";
import {
    mdiArrowLeft,
    mdiBriefcaseRemove,
    mdiCashMultiple,
    mdiBriefcaseOutline, mdiFilterMultipleOutline, mdiChevronUp, mdiDomain, mdiBookEducationOutline
} from "@mdi/js";
import Icon from "@mdi/react";
import {AuthContext} from "../../../../providers/AuthProvider";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {OffreStageContext} from "../../../../providers/OffreStageProvider";
import OfferPreview from "./OfferPreview";

const DiscoverOffers = () => {

    const {t} = useTranslation();
    const {fetchOffresStage} = useContext(OffreStageContext);
    const {isUserInit, currentUser} = useContext(AuthContext);
    const [offers, setOffers] = useState([])
    const [currentOffer, setCurrentOffer] = useState(null)
    const [displayFiltreWindow, setDisplayFiltreWindow] = useState(false)

    useEffect(() => {
        if (isUserInit) {
            (async function () {
                try {
                    const response = await fetchOffresStage();
                    setOffers(response)
                } catch (error) {

                }
            })();
        }
    }, [isUserInit]);

    const handleOfferSelection = (offer) => {
        setCurrentOffer(offer);
    };

    const getOfferListSection = () => {
        if (offers.length > 0) {
            return (
                <div style={{width: "45%"}}>
                    <div className={"dashboard-card expandable " + ((displayFiltreWindow) ? "expanded" : "")}>
                        <section>
                            <div className="toolbar-items">
                                <h5 className="m-0">Filtres</h5>
                                <div className="toolbar-spacer"></div>
                                <button className="btn-icon" onClick={() => {
                                    setDisplayFiltreWindow(false)
                                }}><Icon path={mdiChevronUp} size={1}/></button>
                            </div>
                            <br/>
                            <div>
                                <div className="list-bullet">
                                    <Icon path={mdiBriefcaseOutline} size={1}/>
                                    <div style={{padding: "4px 0"}}>
                                        <h6 className="m-0" style={{marginBottom: "5px"}}>Type de stage</h6>
                                        <input type="radio" id="typeTempsTout" name="filtreTypeTemps"/>
                                        <label htmlFor="typeTempsPartiel">Tous</label>
                                        <br/>
                                        <input type="radio" id="typeTempsPartiel" name="filtreTypeTemps"/>
                                        <label htmlFor="typeTempsPartiel">Temps Partiel</label>
                                        <br/>
                                        <input type="radio" id="typeTempsPlein" name="filtreTypeTemps"/>
                                        <label htmlFor="typeTempsPartiel">Temps Plein</label>
                                    </div>
                                </div>
                                <div className="list-bullet">
                                    <Icon path={mdiDomain} size={1}/>
                                    <div style={{padding: "4px 0"}}>
                                        <h6 className="m-0" style={{marginBottom: "5px"}}>Emplacement</h6>
                                        <input type="radio" id="typeTempsTout" name="filtreTypeEmplacement"/>
                                        <label htmlFor="typeTempsPartiel">Tous</label>
                                        <br/>
                                        <input type="checkbox" id="typeEmplacementVirtuel"
                                               name="filtreTypeEmplacement"/>
                                        <label htmlFor="typeTempsPartiel">Présentiel</label>
                                        <br/>
                                        <input type="checkbox" id="typeEmplacementVirtuel"
                                               name="filtreTypeEmplacement"/>
                                        <label htmlFor="typeTempsPartiel">Virtuel</label>
                                        <br/>
                                        <input type="checkbox" id="typeEmplacementVirtuel"
                                               name="filtreTypeEmplacement"/>
                                        <label htmlFor="typeTempsPartiel">Hybride</label>
                                    </div>
                                </div>
                                <div className="list-bullet">
                                    <Icon path={mdiCashMultiple} size={1}/>
                                    <div style={{padding: "4px 0"}}>
                                        <h6 className="m-0" style={{marginBottom: "5px"}}>Taux Horaire</h6>
                                        <input type="range" min="0" max="50"/>
                                    </div>
                                </div>
                                <div className="list-bullet">
                                    <Icon path={mdiBookEducationOutline} size={1}/>
                                    <div style={{padding: "4px 0"}}>
                                        <h6 className="m-0" style={{marginBottom: "5px"}}>Département</h6>
                                        <select name="" id="" disabled="disabled">
                                            <option value="">{t("programme." + currentUser.departementDTO.nom)}</option>
                                        </select>
                                    </div>
                                </div>

                            </div>

                            <div className="toolbar-items">
                                <div className="toolbar-spacer"></div>
                                <button className="btn-filled">Rechercher</button>
                            </div>
                        </section>
                    </div>
                    <div className="dashboard-card">
                        <section>
                            <div>
                                <div className="toolbar-items">
                                    <h5 className="m-0">{offers.length} Resultats</h5>
                                    <div className="toolbar-spacer"></div>
                                    <select name="" id="" title="Filtrer par" style={{width: "150px"}}>
                                        <optgroup label="Ordre des résultats">
                                            <option value="recent">Le Plus Récent</option>
                                            <option value="recent">Le Plus Ancien</option>
                                            <option value="recent">Date limite candidature</option>
                                        </optgroup>
                                    </select>
                                    <button onClick={() => {
                                        setDisplayFiltreWindow(!displayFiltreWindow)
                                    }}><Icon path={mdiFilterMultipleOutline} size={1}/> Filtrer
                                    </button>
                                </div>
                                <div className="menu-list">
                                    {offers.reverse().map((item, index) => (
                                        <div onClick={() => handleOfferSelection(item)} key={index}
                                             className={`menu-list-item ${currentOffer && item.id === currentOffer.id ? "menu-list-item-selected" : ""}`}
                                             style={{
                                                 width: "100%",
                                                 padding: "0",
                                                 height: "170px",
                                                 boxSizing: "border-box"
                                             }}>
                                            <div style={{padding: "16px"}}>
                                                <p style={{fontSize: "11px", textTransform: "uppercase"}}
                                                   className="text-dark">
                                                    {t("programme." + item.departementDTO.nom)}
                                                </p>
                                                <h4 className="m-0">{item.poste}</h4>
                                                <p>{item.ownerDTO.companyName}</p>
                                                <p>{item.adresse}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <br/>
                            </div>
                        </section>
                    </div>
                </div>
            );
        }
    };

    const getAppercu = () => <OfferPreview currentOffer={currentOffer}/>;

    const getOffreListSection = () => {
        if (offers.length === 0) {
            return (
                <div className="dashboard-card" style={{width: "45%"}}>
                    <div className="dashboard-placeholder-card" style={{backgroundColor: "transparent"}}>
                        <div style={{textAlign: "center"}}>
                            <Icon path={mdiBriefcaseRemove} size={2}/>
                            <h6 style={{margin: "8px 0 14px 0"}}>Aucune offre de stage disponible</h6>
                            <p className="text-dark">Elles apparaîtront ici dès qu'elles seront disponibles</p>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <>
                    {getOfferListSection()}
                </>

            );
        }
    };

    return (
        <>
            <div className="dashboard-card-toolbar">
                <Link to="/dashboard">
                    <button className="btn-icon-dashboard">
                        <Icon path={mdiArrowLeft} size={1.4}/>
                    </button>
                </Link>
                <h1>Offres de Stage</h1>
            </div>
            <div style={{display: "flex", gap: "20px", alignItems: "start"}}>
                {getOffreListSection()}
                {getAppercu()}
            </div>
        </>
    );
};

export default DiscoverOffers;