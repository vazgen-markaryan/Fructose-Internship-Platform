import {useEffect, useState} from "react";

class AuthService {
    static BASE_URL = "http://localhost:3000/"
    
    static SignInUser = (email, password) => {
        return fetch('/connexion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:{
                email: email,
                password: password
            }
        })
    }
    static InitUserProcess = () => {
        let token = localStorage.getItem("FOSE_AUTH")
        if (token != null){
            setCurrentUser(GetUserByToken(token));
        }
    }

    static GetUserByToken = (token) => {
        fetch('/infos-utilisateur', { // A Changer
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
            .then(response => {
                return response.user;
            })
            .catch(error => {
                // Si erreur de type token invalide
                localStorage.removeItem("FOSE_AUTH")
            });
    }
}
export default AuthService