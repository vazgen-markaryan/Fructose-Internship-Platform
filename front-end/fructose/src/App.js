import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";

import HomePage from './components/HomePage';
import CreerUtilisateur from "./components/CreerUtilisateur";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/creer-utilisateur" element={<CreerUtilisateur/>}/>
                {/*Ajouter SEULEMENT routes ici*/}
            </Routes>
        </BrowserRouter>
    );
}

export default App;