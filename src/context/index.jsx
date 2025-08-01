import { createContext, useContext } from "react";

const UrlContext = createContext({ user: { id: 1, name: "Demo User" } });

export const UrlState = () => useContext(UrlContext);

export const UrlProvider = ({ children }) => {
  const user = { id: 1, name: "Demo User" }; // dummy user
  return (
    <UrlContext.Provider value={{ user }}>
      {children}
    </UrlContext.Provider>
  );
};
