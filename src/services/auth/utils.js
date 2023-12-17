import * as AuthApi from "./api";

const SESSION_KEY = "wird.session";

export function isLogged() {
  return !!localStorage.getItem(SESSION_KEY);
}

export function deleteSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function saveSessionToLocalStorage(session) {
  const base64 = btoa(JSON.stringify(session));
  localStorage.setItem(SESSION_KEY, base64);
}

export function getSessionFromLocalStorage() {
  const base64 = localStorage.getItem(SESSION_KEY);
  if (!base64) return null;
  return JSON.parse(atob(base64));
}

export function saveUserToLocalStorage(user) {
  const session = getSessionFromLocalStorage();
  session.user = user;
  saveSessionToLocalStorage(session);
}

export async function getUser() {
  if (!isLogged()) return null;
  let {user} = getSessionFromLocalStorage();
  if (!user) {
    try {
      user = await AuthApi.currentUserInfo();
      saveUserToLocalStorage(user);
    } catch (e) {
      deleteSession();
      return null;
    }
  }
  return user;
}

export const login = async (username, password) => {
  const session = await AuthApi.getTokens(username, password);
  saveSessionToLocalStorage(session);
}

