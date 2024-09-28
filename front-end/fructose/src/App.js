import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";

import HomePage from './components/HomePage';
import CreerUtilisateur from "./components/CreerUtilisateur";
import ConnexionUtilisateur from "./components/ConnexionUtilisateur";
import TemporaireFooterLanguage from "./components/TemporaireFooterLanguage";
function App() {
    return (
        <BrowserRouter>
            <div style={{minHeight: '100vh', position: 'relative'}}>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/creer-utilisateur" element={<CreerUtilisateur/>}/>
                    <Route path="/connexion" element={<ConnexionUtilisateur/>}/>
                    {/*Ajouter SEULEMENT routes ici*/}
                </Routes>
                <TemporaireFooterLanguage/>
            </div>
        </BrowserRouter>
    );
}

export default App;