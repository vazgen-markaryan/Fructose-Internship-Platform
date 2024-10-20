export const isMatriculeTaken = async (matricule) => {
    try {
        const response = await fetch(`/check-matricule?matricule=${encodeURIComponent(matricule)}`);
        const data = await response.json();
        return data.matriculeTaken;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const isEmailTaken = async (email) => {
    try {
        const response = await fetch(`/check-email?email=${encodeURIComponent(email)}`);
        const data = await response.json();
        return data.emailTaken;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const getDepartement = async (departementName) => {
    try{
        const response = await fetch(`/check-departement?departementName=${encodeURIComponent(departementName)}`);
        const data = await response.json();
        return data.departement;
    }catch (error){
        console.error(error);
        return null
    }
}