import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from './components/pages/home/HomePage';
import CreerUtilisateur from "./components/pages/login-signup/CreerUtilisateur";
import CreerOffreStage from "./components/pages/offre_stage/CreerOffreStage";
import ConnexionUtilisateur from "./components/pages/login-signup/ConnexionUtilisateur";
import Dashboard from "./components/pages/dashboard/Dashboard";
import {AuthProvider} from "./providers/AuthProvider";
import {PrivateRoute} from "./components/routing/PrivateRoute";
import {RoleRoute} from "./components/routing/RoleRoute";

function App() {

    return (
        <BrowserRouter>
            <div style={{minHeight: '100vh', position: 'relative'}}>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/creer-utilisateur" element={<CreerUtilisateur/>}/>
                        <Route path="/connexion" element={<ConnexionUtilisateur/>}/>
                        <Route path="/dashboard/*" element={<PrivateRoute element={<Dashboard/>}/>}/>
                        <Route path="/creer-offre-stage" element={<RoleRoute element={<CreerOffreStage/>} roles={['ADMIN', 'EMPLOYEUR']}/>}/>
                    </Routes>
                </AuthProvider>
            </div>
        </BrowserRouter>
    );
}

export default App;