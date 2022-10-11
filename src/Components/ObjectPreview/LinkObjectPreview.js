import * as React from "react";
import * as Styles from "~/common/styles";
import * as SVG from "~/common/svg";
import * as Constants from "~/common/constants";

import { P3 } from "~/components/system/Typography";
import { css } from "@emotion/react";
import { useImage } from "~/common/hooks";

import ObjectPreviewPrimitive from "~/components/ObjectPreview/ObjectPreviewPrimitive";
import LinkPlaceholder from "~/components/ObjectPreview/placeholders/Link";

const STYLES_CONTAINER = css`
  ${Styles.CONTAINER_CENTERED}
  height: 100%;
`;

const STYLES_SOURCE_LOGO = css`
  height: 12px;
  width: 12px;
  border-radius: 4px;
`;

const STYLES_PLACEHOLDER_CONTAINER = css`
  width: 100%;
  height: 100%;
  ${Styles.CONTAINER_CENTERED}
`;

const STYLES_SOURCE = css`
  transition: color 0.4s;
  max-width: 80%;
`;

const STYLES_LINK = (theme) => css`
  display: block;
  width: 100%;
  ${Styles.LINK}
  :hover small, .link_external_link {
    color: ${theme.semantic.textGrayDark};
  }

  .link_external_link {
    opacity: 0;
    transition: opacity 0.3s;
  }
  :hover .link_external_link {
    opacity: 1;
  }
`;

const STYLES_SMALL_IMG = css`
  max-width: 100%;
  height: auto;
  object-fit: cover;
`;

const STYLES_TAG_CONTAINER = (theme) => css`
  color: ${theme.semantic.textGray};
  ${Styles.HORIZONTAL_CONTAINER_CENTERED}
`;

export default function LinkObjectPreview({ file, ratio, ...props }) {
  const { linkImage, linkFavicon, linkSource } = file;

  const previewImgState = useImage({
    src: linkImage,
    maxWidth: Constants.grids.object.desktop.width,
  });
  const faviconImgState = useImage({ src: linkFavicon });

  const tag = (
    <a
      css={STYLES_LINK}
      href={file.url}
      target="_blank"
      rel="noreferrer"
      style={{ position: "relative" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div css={STYLES_TAG_CONTAINER}>
        {faviconImgState.error ? (
          <SVG.Link height={12} width={12} style={{ marginRight: 4 }} />
        ) : (
          <img
            src={linkFavicon}
            alt="Link source logo"
            style={{ marginRight: 4 }}
            css={STYLES_SOURCE_LOGO}
          />
        )}
        <P3 css={STYLES_SOURCE} as="small" color="textGray" nbrOflines={1}>
          {linkSource}
        </P3>
        <SVG.ExternalLink
          className="link_external_link"
          height={12}
          width={12}
          style={{ marginLeft: 4 }}
        />
      </div>
    </a>
  );

  return (
    <ObjectPreviewPrimitive file={file} tag={tag} {...props}>
      <div css={STYLES_CONTAINER}>
        {previewImgState.loaded &&
          (previewImgState.error ? (
            <div css={STYLES_PLACEHOLDER_CONTAINER}>
              <LinkPlaceholder ratio={ratio} />
            </div>
          ) : (
            <img
              src={linkImage}
              alt="Link preview"
              css={
                previewImgState.overflow ? STYLES_SMALL_IMG : Styles.IMAGE_FILL
              }
            />
          ))}
      </div>
    </ObjectPreviewPrimitive>
  );
}
