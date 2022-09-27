import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Constants from "~/common/constants";

const ModalsPortalContext = React.createContext({});

const useModalsPortalContext = () => React.useContext(ModalsPortalContext);

const ModalsPortalProvider = ({ children, defaultContainer, ...props }) => {
  const [container, setContainer] = React.useState(defaultContainer);

  const value = React.useMemo(
    () => ({
      container,
      setContainer,
    }),
    [container, setContainer]
  );

  return (
    <ModalsPortalContext.Provider value={value} {...props}>
      {children}
    </ModalsPortalContext.Provider>
  );
};

// NOTE(amine): you don't need this component if you pass defaultContainer prop to ModalsPortalProvider
const ModalsContainer = () => {
  const { setContainer } = useModalsPortalContext();
  return (
    <div
      ref={(node) => setContainer(node)}
      id={Constants.jumperSlateExtensionModalsPortal}
    />
  );
};

const ModalsPortal = ({ children }) => {
  const { container } = useModalsPortalContext();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!container) return;

  return mounted
    ? ReactDOM.createPortal(
        <div onClick={(e) => e.stopPropagation()}>{children}</div>,
        container
      )
    : null;
};

export {
  ModalsPortalProvider,
  ModalsPortal,
  ModalsContainer,
  useModalsPortalContext,
};
