import React, { createContext, useContext, useEffect, useState } from 'react';

const CvContext = createContext(undefined);

const CvProvider = ({ children, user}) => {
    useEffect(() => {
    }, []);

    const currentToken = user;

    const UploadCv = () => {
        fetch('/cv/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': currentToken
            }
        })
            .then(response => response.json())
            .then(data => {
                alert(currentToken)
            })
            .catch(() => {
            });
        return null
    };

    const GetCvs = async () => {
        return await fetch('/cv/get-my-cvs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(async response => {
                if (response.ok !== true) {
                    throw new Error(await response.text());
                }
                return response
            })
            .then(response => response.text())
            .then(response => {})
    };


    return (
        <CvContext.Provider value={{ UploadCv, GetCvs }}>
            {children}
        </CvContext.Provider>
    );
};

export { CvProvider, CvContext };