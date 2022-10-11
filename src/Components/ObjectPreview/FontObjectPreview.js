import * as React from "react";
import * as Styles from "~/common/styles";
import * as Utilities from "~/common/utilities";
import * as Strings from "~/common/strings";

import { css } from "@emotion/react";

import ObjectPreviewPrimitive from "~/components/ObjectPreview/ObjectPreviewPrimitive";

const STYLES_TEXT_PREVIEW = (theme) => css`
  position: relative;
  height: 100%;
  margin: 8px;
  background-color: ${theme.system.white};
  border-radius: 8px;
  box-shadow: ${theme.shadow.large};
`;

const STYLES_LETTER = (theme) => css`
  overflow: hidden;
  font-size: ${theme.typescale.lvl8};
`;

let SLATES_LOADED_FONTS = [];

export const useFont = ({ cid }, deps) => {
  const url = Strings.getURLfromCID(cid);
  const [fetchState, setFetchState] = React.useState({
    loading: false,
    error: null,
  });
  const prevName = React.useRef(cid);

  if (typeof window !== "undefined" && !window.$SLATES_LOADED_FONTS) {
    SLATES_LOADED_FONTS = [];
  }
  const alreadyLoaded =
    (typeof window !== "undefined" && SLATES_LOADED_FONTS.includes(cid)) ||
    false;

  React.useEffect(() => {
    if (!window) return;

    if (alreadyLoaded) {
      setFetchState((prev) => ({ ...prev, error: null }));
      return;
    }

    setFetchState((prev) => ({ ...prev, error: null, loading: true }));
    const customFonts = new FontFace(cid, `url(${url})`);
    customFonts
      .load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        prevName.current = cid;

        setFetchState((prev) => ({ ...prev, loading: false }));
        window.$SLATES_LOADED_FONTS.push(cid);
      })
      .catch((err) => {
        setFetchState({ loading: false, error: err });
      });
  }, deps);

  return {
    isFontLoading: fetchState.loading,
    error: fetchState.error,
    // NOTE(Amine): show previous font while we load the new one.
    fontName: alreadyLoaded ? cid : prevName.current,
  };
};

export default function FontObjectPreview({ file, ...props }) {
  const { fontName } = useFont({ cid: file.cid }, [file.cid]);

  const tag = Utilities.getFileExtension(file.filename) || "font";
  return (
    <ObjectPreviewPrimitive tag={tag} file={file} {...props}>
      <div css={[Styles.CONTAINER_CENTERED, STYLES_TEXT_PREVIEW]}>
        <div style={{ fontFamily: fontName }}>
          <div css={STYLES_LETTER}>Aa</div>
        </div>
      </div>
    </ObjectPreviewPrimitive>
  );
}
