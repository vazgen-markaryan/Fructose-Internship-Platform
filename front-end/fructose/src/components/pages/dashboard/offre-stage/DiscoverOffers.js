import React, {useContext, useEffect, useState} from "react";
import {
    mdiArrowLeft,
    mdiClockOutline,
    mdiBriefcaseRemove,
    mdiCashMultiple,
    mdiBriefcaseOutline,
    mdiMapMarkerOutline,
    mdiFilterMultipleOutline,
    mdiChevronUp,
    mdiDomain,
    mdiBookEducationOutline,
    mdiAlertCircleOutline, mdiCalendarOutline
} from "@mdi/js";
import Icon from "@mdi/react";
import {AuthContext, AuthProvider} from "../../../../providers/AuthProvider";
import {Link} from "react-router-dom";
import PdfPreview from "../../../content/PdfPreview";
import {CvContext} from "../../../../providers/CvProvider";
import {useTranslation} from "react-i18next";
import {OffreStageContext} from "../../../../providers/OffreStageProvider";

const DiscoverOffers = () => {
    const {t} = useTranslation();
    const {fetchOffresStage} = useContext(OffreStageContext);
    const {isUserInit, currentUser} = useContext(AuthContext);

    const [offers, setOffers] = useState([])
    const [currentOffer, setCurrentOffer] = useState(null)

    const [displayFiltreWindow, setDisplayFiltreWindow] = useState(false)

    const [filters, setFilters] = useState(
        {
            type: "tous",
            emplacement: [
                "presentiel"
            ],
            tauxHoraire: 0,
            departmenet: null
        }
    )

    const [filterFields, setFilterFields] = useState(
        {

        }
    )

    const [filteredOffers, setFilteredOffers] = useState([])


    useEffect(() => {
        if (isUserInit) {
            (async function () {
                try {
                    const response = await fetchOffresStage();
                    setOffers(response)
                    setFilteredOffers(filterOffers(response, filters))
                } catch (error) {

                }
            })();
        }
    }, [isUserInit]);

    const filterOffers = (offers, filters) => {
        let finalOffer = []
        for (let i = 0; i < offers.length; i++){
            let currentOffer = offers[i]
            let isEligible = false
            if (filters.type){
                if (!(filters.type === "tous" || currentOffer.modaliteTravail === filters.type)){
                    isEligible = false
                    continue
                } else {
                    isEligible = true
                }
            }
            if (filters.emplacement){
                if(Array.isArray(filters.emplacement)){
                    for (let j = 0; j < filters.emplacement.length; j++){
                        if(filters.emplacement[j] === currentOffer.emplacement){
                            isEligible = true
                        }
                    }
                } else if (filters.emplacement === "tous") {
                    isEligible = true
                }
            }
            if (filters.tauxHoraire){
                isEligible = (isEligible === true && currentOffer.tauxHoraire > filters.tauxHoraire)
            }
            if(isEligible){
                finalOffer.push(currentOffer)
            }
        }
        return finalOffer
    }

    const handleOfferFilterSelection = () => {
        setFilteredOffers(filterOffers(offers, filters))
    }

    const handleOfferSelection = (offer) => {
        setCurrentOffer(offer);
    };

    const getOfferListSection = () => {
        if (offers.length > 0) {
            return (
                <div style={{width: "45%"}}>
                    <div className={"dashboard-card"} style={{display: (displayFiltreWindow)?"block":"none"}}>
                        <section>
                            <div className="toolbar-items">
                                <h5 className="m-0">Filtres</h5>
                                <div className="toolbar-spacer"></div>
                                <button className="btn-icon" onClick={()=>{setDisplayFiltreWindow(false)}}><Icon path={mdiChevronUp} size={1} /></button>
                            </div>
                            <br/>
                            <div>
                                <div className="list-bullet">
                                    <Icon path={mdiBriefcaseOutline} size={1} />
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
                                    <Icon path={mdiDomain} size={1} />
                                    <div style={{padding: "4px 0"}}>
                                        <h6 className="m-0" style={{marginBottom: "5px"}}>Emplacement</h6>
                                        <input type="radio" id="typeTempsTout" name="filtreTypeEmplacement"/>
                                        <label htmlFor="typeTempsPartiel">Tous</label>
                                        <br/>
                                        <input type="checkbox" id="typeEmplacementVirtuel" name="filtreTypeEmplacement"/>
                                        <label htmlFor="typeTempsPartiel">Présentiel</label>
                                        <br/>
                                        <input type="checkbox" id="typeEmplacementVirtuel" name="filtreTypeEmplacement"/>
                                        <label htmlFor="typeTempsPartiel">Virtuel</label>
                                        <br/>
                                        <input type="checkbox" id="typeEmplacementVirtuel" name="filtreTypeEmplacement"/>
                                        <label htmlFor="typeTempsPartiel">Hybride</label>
                                    </div>
                                </div>
                                <div className="list-bullet">
                                    <Icon path={mdiCashMultiple} size={1} />
                                    <div style={{padding: "4px 0"}}>
                                        <h6 className="m-0" style={{marginBottom: "5px"}}>Taux Horaire Minumum</h6>
                                        <input type="range" min="0" max="50" value="0"/>
                                    </div>
                                </div>
                                <div className="list-bullet">
                                    <Icon path={mdiBookEducationOutline} size={1} />
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
                                <button className="btn-filled" onClick={()=>{handleOfferFilterSelection()}}>Rechercher</button>
                            </div>
                        </section>
                    </div>
                    <div className="dashboard-card">
                        <section>
                            <div>
                                <div className="toolbar-items">
                                    <h5 className="m-0">{filteredOffers.length} Resultats</h5>
                                    <div className="toolbar-spacer"></div>
                                    <select name="" id="" title="Ordonner par" style={{width: "150px"}}>
                                        <optgroup label="Ordre des résultats">
                                            <option value="recent">Le Plus Récent</option>
                                            <option value="recent">Le Plus Ancien</option>
                                            <option value="recent">Date limite candidature</option>
                                        </optgroup>
                                    </select>
                                    <button onClick={()=>{setDisplayFiltreWindow(!displayFiltreWindow)}}><Icon path={mdiFilterMultipleOutline} size={1} /> Filtres</button>
                                </div>
                                <div className="menu-list">
                                    {filteredOffers.reverse().map((item, index) => (
                                        <div onClick={() => handleOfferSelection(item)} key={index}
                                             className={`menu-list-item ${currentOffer && item.id === currentOffer.id ? "menu-list-item-selected" : ""}`}
                                             style={{
                                                 width: "100%",
                                                 padding: "0",
                                                 height: "170px",
                                                 boxSizing: "border-box"
                                             }}>
                                            <div style={{padding: "16px"}}>
                                                <p style={{fontSize: "11px", textTransform: "uppercase"}} className="text-dark">
                                                    {t("programme." + item.departementDTO.nom)}
                                                </p>
                                                <h4 className="m-0">{item.poste}</h4>
                                                <p>{item.ownerDTO.companyName}</p>
                                                <p>{item.adresse}</p>
                                                {
                                                    (item.nombrePostes <= 5)?<span className="badge text-mini"><Icon path={mdiAlertCircleOutline} size={0.5} /> Places limitées</span>
                                                        :<></>
                                                }

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

    const getAppercu = () => {
        if (currentOffer) {
            return (
                <>
                    <div className="dashboard-card" style={{width: "55%", position: "sticky", top: "70px", height: "90vh", display: "flex", flexDirection:"column"}}>
                        <div className="user-profile-section">
                            <div className="company-profile-section-banner" style={{borderRadius: "5px 5px 0 0"}}></div>
                            <div className="user-profile-section-profile-picture radius-normal"
                                 style={{"backgroundImage": "url('/assets/offers/default-company.png')"}}>
                            </div>
                        </div>
                        <section>
                            <div className="toolbar-items" style={{padding: "0 10px"}}>
                                <div>
                                    <h4 className="m-0">{currentOffer.poste}</h4>
                                    <p className="text-dark m-0">{currentOffer.ownerDTO.companyName}</p>
                                </div>
                                <div className="toolbar-spacer"></div>
                                <button className="btn-filled">Postuler</button>
                            </div>
                        </section>
                        <hr/>
                        <div style={{overflowY: "auto"}}>
                            <section className="nospace">
                                <h5>Particularites</h5>
                                <div className="list-bullet">
                                    <Icon path={mdiCashMultiple} size={1} />
                                    <div style={{padding: "4px 0"}}>
                                        <h6 className="m-0" style={{marginBottom: "5px"}}>Salaire</h6>
                                        <span className="badge text-mini">C$ {currentOffer.tauxHoraire}.00</span>
                                    </div>
                                </div>
                                <div className="list-bullet">
                                    <Icon path={mdiBriefcaseOutline} size={1} />
                                    <div style={{padding: "4px 0"}}>
                                        <h6 className="m-0" style={{marginBottom: "5px"}}>Type de stage</h6>
                                        <span className="badge text-mini">{t("creer_offre_stage_page.types_emploi." + currentOffer.modaliteTravail)}</span>
                                        <span className="badge text-mini">{currentOffer.nombreHeuresSemaine} Heures</span>
                                    </div>
                                </div>
                                <div className="list-bullet">
                                    <Icon path={mdiDomain} size={1} />
                                    <div style={{padding: "4px 0"}}>
                                        <h6 className="m-0" style={{marginBottom: "5px"}}>Emplacement</h6>
                                        <span className="badge text-mini">{t("creer_offre_stage_page.modalites_travail." + currentOffer.typeEmploi)}</span>
                                    </div>
                                </div>
                                <div className="list-bullet">
                                    <Icon path={mdiCalendarOutline} size={1} />
                                    <div style={{padding: "4px 0"}}>
                                        <h6 className="m-0" style={{marginBottom: "5px"}}>Durée du stage</h6>
                                        <span className="badge text-mini">{currentOffer.dateDebut} - {currentOffer.dateFin} (3 Mois)</span>
                                    </div>
                                </div>
                            </section>
                            <hr/>
                            <section className="nospace">
                                <h5>Location</h5>
                                <div className="list-bullet">
                                    <Icon path={mdiMapMarkerOutline} size={1} />
                                    <div style={{padding: "4px 0"}}>
                                        <h6 className="m-0" style={{marginBottom: "5px"}}>{currentOffer.adresse}</h6>
                                    </div>
                                </div>
                            </section>
                            <hr/>
                            <section className="nospace">
                                <h5>Description</h5>
                                <p>{currentOffer.description}</p>
                            </section>
                            <hr/>
                            <section className="nospace">
                                <h5>Employeur</h5>
                                <p>{currentOffer.ownerDTO.fullName}</p>
                                <p>{currentOffer.ownerDTO.companyName}</p>
                            </section>
                        </div>
                    </div>
                </>
            );
        }
        return null;
    };

    const getOffreListSection = () => {
        if (offers.length === 0) {
            return (
                <div className="dashboard-card" style={{width: "45%"}}>
                    <div className="dashboard-placeholder-card" style={{backgroundColor: "transparent"}}>
                        <div style={{textAlign: "center"}}>
                            <Icon path={mdiBriefcaseRemove} size={2} />
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