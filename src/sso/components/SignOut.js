import * as React from "react";
import { RIVT_TOKEN_COOKIE_NAME } from "../constants";
import { UserContext } from "../components/UserContext";
import { signOut } from "../utils/auth";
import { removeCookie } from "../utils/cookies";
import styles from "./SignOut.module.scss";

export const SignOut = props => {
  const { toggle } = props;
  const context = React.useContext(UserContext);

  const handleLogout = async (e) => {
    e?.stopPropagation();
    e?.preventDefault();
    try {
      // Redundant but helps with sites that intercept the button click
      removeCookie(RIVT_TOKEN_COOKIE_NAME);
      // console.log('>> signout: removed cookie');
      // await new Promise(r => setTimeout(r, 2000));

      await signOut(context);
      // console.log('>> signout: logged out');
      // await new Promise(r => setTimeout(r, 2000));

      context.dispatch({ type: 'USER_SIGNOUT' });
      // console.log('>> signout: dispatched user change');
      // await new Promise(r => setTimeout(r, 2000));

      toggle();
    } catch (error) {
      throw (error);
    }
  };

  const handleProfile = () => context.dispatch({ type: "MODAL_PAGE", modalPage: "outsideProfile" });

  return (
    <>
      <div className={styles.content}>
        <div className={styles.inner}>
          <h2>You are signed in as</h2>
          <h4>{context.user?.email}</h4>

          <div>
            <button onClick={handleLogout} id="outside-header-signout">
              Sign out
            </button>

            <button onClick={toggle}>
              Stay signed in
            </button>

            <button onClick={handleProfile} id="outside-header-profile">
              Edit your profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
