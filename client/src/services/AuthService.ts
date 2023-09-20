// This service handles authentication communication with the BE server
// also handles the storage of the JSON token in localStorage

import axios from 'axios';
import createAuthRefreshInterceptor, { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh';

import { authConfig } from './axiosConfig';
import axiosApiInstance from './ApiService';
import { EditableUserProfile, LoginResponse, UserProfile } from '../types';

const axiosAuthInstance = axios.create(authConfig);

const localStorageTokenKeys = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
};

const refreshTokenURL = '/refresh-token';

const formatAuthorizationHeader = (token: string) => `Bearer ${token}`;

let authRequestInterceptors: number | null = null;
let authResponseInterceptors: number | null = null;

const setAuthRequestInterceptors = () => {
  // console.log('[setAuthRequestInterceptors] setting auth interceptors...');
  authRequestInterceptors = axiosApiInstance.interceptors.request.use(config => {
    const { accessToken } = AuthService.getAuthTokens();
    if (accessToken) {
      config.headers.Authorization = formatAuthorizationHeader(accessToken);
    }

    return config;
  });
  // console.log('[setAuthRequestInterceptors] auth interceptors set');
};

const setAuthResponseInterceptors = (logout: () => void) => {
  // Instantiate the interceptor
  authResponseInterceptors = createAuthRefreshInterceptor(axiosApiInstance, async error => {
    const { refreshToken: oldRefreshToken } = AuthService.getAuthTokens();
    try {
      if (!oldRefreshToken) throw new Error();

      const res = await AuthService.refreshToken(oldRefreshToken);
      const { accessToken, refreshToken } = res.data;
      AuthService.setAuthTokens(accessToken, refreshToken);
      error.response.config.headers['Authorization'] = formatAuthorizationHeader(accessToken);
      return Promise.resolve();
    } catch (e) {
      logout();
      return;
    }
  });
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
  setAuthTokens: (accessToken: string, refreshToken: string) => {
    // console.log('[setAuthTokens] setting auth tokens in localStorage...');
    localStorage.setItem(localStorageTokenKeys.accessToken, accessToken);
    localStorage.setItem(localStorageTokenKeys.refreshToken, refreshToken);
    // console.log('[setAuthTokens] auth tokens set in localStorage');
  },

  getAuthTokens: () => {
    return {
      accessToken: localStorage.getItem(localStorageTokenKeys.accessToken),
      refreshToken: localStorage.getItem(localStorageTokenKeys.refreshToken),
    };
  },

  clearAuthTokens: () => {
    // console.log('[clearAuthTokens] removing auth tokens from localStorage...');

    localStorage.removeItem(localStorageTokenKeys.accessToken);
    localStorage.removeItem(localStorageTokenKeys.refreshToken);
    // console.log('[clearAuthTokens] auth tokens removed from localStorage');
  },

  login: async (username: string, password: string) => {
    // console.log('[login] fetching auth tokens...');
    const loginResponse = await axiosAuthInstance.post<LoginResponse>('/login', {
      username,
      password,
    });

    const { accessToken, refreshToken } = loginResponse.data;
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

    AuthService.setAuthTokens(accessToken, refreshToken);

    return loginResponse.data;
  },

  register: async (username: string, email: string, password: string, recaptchaToken: string) => {
    const registerResponse = await axiosAuthInstance.post<LoginResponse>('/register', {
      username,
      email,
      password,
      recaptchaToken,
    });

    const { accessToken, refreshToken } = registerResponse.data;
    AuthService.setAuthTokens(accessToken, refreshToken);

    return registerResponse.data;
  },

  authenticate: (logout: () => void) => {
    // console.log('[authenticate] authenticating...');
    const { accessToken } = AuthService.getAuthTokens();

    if (accessToken) {
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

    return accessToken;
  },

  refreshToken: (refreshToken: string) =>
    axiosAuthInstance.post<{ accessToken: string; refreshToken: string }>(
      refreshTokenURL,
      { refreshToken },
      {
        skipAuthRefresh: true,
      } as AxiosAuthRefreshRequestConfig
    ),

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
