import React, { createContext, useContext, useEffect, useState } from 'react';
import EventEmitter from 'eventemitter3';
import {useNavigate} from "react-router-dom";

const AuthContext = createContext(undefined);

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const [currentToken, setCurrentToken] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem("FOSE_AUTH");
        if (token) {
            setCurrentUser(GetUserByToken(token));
        }
    }, []);

    const isSignedIn = () => {
        return localStorage.getItem("FOSE_AUTH") != null;
    }

    const GetUserByToken = (token) => {
        fetch('/infos-utilisateur', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
            .then(response => response.json())
            .then(data => {
                setCurrentUser(data)
                setCurrentToken(token)
                return data
            })
            .catch(() => {
                localStorage.removeItem("FOSE_AUTH");
                return null
            });
        return null
    };

    const SignInUser = async (email, password) => {
        return await fetch('/connexion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(async response => {
                if (response.ok !== true) {
                    throw new Error(await response.text());
                }
                return response
            })
            .then(response => response.text())
            .then(response => {
                localStorage.setItem("FOSE_AUTH", response.substring(7));
                setCurrentUser(GetUserByToken(response.substring(7)));
            })
    };

    const SignOutUser = () => {
        setCurrentUser(null)
        localStorage.removeItem("FOSE_AUTH")
        navigate("/")
    };


    return (
        <AuthContext.Provider value={{ currentUser, currentToken, SignInUser, SignOutUser, isSignedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };