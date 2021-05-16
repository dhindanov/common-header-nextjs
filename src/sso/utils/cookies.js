import Cookies, { CookieAttributes } from "js-cookie";

const defaultOptions = {
  expires: 365,
  sameSite: "None",
  secure: true,
};

export const getCookie = cookieName => {
  return Cookies.get(cookieName);
};

export const setCookie = (cookieName, cookieValue) => {
  Cookies.remove(cookieName, defaultOptions);
  Cookies.set(cookieName, cookieValue, defaultOptions);
};

export const removeCookie = cookieName => {
  Cookies.remove(cookieName, defaultOptions);
};
