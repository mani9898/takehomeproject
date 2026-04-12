import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export const getAgencies = async () => {
    const response = await apiClient.get(`/agencies`);
    return response.data;
};

export const getAgencyMetrics = async (slug) => {
    const response = await apiClient.get(`/agencies/${slug}/metrics`);
    return response.data;
};

export const getComparison = async (slugsArray) => {
    const response = await apiClient.get(`/agencies/compare?slugs=${slugsArray.join(',')}`);
    return response.data;
};
