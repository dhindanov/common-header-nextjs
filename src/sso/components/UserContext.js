import React from "react";
import { RIVT_TOKEN_COOKIE_NAME } from "../constants";
import { getCookie, removeCookie, setCookie } from "../utils/cookies";
import { useParent } from "../hooks/parent";
import { getUserProfile } from "../utils/auth";

const reducer = (state, action) => {
  switch (action.type) {
    case "USER_PROFILE":
      return { ...state, user: action.user };
    case "USER_TOKEN":
      return { ...state, authToken: action.authToken };
    case "USER_SIGNIN":
      const data = {
        signin: new Date().getTime(),
        signout: false,
      };
      if (action.authToken) data.authToken = action.authToken;
      if (action.user?.uuid) data.user = action.user;
      return { ...state, ...data };
    case "USER_SIGNOUT":
      return {
        ...state,
        authToken: null,
        user: null,
        signin: false,
        signout: new Date().getTime(),
      };
    case "MODAL_PAGE":
      let showModal = action.showModal;
      if (showModal === undefined) showModal = !state.showModal;
      let modalPage = action.modalPage || state.modalPage;
      return { ...state, showModal, modalPage };
    case "MODAL_PROFILE":
      let showProfile = action.showProfile;
      if (showProfile === undefined) showProfile = !state.showProfile;
      return { ...state, showProfile };
    case "SHOW_SIGNIN":
      return { ...state, showSignIn: action.showSignIn };
    case "SHOW_RESET_PASSWORD":
      const { showResetPassword, passwordUid, passwordToken } = action;
      return { ...state, showResetPassword, passwordUid, passwordToken };
    default:
      return { ...state, ...action };
  }
};

export const UserContext = React.createContext();

export const UserProvider = props => {
  const { apiKey, apiHost, parentName, callback, caller, signinRole, children } = props;
  const authToken = getCookie(RIVT_TOKEN_COOKIE_NAME) || undefined;

  const initialState = {
    apiKey,
    apiHost,
    parentName,
    callback,
    signinRole,
    authToken: authToken,
    user: undefined,  // undefined until a profile request returns, null if logged out
    modalPage: "",
    signin: false,  // explicit signin call was made
    signout: false,  // explicit signout call was made
    showModal: false,  // shows related site in iframe
    showProfile: false,  // handles the circle profile icon
    showSignIn: false,  // handles the sign-in modal
  };

  const [context, dispatch] = React.useReducer(reducer, initialState);
  const parent = useParent(caller, context, dispatch);
  const [loading, setLoading] = React.useState(false);
  const uuid = React.useRef(null);  // string or undefined

  const log = (...args) => {
    console.log('..>', ...args);
  }

  const checkProfile = async () => {
    try {
      const { apiKey, apiHost, authToken } = context;
      const user = await getUserProfile({ apiKey, apiHost, authToken });
      if (user?.uuid) dispatch({ type: 'USER_PROFILE', user: user });
      if (user?.key) {
        setCookie(RIVT_TOKEN_COOKIE_NAME, user.key);
        dispatch({ type: 'USER_TOKEN', authToken: user.key });
      } else throw new Error('Not logged in');
    } catch (error) {
      dispatch({ type: 'USER_PROFILE', user: null });
      dispatch({ type: 'USER_TOKEN', authToken: null });
    } finally {
      setLoading(false);
    }
  };

  const onmessage = e => {
    // Handle messages from child iframes.
    try {
      const message = JSON.parse(e.data);

      switch (message?.action) {
        case "userProfile":
          e?.stopPropagation();
          if (context.signin) toggle(false);
          dispatch({ type: 'USER_PROFILE', user: message.user });
          break;
        case "userToken":
          e?.stopPropagation();
          dispatch({ type: 'USER_TOKEN', authToken: message.authToken });
          break;
        case "userSignIn":
          e?.stopPropagation();
          if (context.user?.uuid) toggle(false);
          dispatch({ type: 'USER_SIGNIN', authToken: message.authToken, user: message.user });
          break;
        case "userSignOut":
          e?.stopPropagation();
          dispatch({ type: 'USER_SIGNOUT' });
          toggle(false);
          break;
        case "modalClose":
          e?.stopPropagation();
          dispatch({ type: 'MODAL_PAGE', showModal: false });
          break;
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const value = React.useMemo(() => ({ ...context, dispatch, context }), [context, dispatch]);

  React.useEffect(() => {
    if (context.authToken !== undefined) {
      if (context.authToken) setLoading(true);
      else removeCookie(RIVT_TOKEN_COOKIE_NAME);
    }
  }, [context.signin, context.authToken]);

  React.useEffect(() => {
    if (context.signout) {
      const message = {
        action: "userSignout",
        user: null,
      };
      log("userSignout", context.user);
      context.callback?.(message);
    }
  }, [context.signout]);

  React.useEffect(() => {
    // When a user signs in or out, send user profile to parent website.
    if (context.user !== undefined) {
      if (context.user?.uuid !== uuid.current) {
        uuid.current = context.user?.uuid;
        const message = {
          action: "userProfile",
          user: context.user,
        };
        log("userProfile", context.user);
        context.callback?.(message);
      }
    }
  }, [context.user]);

  React.useEffect(() => {
    // handle messages from child iframe
    window.addEventListener("message", onmessage);

    return () => {
      window.removeEventListener("message", onmessage);
    };
  }, []);

  React.useEffect(() => {
    setLoading(true)
  }, []);

  React.useEffect(() => {
    if (loading) checkProfile();
  }, [loading]);

  return (
    <UserContext.Provider value={value}> {children} </UserContext.Provider>
  );
};
