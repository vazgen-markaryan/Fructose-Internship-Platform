import React from "react";
import {Link} from "react-router-dom";

const HomePage = () => {
    return (
        <div>
            <h1>OSE KILLER - FRUCTOSE</h1>
            <h3>Front End est fait juste pour tester Inscription Etudiant</h3>
            <h3>À Changer in the Future</h3>
            <div>
                <nav>
                    <ul>
                        <li><Link to="/creer-utilisateur">Créer Utilisateur</Link></li>
                        <li><Link to="/connexion">Connexion</Link></li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}
export default HomePage;