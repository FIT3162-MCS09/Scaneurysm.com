import API from './apiClient';

export const searchDoctors = async (email: string, firstName: string, lastName: string) => {
    try {
        const response = await API.get('/search/user/', {
            params: {
                email,
                first_name: firstName,
                last_name: lastName,
            },
        });
        return response.data.doctors; // Return only the doctors from the response
    } catch (error) {
        console.error('Error searching doctors:', error);
        throw error;
    }
};

export const searchPatients = async (email: string, firstName: string, lastName: string) => {
    try {
        const response = await API.get('/search/user/', {
            params: {
                email,
                first_name: firstName,
                last_name: lastName,
            },
        });
        return response.data.patients; // Return only the patients from the response
    } catch (error) {
        console.error('Error searching patients:', error);
        throw error;
    }
};