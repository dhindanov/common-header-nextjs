export const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
export const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
export const SELECTOR = process.env.NEXT_PUBLIC_SELECTOR || "#outside-header";
export const PARENT_NAME = process.env.NEXT_PUBLIC_PARENT_NAME;

export const UI_HOST = process.env.OUTSIDE_HOST;

export const RIVT_TOKEN_COOKIE_NAME = "_r_token";

export const pageUrls = {
  join: UI_HOST + "/outsideplus/#",
  signin: UI_HOST + "/outsideplus/#_login/",
  outsideProfile: UI_HOST + "/#_profile/information",
  forgotPassword: UI_HOST + "/#_forgot-password",
}

export const COMMON_HEADERS = {
  "Content-Type": "application/json",
};
