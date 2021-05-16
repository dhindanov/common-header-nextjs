import React from 'react';
import { useLocation } from 'react-router-dom';

const parseUrl = (urlString) => {
  const urlParams = new URLSearchParams(urlString.substr(1));
  const urlData = Object.fromEntries(urlParams);
  for (const [k, v] of Object.entries(urlData)) urlData[k] = v || null;
  return urlData;
};

export const useUrlData = (context, dispatch) => {
  const location = useLocation();

  React.useEffect(() => {
    // Reset password.
    if (location.hash.includes("_reset-password/")) {
      const [_, passwordUid, passwordToken] = location.hash.split("/");
      dispatch({ type: "SHOW_RESET_PASSWORD", showResetPassword: true, passwordUid, passwordToken });
    }
  }, [location]);

  return null;
};
