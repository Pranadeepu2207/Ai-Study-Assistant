import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    }
})

axiosInstance.interceptors.request.use(
    (confiq) => {
        const token = localStorage.getItem('token')
        if(token){
            confiq.headers.Authorization = `Bearer ${token}`
        }
        return confiq
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default axiosInstance