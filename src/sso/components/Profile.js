import * as React from "react";
import { UserContext } from "./UserContext";
import { UserIcon } from "../../icons";
import { signOut } from "../utils/auth";
import Oback from "../../images/membership-logo-profile.png";
import styles from "./Profile.module.scss";

export const Profile = props => {
  const context = React.useContext(UserContext);
  const element = React.useRef(null);

  const firstName = context.user?.first_name;

  const backgroundImageStyle = {
    backgroundImage: `url(${Oback})`,
    backgroundPosition: "right bottom",
    backgroundRepeat: "no-repeat",
  };

  const handleClick = e => {
    if (element.current && !element.current.contains(e.target) && context.showProfile)
      context.dispatch({ type: "MODAL_PROFILE" });
  };

  const handleProfile = e => {
    e?.stopPropagation();
    e?.preventDefault();
    context.dispatch({ type: 'MODAL_PROFILE', showProfile: false });
    context.dispatch({ type: 'MODAL_PAGE', modalPage: "outsideProfile" });
  };

  const handleSignOut = async (e) => {
    e?.stopPropagation();
    e?.preventDefault();
    try {
      await signOut(context);
      context.dispatch({ type: 'USER_SIGNOUT' });
      context.dispatch({ type: 'MODAL_PROFILE', showProfile: false });
    } catch (error) {
      throw (error);
    }
  };

  React.useEffect(() => {
    // a click outside the modal closes it
    window.addEventListener("mousedown", handleClick);

    return () => {
      window.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <div className={styles.modal_overlay} ref={element} style={backgroundImageStyle}>
      <div className={styles.avatar}>
        <UserIcon width="50" height="50" />
      </div>

      <div className={styles.name}>
        Hello{!!firstName && `, ${firstName}!`}
      </div>

      <div className={styles.links}>
        <span onClick={handleProfile}>My Profile</span>
        <span onClick={handleSignOut}>Sign Out</span>
      </div>
    </div>
  );
};
