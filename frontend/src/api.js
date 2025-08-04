// intersepter intercept the request we are gonna send and auto add the correct heads so we dont have to do it manually
// axios is for send network request to the server
// axios interceptors: when we send a request, it is gonna check if we have an access token and if we do it will automatically add it to the request so we can write it once \\

import axios from "axios";
import { ACCESS_TOKEN } from "./constants";


// we are gonna use api instead of default axios to send our requests and the authorisation to token will be automatically added for us
// axios is a library that allows us to send network requests to the server
// .create is a method that allows us to create a new instance of axios takes an object of options
// baseurl is the url of the backend server
// import.meta.env.VITE_API_URL is the url of the backend server

const apiUrl= "https://b9cb6fc7-3d26-46f7-9fdd-bb7788fa4977-dev.e1-us-east-azure.choreoapis.dev/adam-medical-record-syste/backend/v1"
const api = axios.create({
    // import everything specidied inside an envirometn variable file
baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL :apiUrl  ,

    })
    // api.interceptors.request.use is a method that allows us to intercept the request before it is sent
api.interceptors.request.use(
// config is the object that contains the request we are gonna send
//  (config) => {} is a function that takes the config object and returns the config object 
    (config) =>{
        // localStorage is a way to store data in the browser
        // getItem is a method that allows us to get the value of the key
        // ACCESS_TOKEN is the key we are gonna use to get the value of the access token
        const token = localStorage.getItem(ACCESS_TOKEN);
        
        if(token) { 
            // how to pass a jwt access token
            // config.headers.Authorization = `Bearer ${token}` is a way to pass the token to the server
            // ${} is a way to pass a variable to a string in javascript
            config.headers.Authorization = `Bearer ${token}`
        }
        // return the config object that contains the request we are gonna send
        // so that the request can be sent
        return config
    },

    (error)=> {
        // return a promise that is rejected
        return Promise.reject(error)
    }
)


export default api
