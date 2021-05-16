import * as React from "react";
import "/styles/globals.scss";
import { AppProvider } from "/src/components/AppContext";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const App = ({ Component, pageProps }) => {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
};

export default App;
