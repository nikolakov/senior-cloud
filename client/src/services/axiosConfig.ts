import { AxiosRequestConfig } from 'axios';

export const apiConfig: AxiosRequestConfig = {
  baseURL: '/api',
  timeout: 5000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export const authConfig: AxiosRequestConfig = {
  baseURL: '/auth',
  timeout: 5000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};
