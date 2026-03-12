import axios from "axios";

const API = axios.create({
    baseURL: "https://dsa-dude.onrender.com",
    withCredentials: true,
});

export default API;
