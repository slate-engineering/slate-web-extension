import * as React from "react";

import { messages, appInitialState } from "../";

import JumperAuth from "../../../scenes/jumperAuth";

const DataPreloaderContext = React.createContext();

export const useDataPreloader = () => React.useContext(DataPreloaderContext);

export const DataPreloader = ({ children }) => {
  const [state, setState] = React.useState({
    ...appInitialState,
    shouldRender: false,
  });

  const fetchInitialData = () => {
    window.postMessage({ type: messages.preloadInitialDataRequest }, "*");
  };
  React.useEffect(() => {
    const handleMessage = (event) => {
      let { data, type } = event.data;
      if (type === messages.preloadInitialDataResponse) {
        setState((prev) => ({ ...prev, ...data, shouldRender: true }));
        return;
      }
    };
    window.addEventListener("message", handleMessage);

    fetchInitialData();
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const contextValue = React.useMemo(
    () => ({ windows: state.windows, shouldSync: state.shouldSync }),
    [state]
  );

  if (!state.shouldRender) return null;

  if (!state.isAuthenticated) return <JumperAuth />;

  return (
    <DataPreloaderContext.Provider value={contextValue}>
      {children}
    </DataPreloaderContext.Provider>
  );
};

export const useWindows = () => ({
  ...useDataPreloader().windows,
});
