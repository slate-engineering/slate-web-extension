import * as React from "react";

import { getFavicon, DefaultFavicon } from "~/common/favicons";
import { isNewTab } from "~/common/utilities";

function ImgFavicon({ alt, src, style, ...props }) {
  const [isLoadingFailed, setIsLoadingFailed] = React.useState(false);
  const handleOnError = () => setIsLoadingFailed(true);

  if (isLoadingFailed) {
    return <DefaultFavicon style={style} {...props} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      width={16}
      height={16}
      style={{ display: "block", ...style }}
      onError={handleOnError}
      {...props}
    />
  );
}

function Favicon({ rootDomain, src, alt, ...props }) {
  if (isNewTab && src) {
    return <ImgFavicon src={src} alt={alt} {...props} />;
  }

  const FaviconLogo = getFavicon(rootDomain);
  return <FaviconLogo {...props} />;
}

export { Favicon };
