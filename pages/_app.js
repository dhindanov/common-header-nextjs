import * as React from "react";
import "/styles/globals.scss";
import { AppProvider } from "/src/components/AppContext";

const App = ({ Component, pageProps }) => {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
};

export default App;
