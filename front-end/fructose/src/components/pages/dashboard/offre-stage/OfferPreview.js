import React, { useContext, useState, useRef } from "react";
import Icon from "@mdi/react";
import {
    mdiCashMultiple,
    mdiBriefcaseOutline,
    mdiMapMarkerOutline
} from "@mdi/js";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../../providers/AuthProvider";

const OfferPreview = ({ currentOffer }) => {
    const { t } = useTranslation();
    const { currentUser } = useContext(AuthContext);
    const [isRejectModalOpen, setRejectModalOpen] = useState(false);
    const textareaRef = useRef(null);
    const {currentToken} = useContext(AuthContext)
    function handleValidateOffer(id) {
        fetch(`/accepter-offre-stage/` + id, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": currentToken
            }
        })
            .then(response => {
                if (response.ok) {
                    console.log("Offre de stage acceptée avec succès");
                } else {
                    throw new Error("Erreur lors de l'acceptation de l'offre");
                }
            })
            .catch(error => {
                console.error("Erreur lors de l'acceptation de l'offre:", error);
            });
    }


    function handleRejectOffer(id) {
        const commentValue = textareaRef.current.value;
        fetch(`/refuser-offre-stage/` + id, {
            method: "POST",
            headers: { "Content-Type": "application/json",
                        "Authorization" : currentToken},
            body: JSON.stringify({ commentaireRefus: commentValue }),
        })
            .then(response => {
                if (response.ok) return response.json();
                throw new Error("Erreur lors du refus de l'offre");
            })
            .then(data => {
                setRejectModalOpen(false);
                textareaRef.current.value = "";
            })
            .catch(error => {
                console.error("Erreur lors du refus de l'offre:", error);
            });
    }

    function Modal({ children, onClose }) {
        return (
            <div className="modal-overlay">
                <div className="modal-content" style={{ pointerEvents: "auto" }}>
                    {children}
                    <button onClick={onClose}>Fermer</button>
                </div>
            </div>
        );
    }

    return (
        <>
            {currentOffer && (
                <div className="dashboard-card" style={{ width: "55%", position: "sticky", top: "70px", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
                    <div className="user-profile-section">
                        <div className="company-profile-section-banner" style={{ borderRadius: "5px 5px 0 0" }}></div>
                        <div className="user-profile-section-profile-picture radius-normal"
                             style={{ backgroundImage: "url('/assets/offers/default-company.png')" }}>
                        </div>
                    </div>
                    <section>
                        <div className="toolbar-items" style={{ padding: "0 10px" }}>
                            <div>
                                <h4 className="m-0">{currentOffer.poste}</h4>
                                <p className="text-dark m-0">{currentOffer.ownerDTO.companyName}</p>
                            </div>
                            <div className="toolbar-spacer"></div>

                            {currentUser.role === "ETUDIANT" ? (
                                <button className="btn-filled">Postuler</button>
                            ) : currentUser.role === "ADMIN" ? (
                                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                                    <button className="btn-filled" onClick={() => handleValidateOffer(currentOffer.id)}>
                                        {t("creer_offre_stage_page.validate")}
                                    </button>
                                    <button className="btn-outline" onClick={() => setRejectModalOpen(true)}>
                                    {t("creer_offre_stage_page.reject")}
                                    </button>
                                </div>
                            ) : null}
                        </div>
                        <br/>
                        <hr/>
                    </section>
                    <div style={{ overflowY: "auto" }}>
                        <section>
                            <h5>Particularites</h5>
                            <div className="list-bullet">
                                <Icon path={mdiCashMultiple} size={1} />
                                <div style={{ padding: "4px 0" }}>
                                    <h6 className="m-0" style={{ marginBottom: "5px" }}>Salaire</h6>
                                    <span className="badge text-mini">C$ {currentOffer.tauxHoraire}.00</span>
                                </div>
                            </div>
                            <div className="list-bullet">
                                <Icon path={mdiBriefcaseOutline} size={1} />
                                <div style={{ padding: "4px 0" }}>
                                    <h6 className="m-0" style={{ marginBottom: "5px" }}>Type de stage</h6>
                                    <span className="badge text-mini">{t("creer_offre_stage_page.types_emploi." + currentOffer.modaliteTravail)}</span>
                                    <span className="badge text-mini">{currentOffer.nombreHeuresSemaine} Heures</span>
                                </div>
                            </div>
                            <div className="list-bullet">
                                <Icon path={mdiBriefcaseOutline} size={1} />
                                <div style={{ padding: "4px 0" }}>
                                    <h6 className="m-0" style={{ marginBottom: "5px" }}>Horaire</h6>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <span className="badge text-mini">{t("creer_offre_stage_page.types_emploi." + currentOffer.modaliteTravail)}</span>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <h5>Location</h5>
                            <div className="list-bullet">
                                <Icon path={mdiMapMarkerOutline} size={1} />
                                <div style={{ padding: "4px 0" }}>
                                    <h6 className="m-0" style={{ marginBottom: "5px" }}>{currentOffer.adresse}</h6>
                                </div>
                            </div>
                            <hr />
                            <h5>Description</h5>
                            <p>{currentOffer.description}</p>
                        </section>
                    </div>
                </div>
            )}

            {isRejectModalOpen && (
                <Modal onClose={() => setRejectModalOpen(false)}>
                    <h4>{t("creer_offre_stage_page.reject_reason")}</h4>
                    <textarea
                        ref={textareaRef}
                        placeholder="Entrez le commentaire de refus ici..."
                        style={{ width: "100%", height: "100px" }}
                    />
                    <button onClick={() => handleRejectOffer(currentOffer.id)} className="btn-filled">
                        Envoyer
                    </button>
                </Modal>
            )}
        </>
    );
};

export default OfferPreview;
