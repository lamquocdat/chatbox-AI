import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { CONTENT_TYPE } from "../constants/HTTP.ts";

const baseURL = import.meta.env.MODE === 'development'
    ? '/api'
    : 'http://104.43.56.62:3000/api';

const interceptor = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": CONTENT_TYPE.APPLICATION_JSON,
    },
    // Tạm thời tắt withCredentials nếu server chưa config CORS đúng
    // withCredentials: true,
});

const onRequest = (
    config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("access_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
};

const onResponse = (response: any) => {
    return response;
};

const onErrorResponse = (error: AxiosError | Error) => {
    throw error;
};

interceptor.interceptors.request.use(onRequest);
interceptor.interceptors.response.use(onResponse, onErrorResponse);

export default interceptor;
