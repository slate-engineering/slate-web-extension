import * as React from "react";

import { messages, viewerInitialState } from "..";

import JumperAuth from "../../../scenes/jumperAuth";

const viewerContext = React.createContext();

export const useViewer = () => React.useContext(viewerContext);

export const ViewerProvider = ({ children }) => {
  const [state, setState] = React.useState({
    ...viewerInitialState,
    shouldRender: false,
  });

  const fetchInitialData = () => {
    window.postMessage({ type: messages.loadViewerDataRequest }, "*");
  };
  React.useEffect(() => {
    const handleMessage = (event) => {
      let { data, type } = event.data;
      if (type === messages.loadViewerDataResponse) {
        setState((prev) => ({
          ...prev,
          ...data,
          //NOTE(amine): don't render the app till we recieve the viewer's initial data
          shouldRender: true,
        }));
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
    <viewerContext.Provider value={contextValue}>
      {children}
    </viewerContext.Provider>
  );
};
