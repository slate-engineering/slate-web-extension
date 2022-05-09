import * as React from "react";

export default function LinkPreview({ url, title, ...props }) {
  const ref = React.useRef();

  React.useEffect(() => {
    const iframe = ref.current;
    if (iframe) {
      iframe.contentWindow.location.replace(url);
    }
  }, [url]);

  return <iframe ref={ref} title={title} src="" {...props} />;
}
