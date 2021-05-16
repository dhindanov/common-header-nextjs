import * as React from "react";
import * as parent from "../hooks/parent";
import { UserContext } from "./UserContext";
import { useUrlData } from "../hooks/useUrlData";
import { Modal } from "./Modal";
import { Profile } from "./Profile";
import { SignIn } from "./SignIn";
import OutsideLogo from "../svg/OutsideLogo.svg";
import UserIcon from "../svg/UserIcon.svg";
import styles from "./Header.module.scss";
// import MegaTrigger from "../svg/MegaTrigger.svg";  // Turned off per product request.

const ForgotPassword = React.lazy(() => import("./ForgotPassword").then(module => ({ default: module.ForgotPassword })));
const ResetPassword = React.lazy(() => import("./ResetPassword").then(module => ({ default: module.ResetPassword })));

export const Header = () => {
  const { context, dispatch } = React.useContext(UserContext);
  useUrlData(context, dispatch);

  const toggleProfile = () => {
    dispatch({ type: 'MODAL_PROFILE', showModal: !context.showModal });
  };

  const toggleSignIn = () => {
    dispatch({ type: 'SHOW_SIGNIN', showSignIn: !context.showSignIn });
  };

  const navModal = React.useCallback(page => e => {
    e?.stopPropagation();
    e?.preventDefault();
    // If parent told us what to do on this click, take assigned action.
    if (parent.buttonCalls[page]) parent.buttonCalls[page]();
    // Otherwise, use our action definitions.
    else {
      dispatch({ type: 'MODAL_PAGE', modalPage: page });
    }
    return false;
  }, []);

  return (
    <>
      <div className={styles.header}>
        <div className={styles.inner}>
          <div className={styles.left}>
            <div className={styles.logo}>
              <OutsideLogo />
            </div>

            {/*
            TODO: Ree-enable this once the mega modal is in.
            <div className={styles.mega}>
              <MegaTrigger onClick={navModal("join")} />
            </div>
            */}

            <ul className={styles.topnav} id="outside-header-links">
              <li>
                <a
                  data-analytics-event="click"
                  data-analytics-data='{"name": "Element Clicked", "props": { "domain": "<<analytics_vars.domain>>", "name": "top-nav-tv", "type": "link"}}'
                  href="http://www.outsidetv.com/"
                >
                  TV
                </a>
              </li>
              <li>
                <a
                  data-analytics-event="click"
                  data-analytics-data='{"name": "Element Clicked", "props": { "domain": "<<analytics_vars.domain>>", "name": "top-nav-podcasts", "type": "link"}}'
                  href="https://www.outsideonline.com/podcasts"
                >
                  Podcasts
                </a>
              </li>
              <li>
                <a
                  data-analytics-event="click"
                  data-analytics-data='{"name": "Element Clicked", "props": { "domain": "<<analytics_vars.domain>>", "name": "top-nav-maps", "type": "link"}}'
                  href="https://www.gaiagps.com"
                >
                  Maps
                </a>
              </li>
              <li id="outside-header-links-events">
                <a
                  data-analytics-event="click"
                  data-analytics-data='{"name": "Element Clicked", "props": { "domain": "<<analytics_vars.domain>>", "name": "top-nav-events", "type": "link"}}'
                  href="https://www.athletereg.com"
                >
                  Events
                </a>
              </li>
              <li>
                <a
                  data-analytics-event="click"
                  data-analytics-data='{"name": "Element Clicked", "props": { "domain": "<<analytics_vars.domain>>", "name": "top-nav-shop", "type": "link"}}'
                  href="https://www.getcairn.com"
                >
                  Shop
                </a>
              </li>
              <li>
                <a
                  data-analytics-event="click"
                  data-analytics-data='{"name": "Element Clicked", "props": { "domain": "<<analytics_vars.domain>>", "name": "top-nav-outside", "type": "link"}}'
                  href="https://plus.outsideonline.com/outsideplus/"
                >
                  Outside&#x2b;
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.right}>
            {!!context.user && (
              <div className={styles.userimg} onClick={toggleProfile} id="outside-header-profile">
                <UserIcon />
              </div>
            )}
            {context.user === null && (
              <>
                <button type="button" onClick={navModal("join")} id="outside-header-join" className={styles.gold}>Join Free</button>
                <button type="button" onClick={toggleSignIn} id="outside-header-signin">Sign In</button>
              </>
            )}
          </div>
        </div>
      </div>

      {context.showModal && <Modal page={context.modalPage} />}
      {context.showProfile && <Profile />}
      {context.showSignIn && <SignIn />}
      {context.showResetPassword && <React.Suspense fallback={null}> <ResetPassword /> </React.Suspense >}
      {context.showForgotPassword && <React.Suspense fallback={null}> <ForgotPassword /> </React.Suspense >}
    </>
  );
};
