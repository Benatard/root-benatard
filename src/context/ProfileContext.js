import React, { createContext, useContext, useCallback } from 'react';
import useResource from '../hooks/useResource';
import { profileAPI } from '../service/api';

const ProfileContext = createContext({ profile: null, loading: true, error: null, refresh: async () => null });

export function ProfileProvider({ children }) {
  const { data: profile, setData, loading, error } = useResource(profileAPI.get);

  const refresh = useCallback(async () => {
    const result = await profileAPI.get();
    setData(result);
    return result;
  }, [setData]);

  return (
    <ProfileContext.Provider value={{ profile, loading, error, refresh }}>{children}</ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);