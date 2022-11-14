import * as React from "react";

import { messages, viewerInitialState } from "..";

import JumperAuth from "../../../scenes/jumperAuth";

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

  React.useEffect(() => {
    const handleMessage = (request) => {
      let { data, type } = request;
      if (type === messages.updateViewer) {
        setState((prev) => ({ ...prev, ...data }));
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);

  const createSlate = ({ objects, slateName }) => {
    chrome.runtime.sendMessage({
      type: messages.createSlate,
      objects,
      slateName,
    });
  };

  const addObjectsToSlate = ({ objects, slateName }) => {
    chrome.runtime.sendMessage({
      type: messages.addObjectsToSlate,
      objects,
      slateName,
    });
  };

  const removeObjectsFromSlate = ({ objects, slateName }) => {
    chrome.runtime.sendMessage({
      type: messages.removeObjectsFromSlate,
      objects,
      slateName,
    });
  };

  const saveLink = ({ objects }) => {
    chrome.runtime.sendMessage({
      type: messages.saveLink,
      objects,
    });
  };

  const removeObjects = ({ objects }) => {
    chrome.runtime.sendMessage({
      type: messages.removeObjects,
      objects,
    });
  };

  const updateViewerSettings = ({
    isBookmarkSyncActivated,
    isRecentViewActivated,
    isFilesViewActivated,
    hasCompletedExtensionOBFirstStep,
    hasCompletedExtensionOBSecondStep,
    hasCompletedExtensionOBThirdStep,
    shouldUseGridView,
  }) => {
    chrome.runtime.sendMessage({
      type: messages.updateViewerSettings,
      isBookmarkSyncActivated,
      isRecentViewActivated,
      isFilesViewActivated,
      hasCompletedExtensionOBFirstStep,
      hasCompletedExtensionOBSecondStep,
      hasCompletedExtensionOBThirdStep,
      shouldUseGridView,
    });
  };

  const contextValue = React.useMemo(
    () => ({
      ...state,
      saveLink,
      removeObjects,
      createSlate,
      addObjectsToSlate,
      removeObjectsFromSlate,
      updateViewerSettings,
    }),
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

/* -------------------------------------------------------------------------------------------------
 * useSources
 * -----------------------------------------------------------------------------------------------*/

export const useSources = () => {
  const [sources, setSources] = React.useState([]);

  const getSources = () => {
    chrome.runtime.sendMessage(
      { type: messages.getSavedLinksSourcesRequest },
      (response) => setSources(response)
    );
  };

  React.useEffect(getSources, []);

  return sources;
};
