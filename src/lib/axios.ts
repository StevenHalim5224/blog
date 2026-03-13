import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://brightmitten-us.backendless.app"
})