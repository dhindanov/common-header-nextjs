import * as React from "react";
import Head from "next/head";
import { AppContext } from "/src/components/AppContext";
import { API_KEY, API_HOST, PARENT_NAME, SELECTOR } from "../src/sso/constants";
import styles from "./demo.module.scss";

const Demo = () => {
  const context = React.useContext(AppContext);

  const callback = message => {
    console.log('callback:', message);

    switch (message?.action) {
      case "userProfile":
        // Can be sent without user taking any action
        context.update({
          user: message.user,
        });
        break;
      case "userSignIn":
        // The user took an action to sign in, noop in this example
        break;
      case "userSignOut":
        context.update({
          user: null,
        });
        break;
    }
  };

  const configureOutside = () => {
    if (window.OutsideLogin && window.OutsideLogin.apiKey != API_KEY) {
      const params = {
        apiKey: API_KEY,
        apiHost: API_HOST,
        parentName: PARENT_NAME || window.location.hostname,
        selector: SELECTOR,
        callback: callback,
      };
      window.OutsideLogin.init(params);
    }
  };

  // Demo: assignable button clicks:
  // const demoClicks = () => {
  //   window.OutsideLogin.setButtonCalls({
  //     join: () => console.log('join clicked'),
  //     signin: () => console.log('signin clicked'),
  //     profile: () => console.log('profile clicked'),
  //   });
  //   setTimeout(() =>
  //     window.OutsideLogin.setButtonCalls({
  //       join: null,
  //       signin: null,
  //       profile: null,
  //     }), 2000);
  // };

  const renderUser = () => {
    if (context.user) return (
      <>
        <h4>Inputs:</h4>
        <pre>
          selector: {SELECTOR} <br />
          apiKey: {API_KEY} <br />
          apiHost: {API_HOST} <br />
        </pre>

        <h4>Outputs:</h4>
        <pre>
          user: {JSON.stringify(context.user, null, 2)} <br />
        </pre>
      </>
    );
    return <img src="/OutsideSignin.svg" width="140px" height="30px" />;
  };

  React.useEffect(() => {
    configureOutside();
    window.addEventListener("load", configureOutside);
  }, []);

  return (
    <>
      <Head></Head>

      <div id="outside-header"></div>

      <div className={styles.main}>
        <h4> <span> SSO Demo: Login with Outside+</span> </h4>
        <div id="output" className={styles.output}>{renderUser()}</div>
      </div>

      <script src="/bundle.min.js"></script>
    </>
  );
};

export default Demo;
