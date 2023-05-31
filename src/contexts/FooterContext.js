import React, { useState, createContext } from "react";

const FooterContext = createContext({});
const FooterSetContext = createContext(undefined);

const FooterProvider = ({ children }) => {
  const [footerDetails, setFooterDetails] = useState({
    pageUrl: "myPage"
  });

  return (
    <FooterContext.Provider value={footerDetails}>
      <FooterSetContext.Provider value={setFooterDetails}>
        {children}
      </FooterSetContext.Provider>
    </FooterContext.Provider>
  );
};

export { FooterProvider, FooterContext, FooterSetContext };

