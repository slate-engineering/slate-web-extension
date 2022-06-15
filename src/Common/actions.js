import * as Constants from "../Common/constants";

const REQUEST_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

//NOTE(martina): used for calls to the server
const DEFAULT_OPTIONS = {
  method: "POST",
  headers: REQUEST_HEADERS,
  credentials: "include",
};

const returnJSON = async (route, options) => {
  try {
    const response = await fetch(route, options);
    const json = await response.json();

    return json;
  } catch (e) {
    if (e.name === "AbortError") return { aborted: true };
  }
};

export const hydrateAuthenticatedUser = async () => {
  return await returnJSON(`${Constants.uri.hostname}/api/hydrate`, {
    ...DEFAULT_OPTIONS,
  });
};
