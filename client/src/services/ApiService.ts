import axios from 'axios';

import { apiConfig } from './axiosConfig';

const axiosApiInstance = axios.create(apiConfig);

export default axiosApiInstance;
