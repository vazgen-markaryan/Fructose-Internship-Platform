import React, {useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";

import HomePage from './components/HomePage';
import CreerUtilisateur from "./components/CreerUtilisateur";
import CreerOffreStage from "./components/offre_stage/CreerOffreStage";

import ConnexionUtilisateur from "./components/ConnexionUtilisateur";

import Dashboard from "./components/pages/dashboard/Dashboard";
import {AuthProvider} from "./providers/AuthProvider";
import PrivateRoute from "./components/routing/PrivateRoute";
import TemporaireFooterLanguage from "./components/TemporaireFooterLanguage";
function App() {

    return (
        <BrowserRouter>
            <div style={{minHeight: '100vh', position: 'relative'}}>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/creer-utilisateur" element={<CreerUtilisateur/>}/>
                        <Route path="/connexion" element={<ConnexionUtilisateur/>}/>
                        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard/>}/>}/>
                        <Route path="/creer-offre-stage" element={<CreerOffreStage/>}/>
                        {/*Ajouter SEULEMENT routes ici*/}
                    </Routes>
                    <TemporaireFooterLanguage/>
                </AuthProvider>
            </div>
        </BrowserRouter>
    );
}

export default App;