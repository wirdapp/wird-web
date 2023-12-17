import Axios from "axios";
import {deleteSession, getSessionFromLocalStorage, saveSessionToLocalStorage} from "../services/auth/utils";

const apiUrl = process.env.REACT_APP_BASE_URL;

const axios = Axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  defaults: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      "Content-Type": "application/json",
    },
  }
});

export const SkipAuthHeader = ['/auth/login/', '/auth/registration/', '/auth/token/refresh/'];

export async function tryRefreshTokens(refreshToken) {
  const {data} = await axios.post("/token/refresh/", {
    refresh: refreshToken
  });

  return {token: data.access, refreshToken: data.refresh};
}

export const requestInterceptor = (config) => {
  if (SkipAuthHeader.includes(config.url)) return config;

  const {token} = getSessionFromLocalStorage();
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
}

export const errorInterceptor = async (error) => {
  // if not 401 error, reject normaly
  if (error.response.data?.code !== 'token_not_valid') return Promise.reject(error);

  // if not in SkipAuthHeader, reject normaly
  if (SkipAuthHeader.includes(error.config.url)) return Promise.reject(error);

  // if no refresh token, reject normaly
  const {refreshToken} = getSessionFromLocalStorage();
  if (!refreshToken) return Promise.reject(error);

  // if refresh token, try to refresh token
  try {
    const {token, refreshToken: newRefreshToken} = await tryRefreshTokens(refreshToken);
    saveSessionToLocalStorage(token, newRefreshToken);
    error.config.headers["Authorization"] = `Bearer ${token}`;
    return axios.request(error.config);
  } catch (e) {
    deleteSession();
    return Promise.reject(error);
  }
}


// axios.interceptors.request.use(requestInterceptor);
// axios.interceptors.response.use(undefined, errorInterceptor);

export default axios;