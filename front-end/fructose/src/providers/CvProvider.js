import React, {createContext, useContext, useEffect, useState} from 'react';
import {AuthContext} from "./AuthProvider";

const CvContext = createContext(undefined);

const CvProvider = ({ children }) => {

    const { currentToken } = useContext(AuthContext)

    const UploadCv = (file) => {
        let formData = new FormData()
        formData.append("file", file)
        console.log(formData)

        fetch('/deposer-cv', {
            method: 'POST',
            headers: {
                'Authorization': currentToken
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {

            })
            .catch(() => {
            });
        return null
    };

    const GetCvs = async () => {
        return fetch('/cvs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': currentToken
            },
        })
    };


    return (
        <CvContext.Provider value={{ UploadCv, GetCvs }}>
            {children}
        </CvContext.Provider>
    );
};

export { CvProvider, CvContext };