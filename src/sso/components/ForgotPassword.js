import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import { forgotPassword } from "../utils/auth";
import { ChevronLeft, CheckMark } from "../../icons";
import Oback from "../../images/membership-logo.png";
import styles from "./ForgotPassword.module.scss";

export const ForgotPassword = () => {
  const { context, dispatch } = useContext(UserContext);
  const element = React.useRef(null);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});
  const [inputs, setInputs] = useState({
    email: "",
  });

  const backgroundImageStyle = {
    backgroundImage: `url(${Oback})`,
    backgroundPosition: "right bottom",
    backgroundRepeat: "no-repeat",
  };

  const closeMe = () => {
    dispatch({ type: "SHOW_FORGOT_PASSWORD", showForgotPassword: false });
  };

  const handleStrayClick = e => {
    if (element.current && !element.current.contains(e.target)) closeMe();
  };

  const handleClose = e => {
    e?.stopPropagation();
    e?.preventDefault();
    closeMe();
  };

  const handleInputChange = (evt) => {
    evt.persist();
    const [k, v] = [evt.target.name, evt.target.value];
    delete errors[k];
    delete errors.general;
    setErrors(errors);
    setInputs({ ...inputs, [k]: v });
  };

  const handleInputErrors = (error) => {
    const errors = {};
    errors.general = error?.data?.message || "";

    for (const [k, v] of Object.entries(error?.data?.details || {})) {
      const message = v[0].message;
      errors[k] = message;
    }
    setErrors(errors);
  };

  const handleForgotPassword = () => {
    const customUrl = `${window.location.origin}/#_reset-password/{uid}/{token}/`;
    forgotPassword(
      {
        email: inputs.email,
        custom_url: customUrl,
      },
      context,
    )
      .then(() => {
        setDone(true);
        setTimeout(() => closeMe(), 5000);
      })
      .catch((error) => {
        handleInputErrors(error);
      });
  };

  const handleSubmit = evt => {
    evt?.preventDefault();
    handleForgotPassword();
  };

  const viewChange = () => (
    <>
      <h2 className={styles.title}>
        <div className={styles.return} onClick={handleClose}>
          <ChevronLeft />
        </div>
        Reset your password
      </h2>

      <p className={styles.message}>
        Enter your email address below and we'll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.field_group}>
          <input
            placeholder="Email Address"
            type="email"
            name="email"
            id="change-password-email"
            className={errors.email ? "error" : ""}
            value={inputs.email}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="email">Email Address</label>
          {errors.email && <p className={styles.label_error}> {errors.email} </p>}
        </div>

        {errors.general && <p className={styles.label_error}> {errors.general} </p>}

        <button type="submit">
          Send
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
        <CheckMark width="28" height="20" fill="#EA2127" viewBox="0 -8 28 28" />
        Email Sent
      </h2>

      <p className={styles.message}>
        We've sent an email to {inputs.email} with instructions on how to reset your password.
      </p>
    </>
  );

  React.useEffect(() => {
    // A click outside the modal closes it.
    window.addEventListener("pointerdown", handleStrayClick);

    return () => {
      window.removeEventListener("pointerdown", handleStrayClick);
    };
  }, []);

  return (
    <div className={styles.modal_overlay} ref={element}>
      <div className={styles.inner} style={backgroundImageStyle}>
        <div className={styles.content}>
          {done ? viewDone() : viewChange()}
        </div>
      </div>
    </div>
  );
}
