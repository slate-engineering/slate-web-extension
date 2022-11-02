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
    window.postMessage({ type: messages.loadViewerDataRequest }, "*");
  };

  React.useEffect(() => {
    const handleMessage = (event) => {
      let { data, type } = event.data;
      if (type === messages.loadViewerDataResponse) {
        setState((prev) => ({
          ...prev,
          ...data,
          //NOTE(amine): don't render the app till we receive the viewer's initial data
          shouldRender: true,
        }));
        return;
      }

      if (type === messages.updateViewer) {
        setState((prev) => ({ ...prev, ...data }));
        return;
      }
    };
    window.addEventListener("message", handleMessage);

    fetchInitialData();
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const createSlate = ({ objects, slateName }) => {
    window.postMessage({ type: messages.createSlate, objects, slateName }, "*");
  };

  const addObjectsToSlate = ({ objects, slateName }) => {
    window.postMessage(
      { type: messages.addObjectsToSlate, objects, slateName },
      "*"
    );
  };

  const removeObjectsFromSlate = ({ objects, slateName }) => {
    window.postMessage(
      { type: messages.removeObjectsFromSlate, objects, slateName },
      "*"
    );
  };

  const saveLink = ({ objects }) => {
    window.postMessage({ type: messages.saveLink, objects }, "*");
  };

  const removeObjects = ({ objects }) => {
    window.postMessage({ type: messages.removeObjects, objects }, "*");
  };

  const updateViewerSettings = ({
    isBookmarkSyncActivated,
    isRecentViewActivated,
    isFilesViewActivated,
    hasCompletedExtensionOBFirstStep,
    hasCompletedExtensionOBSecondStep,
    hasCompletedExtensionOBThirdStep,
  }) => {
    window.postMessage(
      {
        type: messages.updateViewerSettings,
        isBookmarkSyncActivated,
        isRecentViewActivated,
        isFilesViewActivated,
        hasCompletedExtensionOBFirstStep,
        hasCompletedExtensionOBSecondStep,
        hasCompletedExtensionOBThirdStep,
      },
      "*"
    );
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

  //TODO(amine): change auth screen
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

  React.useEffect(() => {
    const getSources = () => {
      window.postMessage({ type: messages.getSavedLinksSourcesRequest }, "*");
    };

    const handleMessage = (event) => {
      let { data, type } = event.data;
      if (type === messages.getSavedLinksSourcesResponse) {
        setSources(data);
        return;
      }
    };

    window.addEventListener("message", handleMessage);

    getSources();
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return sources;
};
