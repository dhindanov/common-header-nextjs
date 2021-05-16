import * as React from "react";
import { RIVT_TOKEN_COOKIE_NAME } from "../constants";
import { UserContext } from "../components/UserContext";
import { signIn } from "../utils/auth";
import { setCookie } from "../utils/cookies";
import { ChevronLeft, Osignin } from "../../icons";
import { getCustomContent } from "../custom/customizations";
import Oback from "../../images/membership-logo.png";
import styles from "./SignIn.module.scss";

const defaultContent = {
  signInMessage: null,
}

export const SignIn = props => {
  const { propsEmail } = props;
  const context = React.useContext(UserContext);
  const element = React.useRef(null);
  const [errors, setErrors] = React.useState({});
  const [inputs, setInputs] = React.useState({
    email: propsEmail || "",
    password: "",
  });
  // TODO: validate email
  const [loginEnabled, setLoginEnabled] = React.useState(true);
  const customContent = getCustomContent(context.parentName) || defaultContent;

  const backgroundImageStyle = {
    backgroundImage: `url(${Oback})`,
    backgroundPosition: "right bottom",
    backgroundRepeat: "no-repeat",
  };

  const closeMe = () => context.dispatch({ type: "SHOW_SIGNIN", showSignIn: false });

  const handleStrayClick = e => {
    if (element.current && !element.current.contains(e.target)) closeMe();
  };

  const handleClose = e => {
    e?.stopPropagation();
    e?.preventDefault();
    closeMe();
    return false;
  };

  const handleSubmit = e => {
    e?.preventDefault();
    handleLogin(inputs.email, inputs.password);
  };

  // TODO: add validators
  const handleInputChange = e => {
    e?.persist();
    if (errors.login) {
      delete errors.login;
      setErrors(errors);
    }
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleLogin = async (email, password) => {
    try {
      const res = await signIn({ email, password }, context);
      if (res.key) {
        setCookie(RIVT_TOKEN_COOKIE_NAME, res.key);
        context.dispatch({ type: 'USER_SIGNIN', authToken: res.key });
        closeMe();
      }
    } catch (error) {
      setErrors({
        ...errors,
        login: "Incorrect email or password. Please retry or click Forgot Password.",
      });
      throw (error);
    }
  };

  const handleForgot = () => {
    context.dispatch({ type: 'SHOW_FORGOT_PASSWORD', showSignIn: false, showForgotPassword: true });
  }

  const handleRegister = () => {
    context.dispatch({ type: 'MODAL_PAGE', modalPage: "join" });
    closeMe();
  }

  React.useEffect(() => {
    // a click outside the modal closes it
    window.addEventListener("mousedown", handleStrayClick);

    return () => {
      window.removeEventListener("mousedown", handleStrayClick);
    };
  }, []);

  return (
    <div className={styles.modal_overlay} ref={element}>
      <div className={styles.inner} style={backgroundImageStyle}>
        <div className={styles.content}>
          <h2 className={styles.title}>
            <div className={styles.return} onClick={handleClose}>
              <ChevronLeft />
            </div>
            Sign in to Outside
          </h2>

          {customContent.signInMessage || null}

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.field_group}>
              <input
                placeholder="Email address"
                type="email"
                name="email"
                id="email"
                className={errors.login ? "error" : ""}
                value={inputs.email}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="email">Email address</label>
            </div>
            <div className={styles.field_group}>
              <input
                placeholder="Password"
                type="password"
                name="password"
                id="password"
                className={errors.login ? "error" : ""}
                value={inputs.password}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="password">Password</label>
            </div>

            {errors.login && (
              <p className={styles.label_error}>
                Incorrect email or password. Please retry or click Forgot
                Password.
              </p>
            )}

            <button type="submit" disabled={!loginEnabled} id="outside-header-signin-submit">
              <Osignin />
              Sign In
            </button>

            {!loginEnabled && (
              <p className={styles.label_error}>
                Logins temporarily unavailable, please try again later.
              </p>
            )}
          </form>

          <div className={styles.clicker} onClick={handleForgot}> Forgot Password? </div>

          <div className={styles.clicker} onClick={handleRegister}> Don't have an account? Join! </div>
        </div>
      </div>
    </div>
  );
};
