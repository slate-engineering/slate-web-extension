import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { getInitialUrl } from "./Utilities/navigation";

import { MemoryRouter } from "react-router-dom";

ReactDOM.render(
  <>
    <React.StrictMode>
      <MemoryRouter initialEntries={[getInitialUrl()]}>
        <App />
      </MemoryRouter>
    </React.StrictMode>
  </>,
  document.getElementById("modal-window-slate-extension")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
