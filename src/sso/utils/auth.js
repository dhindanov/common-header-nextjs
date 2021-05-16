import { request } from "./request";
import { COMMON_HEADERS } from "../constants";

export const signIn = (data = {}, context = {}) => {
  const headers = { ...COMMON_HEADERS };
  return request(
    {
      data,
      headers,
      method: "post",
      url: "/auth/login/",
    },
    {
      apiKey: context.apiKey,
      apiHost: context.apiHost,
    }
  );
};

export const signOut = (context = {}) => {
  const headers = { ...COMMON_HEADERS };
  const data = {};
  return request(
    {
      data,
      headers,
      method: "post",
      url: "/auth/logout/",
    },
    {
      apiKey: context.apiKey,
      apiHost: context.apiHost,
    },
  );
};

export const getUserProfile = context => {
  return request(
    {
      method: "get",
      url: "/user/short-profile/",
    },
    {
      apiKey: context.apiKey,
      apiHost: context.apiHost,
      authToken: context.authToken,
    },
  );
};


export const resetPassword = (data = {}, context) => {
  const headers = { ...COMMON_HEADERS };
  return request(
    {
      data,
      headers,
      method: "post",
      url: "/auth/reset-password/",
    },
    {
      apiKey: context.apiKey,
      apiHost: context.apiHost,
    },
  );
};

export const forgotPassword = (data = {}, context) => {
  return request(
    {
      data,
      method: "post",
      url: "/auth/forgot-password/",
    },
    context,
  );
};
