import * as React from "react";
import * as Constants from "../Common/constants";

import { useSearchParams } from "react-router-dom";

export const ModalContext = React.createContext({});

const ModalProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const modalRoutes = Constants.routes.modal;
  const currentModalPage = searchParams.get(modalRoutes.key);

  const value = React.useMemo(() => {
    return {
      isHomeActive: currentModalPage === modalRoutes.values.home,
      isAccountActive: currentModalPage === modalRoutes.values.account,
      isShortcutsActive: currentModalPage === modalRoutes.values.shortcuts,

      navigateToHome: () => setSearchParams({ modal: modalRoutes.values.home }),
      navigateToAccount: () =>
        setSearchParams({ modal: modalRoutes.values.account }),
      navigateToShortcuts: () =>
        setSearchParams({ modal: modalRoutes.values.shortcuts }),
      closeModal: () => setSearchParams({}),

      pageData: {
        title: document.title,
        description: document.description,
        url: window.location.href,
      },
    };
  }, [currentModalPage]);

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export const useModalContext = () => React.useContext(ModalContext);

export default ModalProvider;
