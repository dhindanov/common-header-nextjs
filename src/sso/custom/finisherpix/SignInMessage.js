import React from "react";
import OutsideLogo from "../../svg/OutsideLogo.svg";
import styles from "./SignInMessage.module.scss";

export const SignInMessage = () => (
  <div className={styles.content}>
    <p className={styles.header}> <span>FinisherPix is now part of</span> <OutsideLogo /> </p>
    <p className={styles.message}>
      Sign in with your Outside account for rapid checkout.
      If you have an Outside+ account, your purchase may be eligible for discounts.
    </p>
  </div>
);
