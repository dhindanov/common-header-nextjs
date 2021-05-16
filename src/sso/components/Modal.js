import * as React from "react";
import { pageUrls } from "../constants";
import { UserContext } from "./UserContext";
import { SignIn } from "./SignIn";
import { SignOut } from "./SignOut";
import NavCloseIcon from "../svg/NavCloseIcon.svg";
import styles from "./Modal.module.scss";

export const Modal = props => {
  const { page } = props;
  const [pageView, setPageView] = React.useState(null);
  const context = React.useContext(UserContext);
  const element = React.useRef(null);
  const frameref = React.useRef(null);
  const { apiKey, apiHost, authToken, parentName } = context;

  const handleClick = e => {
    if (element.current && !element.current.contains(e.target))
      context.dispatch({ type: 'MODAL_PAGE', showModal: false });
  };

  const handleClose = e => {
    e?.stopPropagation();
    e?.preventDefault();
    context.dispatch({ type: 'MODAL_PAGE', showModal: false });
    return false;
  };

  const frameLoad = () => {
    if (frameref && frameref.current) {
      const message = {
        apiKey: context.apiKey,
        apiHost: context.apiHost,
        authToken: context.authToken,
        topic: "hostConfig",
      };
      frameref.current.contentWindow.postMessage(JSON.stringify(message), "*");
    }
  };

  const loadFrame = url => {
    return (
      <iframe
        src={url}
        sandbox="allow-forms allow-modals allow-scripts allow-same-origin allow-popups allow-top-navigation"
        loading="lazy"
        height="100%"
        width="100%"
        className={styles.iframe}
        onLoad={frameLoad}
        ref={frameref}
      ></iframe>
    );
  };

  React.useEffect(() => {
    // A click outside the modal closes it.
    window.addEventListener("mousedown", handleClick);

    return () => {
      window.removeEventListener("mousedown", handleClick);
    };
  }, []);

  React.useEffect(() => {
    switch (page) {
      case "signin":
        setPageView(<SignIn />);
        break;
      default:
        // Remove null and undefined from parameters.
        const p = Object.entries({ apiKey, apiHost, authToken, parentName }).reduce((o, [k, v]) => (
          v == null ? o : (o[k] = v, o)
        ), {});
        const params = new URLSearchParams(p).toString();
        const url = pageUrls[page] + `?${params}`;
        setPageView(loadFrame(url));
        break;
    }
    // Dependence only on page.
  }, [page]);

  return (
    <div className={styles.modal_overlay} ref={element}>
      <button
        data-prevent-default
        className={styles.modal_close}
        onClick={handleClose}
        id="outside-modal-close"
      >
        <NavCloseIcon />
      </button>

      <div className={styles.modal_inner}>{pageView}</div>
    </div>
  );
};
