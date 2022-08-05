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
    const handleMessage = (request) => {
      let { data, type } = request;
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
    chrome.runtime.onMessage.addListener(handleMessage);

    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);

  const sendSaveLinkRequest = ({ url, title, favicon }) => {
    chrome.runtime.sendMessage({
      type: messages.saveLink,
      url,
      title,
      favicon,
    });
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
    chrome.runtime.sendMessage(
      { type: messages.loadViewerDataRequest },
      (response) => {
        setState((prev) => ({
          ...prev,
          ...response,
          //NOTE(amine): don't render the app till we recieve the viewer's initial data
          shouldRender: true,
        }));
      }
    );
  };

  React.useLayoutEffect(() => {
    fetchInitialData();
  }, []);

  const { savedObjects, saveLink } = useSaving();

  const contextValue = React.useMemo(
    () => ({
      ...state,
      savedObjects,
      saveLink,
    }),
    [state, savedObjects]
  );

  if (!state.shouldRender) return null;

  if (!state.isAuthenticated) return <JumperAuth />;

  return (
    <viewerContext.Provider value={contextValue}>
      {children}
    </viewerContext.Provider>
  );
};
