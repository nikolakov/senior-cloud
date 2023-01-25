import React, { useCallback, useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';

import AuthService from '../services/AuthService';
import axiosApiInstance from 'services/ApiService';
import { UserProfile, EditableUserProfile } from '../types';

export type AuthContextType = {
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    recaptchaToken: string
  ) => Promise<void>;
  token: string | null;
  profileInfo: UserProfile;
  updateProfileInfo: (profileInfo: EditableUserProfile) => Promise<void>;
  loading: boolean;
  isLoggedIn: boolean;
  logout: () => void;
};

export const AuthContext = React.createContext<AuthContextType>({} as AuthContextType);

export const AuthContextProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(AuthService.getAuthTokens().mainToken);
  const [profileInfo, setProfileInfo] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // const { i18n } = useTranslation();

  const logout = useCallback(() => {
    // console.log('logging out...');
    AuthService.logout();
    setToken(null);
    setProfileInfo(null);
    // console.log('cleared context state');
  }, []);

  const fetchProfileInfo = useCallback(async () => {
    // console.log('fetching profile info...');
    try {
      const res = await axiosApiInstance.get<UserProfile>('/profileInfo');
      (window as any).axiosApiInstance = axiosApiInstance;
      setProfileInfo(res.data);
      // console.log('profile info fetched');
      setLoading(false);
    } catch (e: any) {
      // console.log('fetching profile info failed');
      setLoading(false);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    // console.log('authenticating...');
    AuthService.authenticate(logout);
    if (token && !profileInfo) {
      fetchProfileInfo();
    } else {
      setLoading(false);
    }
  }, [token, fetchProfileInfo, logout, profileInfo]);

  // useEffect(() => {
  //   if (profileInfo) {
  //     // we have a profile info
  //     if (!profileInfo.language) {
  //       // there is no language set
  //       // get the language from i18n and update profile info
  //       updateProfileInfo({
  //         ...profileInfo,
  //         language: i18n.language,
  //       });
  //     } else {
  //       // there is a language
  //       if (i18n.language !== profileInfo.language) {
  //         // if the i18n language is different, update it to match profileInfo language
  //         i18n.changeLanguage(profileInfo.language);
  //       }
  //     }
  //   }
  // }, [profileInfo, i18n]);

  const login = async (username: string, password: string) => {
    const { token, user } = await AuthService.login(username, password);
    // setLoading(true);
    setProfileInfo(user);
    setToken(token);
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    recaptchaToken: string
  ) => {
    const { token, user } = await AuthService.register(username, email, password, recaptchaToken);

    setProfileInfo(user);
    setToken(token);
  };

  const isLoggedIn = !!(token && profileInfo);

  const updateProfileInfo = async (newProfileInfo: EditableUserProfile) => {
    const res = await AuthService.updateProfileInfo(
      (profileInfo as UserProfile).id,
      newProfileInfo
    );

    setProfileInfo(res.data);
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        register,
        token,
        profileInfo: profileInfo as UserProfile,
        updateProfileInfo,
        loading,
        isLoggedIn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
