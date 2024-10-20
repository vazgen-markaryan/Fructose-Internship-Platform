import React, {createContext, useContext, useEffect, useState} from 'react';
import {AuthContext} from "./AuthProvider";

const CvContext = createContext(undefined);

const CvProvider = ({ children }) => {

    const { currentToken } = useContext(AuthContext)

    const UploadCv = async (file) => {
        let formData = new FormData()
        formData.append("file", file)

        return fetch('/deposer-cv', {
            method: 'POST',
            headers: {
                'Authorization': currentToken
            },
            body: formData
        })
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