import axios from 'axios';

const AxiosWithAuth = () => {
    const token = localStorage.getItem('token') || '';
    return axios.create({
        baseURL: process.env.REACT_APP_BACKEND,
        headers: {

            'authorization': `${token}`,
            'Content-Type': 'application/json'
        }
    });
};

export default AxiosWithAuth;