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

export const createLink = async (data, options) => {
  return await returnJSON(`${Constants.uri.hostname}/api/data/create-link`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
    ...options,
  });
};

export const saveCopy = async (data, options) => {
  return await returnJSON(`${Constants.uri.hostname}/api/data/save-copy`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
    ...options,
  });
};

export const createSlate = async (data) => {
  return await returnJSON(`${Constants.uri.hostname}/api/slates/create`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const removeFileFromSlate = async (data) => {
  return await returnJSON(`${Constants.uri.hostname}/api/slates/remove-file`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const search = async (data) => {
  return await returnJSON(`${Constants.uri.hostname}/api/search/search`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};
