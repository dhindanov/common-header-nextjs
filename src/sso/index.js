import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app";
import { API_KEY, API_HOST, PARENT_NAME, SELECTOR } from "./constants";

class OutsideLoginClass {
  constructor() {
    this.scriptOrigin = new URL(document.currentScript.src).origin;
    this.signinRole = document.currentScript.getAttribute("signin");

    // Dynamic path for chunk loading.
    __webpack_public_path__ = this.scriptOrigin + "/";

    this.defaults = {
      apiKey: API_KEY,
      apiHost: API_HOST,
      parentName: PARENT_NAME || window.location.hostname,
      selector: SELECTOR,
      caller: this,
      signinRole: this.signinRole,
      buttonCalls: {},
    };
  }

  start() {
  }

  init(config) {
    config = { ...this.defaults, ...config };
    let target = document.querySelector(config.selector);
    if (!!target) {

      this.apiKey = config.apiKey;
      this.apiHost = config.apiHost;
      this.parentName = config.parentName;
      this.selector = config.selector;
      this.signinRole = config.signinRole;
      this.buttonCalls = config.buttonCalls;

      ReactDOM.render(<App {...config} />, target);
      console.log("started OutsideLogin app in", config.selector);
    } else {
      console.error("could not find element", config.selector);
    }
  }

  // These methods are overridden after mount
  setButtonCalls(calls) {
    this.buttonCalls = { ...this.buttonCalls, ...calls }
  }

  signout() { }
}

if (!window.OutsideLogin) {
  const OutsideLogin = new OutsideLoginClass();
  window.OutsideLogin = OutsideLogin;
  OutsideLogin.start();
  console.log("OutsideLogin ready to be started");
}
