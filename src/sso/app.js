import React from "react";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./components/UserContext";
import { Header } from "./components/Header";

export const App = (props) => (
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider {...props}>
        <Header />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
