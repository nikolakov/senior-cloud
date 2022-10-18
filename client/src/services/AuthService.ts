// This service handles authentication communication with the BE server
// also handles the storage of the JSON token in localStorage

import axios from 'axios';
// import createAuthRefreshInterceptor, { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh';

import { authConfig } from './axiosConfig';
import axiosApiInstance from './ApiService';
import { EditableUserProfile, LoginResponse, UserProfile } from '../types';

const axiosAuthInstance = axios.create(authConfig);

const localStorageTokenKeys = {
  mainToken: 'token',
  // refreshToken: 'refreshToken',
};

// const refreshTokenURL = '/auth/refresh-token';

const formatAuthorizationHeader = (token: string) => `Bearer ${token}`;

let authRequestInterceptors: number | null = null;
let authResponseInterceptors: number | null = null;

const setAuthRequestInterceptors = () => {
  // console.log('[setAuthRequestInterceptors] setting auth interceptors...');
  authRequestInterceptors = axiosApiInstance.interceptors.request.use(config => {
    const { mainToken } = AuthService.getAuthTokens();
    if (mainToken) {
      if (config.headers) {
        config.headers.Authorization = formatAuthorizationHeader(mainToken);
      } else {
        config.headers = {
          Authorization: formatAuthorizationHeader(mainToken),
        };
      }
    }

    return config;
  });
  // console.log('[setAuthRequestInterceptors] auth interceptors set');
};

const setAuthResponseInterceptors = (logout: () => void) => {
  authResponseInterceptors = axiosApiInstance.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        logout();
        // Add your logic to
        //  1. Redirect user to LOGIN
        //  2. Reset authentication from localstorage/sessionstorage
      }

      return Promise.reject(error);
    }
  );
  //   // Instantiate the interceptor
  //   createAuthRefreshInterceptor(axios, async error => {
  //     console.log(error.config.url);
  //     if (!error.config.url.includes(refreshTokenURL)) {
  //       const { refreshToken: oldRefreshToken } = AuthService.getAuthTokens();
  //       if (oldRefreshToken) {
  //         try {
  //           const res = await AuthService.refreshToken(oldRefreshToken);
  //           const { mainToken, refreshToken } = res.data;
  //           AuthService.setAuthTokens(mainToken, refreshToken);
  //           error.response.config.headers['Authorization'] = formatAuthorizationHeader(mainToken);
  //           return Promise.resolve();
  //         } catch (e) {
  //           logout();
  //           return;
  //         }
  //       }
  //     } else {
  //       logout();
  //       return;
  //     }
  //   });
};

const removeAuthRequestInterceptors = () => {
  // console.log('[removeAuthRequestInterceptors] removing auth interceptors...');
  if (authRequestInterceptors !== null) {
    axiosApiInstance.interceptors.request.eject(authRequestInterceptors);
    authRequestInterceptors = null;
    // console.log('[removeAuthRequestInterceptors] auth interceptors removed');
  }
  if (authResponseInterceptors !== null) {
    axiosApiInstance.interceptors.response.eject(authResponseInterceptors);
    authResponseInterceptors = null;
  }
};

const AuthService = {
  // setAuthTokens: (mainToken: string, refreshToken: string) => {
  //   // console.log('[setAuthTokens] setting auth tokens in localStorage...');
  //   localStorage.setItem(localStorageTokenKeys.mainToken, mainToken);
  //   localStorage.setItem(localStorageTokenKeys.refreshToken, refreshToken);
  //   // console.log('[setAuthTokens] auth tokens set in localStorage');
  // },

  setAuthTokens: (mainToken: string) => {
    // console.log('[setAuthTokens] setting auth tokens in localStorage...');
    localStorage.setItem(localStorageTokenKeys.mainToken, mainToken);
    // console.log('[setAuthTokens] auth tokens set in localStorage');
  },

  getAuthTokens: () => {
    return {
      mainToken: localStorage.getItem(localStorageTokenKeys.mainToken),
      // refreshToken: localStorage.getItem(localStorageTokenKeys.refreshToken),
    };
  },

  clearAuthTokens: () => {
    // console.log('[clearAuthTokens] removing auth tokens from localStorage...');

    localStorage.removeItem(localStorageTokenKeys.mainToken);
    // localStorage.removeItem(localStorageTokenKeys.refreshToken);
    // console.log('[clearAuthTokens] auth tokens removed from localStorage');
  },

  login: async (username: string, password: string) => {
    // console.log('[login] fetching auth tokens...');
    const loginResponse = await axiosAuthInstance.post<LoginResponse>('/login', {
      username,
      password,
    });

    const { token } = loginResponse.data;
    // console.log(
    //   '[login] auth tokens fetched: ' +
    //     token?.substring(0, 10) +
    //     '...' +
    //     token?.substring(token.length - 10)
    // +
    // ', ' +
    // refreshToken?.substring(0, 10) +
    // '...' +
    // refreshToken?.substring(refreshToken.length - 10)
    // );

    AuthService.setAuthTokens(token);

    return loginResponse.data;
  },

  register: async (username: string, email: string, password: string, recaptchaToken: string) => {
    const registerResponse = await axiosAuthInstance.post<LoginResponse>('/register', {
      username,
      email,
      password,
      recaptchaToken,
    });

    const { token } = registerResponse.data;
    AuthService.setAuthTokens(token);

    return registerResponse.data;
  },

  authenticate: (logout: () => void) => {
    // console.log('[authenticate] authenticating...');
    const { mainToken } = AuthService.getAuthTokens();

    if (mainToken) {
      // console.log(
      //   '[authenticate] auth token found in localStorage: ' +
      //     mainToken?.substring(0, 10) +
      //     '...' +
      //     mainToken?.substring(mainToken.length - 10)
      // );
      setAuthRequestInterceptors();
      setAuthResponseInterceptors(logout);
    } else {
      // console.log('[authenticate] auth token NOT found in localStorage');
    }

    return mainToken;
  },

  // refreshToken: (refreshToken: string) =>
  //   ApiService.post<{ mainToken: string; refreshToken: string }>(
  //     refreshTokenURL,
  //     { refreshToken },
  //     {
  //       skipAuthRefresh: true,
  //     } as AxiosAuthRefreshRequestConfig
  //   ),

  getProfileInfo: () => axiosApiInstance.get<UserProfile>('/profileInfo'),

  updateProfileInfo: (userId: string, newProfileInfo: EditableUserProfile) =>
    axiosApiInstance.patch<UserProfile>(`/users/${userId}`, newProfileInfo),

  logout: () => {
    // console.error('[logout] logging out...');
    AuthService.clearAuthTokens();
    removeAuthRequestInterceptors();
    // console.log('[logout] logout complete');
  },
};

export default AuthService;
