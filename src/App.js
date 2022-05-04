import * as React from "react";
import * as Navigation from "./Core/navigation/app";

import HistoryScene from "./scenes/history";
import ShadowDom from "./Components/ShadowDom";

import { useOnWindowBlur } from "./Common/hooks";

// const useOg = () => {
//   const [og, setOg] = React.useState({ image: null, title: null });
//   React.useEffect(() => {
//     const getMeta = () => {
//       let meta = {};

//       if (document.querySelector("meta[property='og:image']")) {
//         meta.image = document
//           .querySelector("meta[property='og:image']")
//           .getAttribute("content");
//       }

//       if (document.querySelector("link[rel~='icon']")) {
//         meta.favicon = document
//           .querySelector("link[rel~='icon']")
//           .getAttribute("href");
//       }

//       return meta;
//     };

//     let meta = getMeta();
//     setOg({ image: meta.image, favicon: meta.favicon });
//   }, []);
//   return og;
// };

function App() {
  // const [checkLink, setCheckLink] = React.useState({
  //   uploaded: false,
  //   data: null,
  // });
  // React.useEffect(() => {
  //   let handleMessage = (event) => {
  //     if (
  //       event.data.type === "CHECK_LINK" &&
  //       event.data.data.decorator === "LINK_FOUND"
  //     ) {
  //       setCheckLink({ uploaded: true, data: event.data.data });
  //     }
  //   };

  //   window.addEventListener("message", handleMessage);

  //   return () => window.removeEventListener("message", handleMessage);
  // }, []);

  // const og = useOg();

  useOnWindowBlur(Navigation.closeExtensionJumper);

  return (
    <div style={{ all: "initial" }}>
      <ShadowDom>
        <HistoryScene />
      </ShadowDom>
    </div>
  );
}

export default App;
