import React from "react";
import {mdiChevronLeft, mdiChevronRight, mdiDomain, mdiHumanMaleBoard, mdiSchool} from "@mdi/js";
import Icon from "@mdi/react";

const SelectionRole = ({utilisateur, handleChange, switchStep}) => {

    const handleSubmit = (event) => {
        event.preventDefault();
        const errorMessage = validateFields();
        if (errorMessage) {
            console.log(errorMessage)
        } else {
            switchStep(true)
        }
    };

    const validateFields = () => {
        if (!/^[A-Za-z\s]+$/.test(utilisateur.role)) {
            return "Le rôle doit contenir uniquement des lettres et des espaces";
        }
    }

    return (
        <div>
            <h4>Qui êtes vous?</h4>
            <p>Sélectionner le type d'utilisateur qui vous correspond</p>
            <br/>
            <form onSubmit={handleSubmit}>
                <div style={{"margin":"auto"}}>
                    <div className={"toolbar-items"} style={{"gap": "12px"}}>
                        <div style={{"width": "30%", "border": "1px solid grey", "borderRadius": "5px", "textAlign": "center", "padding": "10px"}}>
                            <Icon path={mdiSchool} size={2} />
                            <br/>
                            <h6><input id="etudiant" type="radio" name="role" value="Etudiant" onChange={handleChange} checked={utilisateur.role === "Etudiant"} /> Étudiant</h6>
                        </div>
                        <div style={{"width": "30%", "border": "1px solid grey", "borderRadius": "5px", "textAlign": "center", "padding": "10px"}}>
                            <Icon path={mdiDomain} size={2} />
                            <br/>
                            <h6><input id="employeur" type="radio" name="role" value="Employeur" onChange={handleChange} checked={utilisateur.role === "Employeur"}/> Employeur</h6>
                        </div>
                        <div style={{"width": "30%", "border": "1px solid grey", "borderRadius": "5px", "textAlign": "center", "padding": "10px"}}>
                            <Icon path={mdiHumanMaleBoard} size={2} />
                            <br/>
                            <h6><input id="professeur" type="radio" name="role" value="Professeur" onChange={handleChange} checked={utilisateur.role === "Professeur"}/> Professeur</h6>
                        </div>

                    </div>
                </div>


                <div className="form-dock">
                    <div className={"toolbar-spacer"}>

                    </div>
                    <button type="submit" className={"btn-filled"}>Continuer<Icon path={mdiChevronRight} size={1}/></button>
                </div>


            </form>
        </div>
    );
}

export default SelectionRole;