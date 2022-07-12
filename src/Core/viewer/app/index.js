import * as React from "react";

export const useSavingState = () => {
  // NOTE(amine): use to optimistically update UI when saving new objects
  const [savedObjects, setSavedObjects] = React.useState({});
  const addToSavedObjects = (url) => {
    setSavedObjects((prev) => ({
      ...prev,
      [url]: true,
    }));
  };
  const removeFromSavedObjects = (url) => {
    setSavedObjects((prev) => {
      delete prev[url];
      return { ...prev };
    });
  };

  return { savedObjects, addToSavedObjects, removeFromSavedObjects };
};
