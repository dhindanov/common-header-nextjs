import * as React from "react";
import { RIVT_TOKEN_COOKIE_NAME } from "../constants";
import { signOut } from "../utils/auth";
import { removeCookie } from "../utils/cookies";

export var buttonCalls = {
};

export const setButtonCalls = calls => {
  buttonCalls = { ...buttonCalls, ...calls };
};

export const signout = (context, dispatch) => () => {
  try {
    signOut(context).then().catch();
    removeCookie(RIVT_TOKEN_COOKIE_NAME);
    dispatch({ type: 'USER_SIGNOUT' });
  } catch (error) {
    throw (error);
  }
}

export const useParent = (caller, context, dispatch) => {
  const [parent] = React.useState(caller);

  React.useEffect(() => {
    buttonCalls = { ...buttonCalls, ...parent.buttonCalls };
    parent.setButtonCalls = setButtonCalls;
    parent.signout = signout(context, dispatch);
  }, []);

  return parent;
};
