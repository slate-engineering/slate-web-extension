import * as React from "react";

import { messages, savingStates, viewerInitialState } from "..";
import { useSavingState } from ".";

import JumperAuth from "../../../scenes/jumperAuth";

/* -------------------------------------------------------------------------------------------------
 * useSaving
 * -----------------------------------------------------------------------------------------------*/

const useSaving = () => {
  // NOTE(amine): optimistically update UI when saving new objects
  const { savedObjects, addToSavedObjects, removeFromSavedObjects } =
    useSavingState();

  React.useEffect(() => {
    const handleMessage = (event) => {
      let { data, type } = event.data;
      if (type === messages.savingStatus) {
        if (
          data.savingStatus === savingStates.start ||
          data.savingStatus === savingStates.done
        ) {
          addToSavedObjects(data.url);
          return;
        }

        if (data.savingStatus === savingStates.failed) {
          removeFromSavedObjects(data.url);
        }
        return;
      }
    };
    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const sendSaveLinkRequest = ({ url, title, favicon }) => {
    window.postMessage({ type: messages.saveLink, url, title, favicon }, "*");
  };

  return { savedObjects, saveLink: sendSaveLinkRequest };
};

/* -------------------------------------------------------------------------------------------------
 * Viewer Provider
 * -----------------------------------------------------------------------------------------------*/

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

  const { savedObjects, saveLink } = useSaving();

  const contextValue = React.useMemo(
    () => ({
      windows: state.windows,
      shouldSync: state.shouldSync,
      savedObjects,
      saveLink,
    }),
    [state, savedObjects]
  );

  if (!state.shouldRender) return null;

  //TODO(amine): change auth screen
  if (!state.isAuthenticated) return <JumperAuth />;

  return (
    <viewerContext.Provider value={contextValue}>
      {children}
    </viewerContext.Provider>
  );
};
