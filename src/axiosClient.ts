import axios, { AxiosRequestConfig } from 'axios';

export const createAxiosInstance = (configs: AxiosRequestConfig) => axios.create({...configs});