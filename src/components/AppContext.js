import * as React from "react";

export const AppContext = React.createContext();

export const AppProvider = props => {
  const { children } = props;

  const [context, setContext] = React.useState({
    authToken: null,
    user: null,
  });

  const update = data => setContext({ ...context, ...data });

  const value = { ...context, update };

  return <AppContext.Provider value={value}> {children} </AppContext.Provider>;
};
