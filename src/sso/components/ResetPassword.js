import React, { useState } from "react";
import { UserContext } from "./UserContext";
import { resetPassword } from "../utils/auth";
import { ChevronLeft, CheckMark } from "../../icons";
import Oback from "../../images/membership-logo.png";
import styles from "./ResetPassword.module.scss";

export const ResetPassword = () => {
  const { context, dispatch } = React.useContext(UserContext);
  const element = React.useRef(null);
  const [inputs, setInputs] = useState({
    new_password1: "",
    new_password2: "",
  });
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});
  const [showResetPasswordLink, setShowResetPasswordLink] = useState(false);

  const backgroundImageStyle = {
    backgroundImage: `url(${Oback})`,
    backgroundPosition: "right bottom",
    backgroundRepeat: "no-repeat",
  };

  const closeMe = () => {
    dispatch({ type: "SHOW_RESET_PASSWORD", showResetPassword: false });
    // dispatch({ type: "SHOW_SIGNIN", showSignIn: true });
  };

  const handleStrayClick = e => {
    if (element.current && !element.current.contains(e.target)) closeMe();
  };

  const handleClose = e => {
    e?.stopPropagation();
    e?.preventDefault();
    closeMe();
    return false;
  };

  const handleForgot = () => {
    dispatch({ type: 'MODAL_PAGE', modalPage: "forgotPassword" });
    closeMe();
  };

  const handleInputErrors = (error) => {
    const errors = {};
    errors.general = error?.data?.message || "";

    for (const [k, v] of Object.entries(error?.data?.details || {})) {
      if (k === "token" || k === "uid") {
        errors.general = "Your reset password link has expired, please request a new one below.";
        setShowResetPasswordLink(true);
      } else {
        const message = v[0].message;
        if (
          message.includes("too short") ||
          message.includes("lowercase character") ||
          message.includes("uppercase character") ||
          message.includes("numeric character")
        ) {
          errors[k] = "Your password must contain at least 8 characters, and it must contain 1 lowercase letter, 1 uppercase letter, and one number.";
        } else {
          errors[k] = message;
        }
      }
    }
    setErrors(errors);
  };

  const handleResetPassword = () => {
    resetPassword(
      {
        new_password1: inputs.new_password1,
        new_password2: inputs.new_password2,
        uid: context.passwordUid,
        token: context.passwordToken,
      },
      context,
    )
      .then(() => {
        setDone(true);
        setTimeout(() => closeMe(), 3000);
      })
      .catch((error) => {
        handleInputErrors(error);
      });
  };

  const handleInputChange = (evt) => {
    evt.persist();
    const [k, v] = [evt.target.name, evt.target.value];
    delete errors[k];
    delete errors.general;
    setErrors(errors);
    setInputs({ ...inputs, [k]: v });
  };

  const handleSubmit = evt => {
    evt?.preventDefault();
    handleResetPassword();
  };

  const viewReset = () => (
    <>
      <h2 className={styles.title}>
        <div className={styles.return} onClick={handleClose}>
          <ChevronLeft />
        </div>
        Last Step!
      </h2>

      <p className={styles.message}>Set a Password for Your Outside Accont:</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.field_group}>
          <input
            placeholder="Enter Password"
            type="password"
            name="new_password1"
            id="reset-password1"
            className={errors.new_password1 ? "error" : ""}
            value={inputs.new_password1}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="new_password1">Enter Password</label>
          {errors.new_password1 && <p className={styles.label_error}> {errors.new_password1} </p>}
        </div>
        <div className={styles.field_group}>
          <input
            placeholder="Re-enter Password"
            type="password"
            name="new_password2"
            id="reset-password2"
            className={errors.new_password2 ? "error" : ""}
            value={inputs.new_password2}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="new_password2">Re-enter Password</label>
          {errors.new_password2 && <p className={styles.label_error}> {errors.new_password2} </p>}
        </div>

        {errors.general && <p className={styles.label_error}> {errors.general} </p>}

        {showResetPasswordLink && (
          <div className={styles.clicker} onClick={handleForgot}> Request new reset password link </div>
        )}

        <button type="submit">
          Set Password &amp; Finish
        </button>
      </form>
    </>
  );

  const viewDone = () => (
    <>
      <h2 className={styles.title}>
        <div className={styles.return} onClick={handleClose}>
          <ChevronLeft />
        </div>
        <CheckMark width="28" height="20" fill="#EA2127" viewBox="0 -8 28 28"/>
        Password Reset Successful
      </h2>

      <p className={styles.message}>
        You've Successfully reset your password! Now you can login with your credentials.
      </p>
    </>
  );

  React.useEffect(() => {
    // A click outside the modal closes it.
    window.addEventListener("mousedown", handleStrayClick);

    return () => {
      window.removeEventListener("mousedown", handleStrayClick);
    };
  }, []);

  return (
    <div className={styles.modal_overlay} style={backgroundImageStyle} ref={element}>
      <div className={styles.content}>
        {done ? viewDone() : viewReset()}
      </div >
    </div >
  );
}
