// intersepter intercept the request we are gonna send and auto add the correct heads so we dont have to do it manually
// axios is for send network request to the server
// axios interceptors: when we send a request, it is gonna check if we have an access token and if we do it will automatically add it to the request so we can write it once \\

import axios from "axios";
import { ACCESS_TOKEN } from "./constants";


// we are gonna use api instead of default axios to send our requests and the autorisation to token will be automatically added for us
const api = axios.create({
    // import everything specidied inside an envirometn variable file
baseURL: import.meta.env.VITE_API_URL,

    })
api.interceptors.request.use(

    (config) =>{
        const token = localStorage.getItem(ACCESS_TOKEN);
        if(token) { 
            // how to pass a jwt access token
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error)=> {
        return Promise.reject(error)
    }
)


export default api