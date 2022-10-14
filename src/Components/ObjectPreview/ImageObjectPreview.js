import * as React from "react";
import * as Styles from "~/common/styles";
import * as Utilities from "~/common/utilities";

import { AspectRatio } from "~/components/system";
import { Blurhash } from "react-blurhash";
import { isBlurhashValid } from "blurhash";
import { AnimatePresence, motion } from "framer-motion";
import { css } from "@emotion/react";
import { useCache } from "~/common/hooks";

import ObjectPreviewPrimitive from "~/components/ObjectPreview/ObjectPreviewPrimitive";

const STYLES_PLACEHOLDER_ABSOLUTE = css`
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
`;
const STYLES_FLUID_CONTAINER = css`
  ${Styles.CONTAINER_CENTERED};
  position: relative;
  width: 100%;
  height: 100%;
`;

const STYLES_IMAGE = css`
  object-fit: cover;
  height: 100%;
  width: 100%;
`;

const ImagePlaceholder = ({ blurhash, ...props }) => (
  <motion.div css={STYLES_PLACEHOLDER_ABSOLUTE} {...props}>
    <div css={STYLES_FLUID_CONTAINER}>
      <AspectRatio ratio={1}>
        <div>
          <Blurhash
            hash={blurhash}
            height="100%"
            width="100%"
            resolutionX={32}
            resolutionY={32}
            punch={1}
          />
        </div>
      </AspectRatio>
    </div>
  </motion.div>
);

export default function ImageObjectPreview({
  file,
  //NOTE(amine): ImageObjectPreview is used to display cover image for other objects, so we need to pass the tag down
  tag,
  ...props
}) {
  /** NOTE(amine):  To minimize the network load, we only load images when they're in view.
                    This creates an issue where cached images will reload each time they came to view. 
                    To prevent reloading we'll keep track of the images that already loaded */
  const [cache, setCache] = useCache();
  const isCached = cache[file.cid];

  const { type, coverImage } = file;
  const imgTag = type.split("/")[1];
  const imageUrl = Utilities.getImageUrlIfExists(file);
  const blurhash = React.useMemo(() => {
    return file.blurhash && isBlurhashValid(file.blurhash).result
      ? file.blurhash
      : coverImage?.blurhash && isBlurhashValid(coverImage?.blurhash).result
      ? coverImage?.blurhash
      : null;
  }, [file]);

  const [isLoading, setLoading] = React.useState(true);
  const handleOnLoaded = () => (
    setCache({ key: file.cid, value: true }), setLoading(false)
  );
  const shouldShowPlaceholder = !isCached && isLoading && !!blurhash;

  return (
    <ObjectPreviewPrimitive file={file} tag={tag || imgTag} isImage {...props}>
      <div css={STYLES_FLUID_CONTAINER}>
        <img
          css={STYLES_IMAGE}
          src={imageUrl}
          alt={`${file?.name || file.filename} preview`}
          onLoad={handleOnLoaded}
        />
        <AnimatePresence>
          {shouldShowPlaceholder && (
            <ImagePlaceholder
              blurhash={blurhash}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
      </div>
    </ObjectPreviewPrimitive>
  );
}
