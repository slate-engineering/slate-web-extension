import * as React from "react";
import * as Validations from "~/common/validations";
import * as Strings from "~/common/strings";
import * as Styles from "~/common/styles";
import * as Utilities from "~/common/utilities";

import { css } from "@emotion/react";

// Note(amine): placeholders
import PdfPlaceholder from "~/components/ObjectPreview/placeholders/PDF";
import VideoPlaceholder from "~/components/ObjectPreview/placeholders/Video";
import AudioPlaceholder from "~/components/ObjectPreview/placeholders/Audio";
import EbookPlaceholder from "~/components/ObjectPreview/placeholders/EPUB";
import KeynotePlaceholder from "~/components/ObjectPreview/placeholders/Keynote";
import CodePlaceholder from "~/components/ObjectPreview/placeholders/Code";
import Object3DPlaceholder from "~/components/ObjectPreview/placeholders/3D";
import FilePlaceholder from "~/components/ObjectPreview/placeholders/File";

// NOTE(amine): previews
import ImageObjectPreview from "~/components/ObjectPreview/ImageObjectPreview";
import TextObjectPreview from "~/components/ObjectPreview/TextObjectPreview";
import FontObjectPreview from "~/components/ObjectPreview/FontObjectPreview";
import LinkObjectPreview from "~/components/ObjectPreview/LinkObjectPreview";
import ObjectPreviewPrimitive from "~/components/ObjectPreview/ObjectPreviewPrimitive";

const ObjectPreview = ({ file, ...props }) => {
  const { type, isLink } = file;

  const url = Strings.getURLfromCID(file.cid);

  const PLACEHOLDER_RATIO = 1.3;

  if (isLink) {
    return (
      <LinkObjectPreview file={file} ratio={PLACEHOLDER_RATIO} {...props} />
    );
  }

  if (Validations.isPreviewableImage(type)) {
    return <ImageObjectPreview file={file} url={url} {...props} />;
  }

  if (type.startsWith("video/")) {
    const tag = type.split("/")[1];
    return (
      <PlaceholderWrapper tag={tag} file={file} {...props}>
        <VideoPlaceholder ratio={PLACEHOLDER_RATIO} />
      </PlaceholderWrapper>
    );
  }

  if (Validations.isPdfType(type)) {
    return (
      <PlaceholderWrapper tag="PDF" file={file} {...props}>
        <PdfPlaceholder ratio={PLACEHOLDER_RATIO} />
      </PlaceholderWrapper>
    );
  }

  if (type.startsWith("audio/")) {
    const tag = Utilities.getFileExtension(file.filename) || "audio";
    return (
      <PlaceholderWrapper tag={tag} file={file} {...props}>
        <AudioPlaceholder ratio={PLACEHOLDER_RATIO} />
      </PlaceholderWrapper>
    );
  }

  if (type === "application/epub+zip") {
    return (
      <PlaceholderWrapper tag="epub" file={file} {...props}>
        <EbookPlaceholder ratio={PLACEHOLDER_RATIO} />
      </PlaceholderWrapper>
    );
  }

  if (file.filename.endsWith(".key")) {
    return (
      <PlaceholderWrapper tag="keynote" file={file} {...props}>
        <KeynotePlaceholder ratio={PLACEHOLDER_RATIO} />
      </PlaceholderWrapper>
    );
  }

  if (Validations.isCodeFile(file.filename)) {
    const tag = Utilities.getFileExtension(file.filename) || "code";
    return (
      <PlaceholderWrapper tag={tag} file={file} {...props}>
        <CodePlaceholder ratio={PLACEHOLDER_RATIO} />
      </PlaceholderWrapper>
    );
  }

  if (Validations.isFontFile(file.filename)) {
    return <FontObjectPreview file={file} url={url} {...props} />;
  }

  if (Validations.isMarkdown(file.filename, type)) {
    return <TextObjectPreview file={file} url={url} {...props} />;
  }

  if (Validations.is3dFile(file.filename)) {
    return (
      <PlaceholderWrapper tag="3d" file={file} {...props}>
        <Object3DPlaceholder ratio={PLACEHOLDER_RATIO} />
      </PlaceholderWrapper>
    );
  }

  return (
    <PlaceholderWrapper tag="file" file={file} {...props}>
      <FilePlaceholder ratio={PLACEHOLDER_RATIO} />
    </PlaceholderWrapper>
  );
};

export default React.memo(ObjectPreview);

const STYLES_CONTAINER = css`
  height: 100%;
`;
const PlaceholderWrapper = ({ children, ...props }) => {
  return (
    <ObjectPreviewPrimitive {...props}>
      <div css={[Styles.CONTAINER_CENTERED, STYLES_CONTAINER]}>{children}</div>
    </ObjectPreviewPrimitive>
  );
};
