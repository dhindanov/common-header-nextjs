import { getCookie } from "../utils/cookies";

import {
  RIVT_TOKEN_COOKIE_NAME,
} from "../constants";
import { postItemToUserList } from "./user";

export const setBodyAttributes = () => {
  const { hash } = window.location;

  setAuthAttributes();

  document.body.classList.add(
    `js-rivt-path--${hash.replace("#", "").replace("/", "--")}`,
  );
};

export const isMemberGate = () => {
  return document.querySelector(".js-gated--paid-member") ? true : false;
};

export const isGate = () => {
  return document.querySelector(".js-gated") ? true : false;
};

export const setAuthAttributes = () => {
  if (getCookie(RIVT_TOKEN_COOKIE_NAME)) {
    document.body.classList.add("js-rivt-authenticated");
  } else {
    document.body.classList.remove("js-rivt-authenticated");
  }

  removeCurrentRoutePath();
};

export const closeMenu = () => {
  const menuTriggerEl = document.querySelector(".js-toggle--app-menu");
  if (menuTriggerEl) {
    menuTriggerEl.dispatchEvent(new Event("click"));
  }
};

export const closeRoute = () => {
  const currentRouteClassMatch =
    document.body.className.match(/js-rivt-path--\S*/);
  if (currentRouteClassMatch) {
    document.body.classList.remove(currentRouteClassMatch[0]);
  }
};

export const toggleRouteButton = (route, active) => {
  [...document.querySelectorAll("[data-rivt-route='" + route + "']")].forEach(
    el => {
      if (active === undefined) {
        el.classList.toggle("is-active");
      } else {
        el.classList.toggle("is-active", active);
      }
    },
  );
};

export const formatLink = (article, context, url) => {
  if (isExternalSource(article.source, context.siteName)) {
    return `${url}#_auth/${context.authToken}`;
  }
  return url;
};

export const isExternalSource = (source, siteName) => {
  if (source && siteName !== source) {
    return true;
  }
  return false;
};

export const countryToFlag = (isoCode, label) => {
  return typeof String.fromCodePoint !== "undefined"
    ? isoCode
        .toUpperCase()
        .replace(/./g, char =>
          String.fromCodePoint(char.charCodeAt(0) + 127397),
        ) +
        " " +
        label
    : label;
};

export const dateParser = dateString => {
  const parsedDate = new Date(Date.parse(dateString));
  return new Intl.DateTimeFormat("en-US").format(parsedDate);
};

export const getMemberStatus = membershipType => {
  return (
    membershipType.includes("paid_membership") ||
    membershipType.includes("trial_membership")
  );
};

// Speed up calls to hasOwnProperty
const hasOwnProperty = Object.prototype.hasOwnProperty;

export const isEmpty = obj => {
  // null and undefined are "empty"
  if (obj == null) {
    return true;
  }

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0) {
    return false;
  }
  if (obj.length === 0) {
    return true;
  }

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== "object") {
    return true;
  }

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (const key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      return false;
    }
  }

  return true;
};

export const simpleXOR = (x, y) => {
  return (x || y) && !(x && y);
};

// YYYY-MM-DD to MM/DD/YYYY
export const convertDateFormat = date => {
  const dateArray = date.split("-");
  if (dateArray.length === 3) {
    return `${dateArray[1]}/${dateArray[2]}/${dateArray[0]}`;
  }
  return getTodaysDate();
};

export const getTodaysDate = (apiFormat = false) => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0
  const yyyy = today.getFullYear();

  if (apiFormat) {
    return yyyy + "-" + mm + "-" + dd;
  }
  return mm + "/" + dd + "/" + yyyy;
};

export const isValidDateFromString = date => {
  // date is MM/DD/YYYY
  const dateArray = date.split("/");
  if (dateArray.length === 3 && !date.includes("_")) {
    // Mask will auto input a "_"
    const dd = parseInt(dateArray[1], 10);
    const mm = parseInt(dateArray[0], 10) - 1; // January is 0
    const yyyy = parseInt(dateArray[2], 10);

    return isValidDate(yyyy, mm, dd);
  }

  return false;
};

export const isDateInPast = date => {
  const dateInQuestion = new Date(date);
  const today = new Date();

  return dateInQuestion.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0);
};

export const isDateTooFarInFuture = (date, futureDayLimit) => {
  const dateInQuestion = new Date(date);
  const today = new Date();
  const futureLimit = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + futureDayLimit,
  );

  return dateInQuestion.setHours(0, 0, 0, 0) > futureLimit.setHours(0, 0, 0, 0);
};

export const isValidDate = (year, month, day) => {
  const d = new Date(year, month, day);
  return (
    d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
  );
};
