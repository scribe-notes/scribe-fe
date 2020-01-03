import axios from 'axios';

const AxiosWithAuth = () => {
    const token = localStorage.getItem('token');
    console.log(token)
    return axios.create({
        
        headers: {

            'authorization': `${token}`,
            'Content-Type': 'application/json'
        }
    });
};

export default AxiosWithAuth;