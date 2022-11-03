import * as React from "react";
import * as Styles from "~/common/styles";
import * as MultiSelection from "~/components/MultiSelection";

import { css } from "@emotion/react";
import { H5, P2, P3 } from "~/components/system/Typography";
import { AspectRatio } from "~/components/system";
import { motion, useAnimation } from "framer-motion";
import { useMounted, useCopyState } from "~/common/hooks";
import {
  SlatesButton,
  CopyButton,
  DeleteButton,
} from "~/components/ObjectPreview/components";
import {
  getRootDomain,
  mergeEvents,
  isNewTab,
  isUsingMac,
} from "~/common/utilities";
import { ShortcutsTooltip } from "~/components/Tooltip";
import { Checkbox } from "~/components/system";

import ImageObjectPreview from "~/components/ObjectPreview/ImageObjectPreview";

/* -----------------------------------------------------------------------------------------------*/

const STYLES_CONTROLS = css`
  ${Styles.HORIZONTAL_CONTAINER};
  position: absolute;
  top: 16px;
  width: 100%;
  padding: 0px 16px;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.2s;
`;

function Controls({
  onOpenSlatesJumper,
  onRemoveObject,
  isChecked,
  onCheck,
  isCopied,
  onCopy,
  withActions,
}) {
  const handleOnChecking = (e) => onCheck(e.target.checked);

  return (
    <>
      {/**  NOTE(amine): controls visibility handled by STYLES_WRAPPER*/}
      <motion.div id="object_preview_controls" css={STYLES_CONTROLS}>
        <ShortcutsTooltip
          label="Multi-select"
          keyTrigger="Shift Space"
          horizontal="right"
          yOffset={12}
          xOffset={-12}
        >
          <div style={{ marginRight: "auto" }}>
            <Checkbox
              className="object_checkbox"
              checked={isChecked}
              tabIndex="-1"
              onChange={handleOnChecking}
              style={{ display: isChecked && "block", flexShrink: 0 }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.preventDefault()}
            />
          </div>
        </ShortcutsTooltip>

        {withActions && (
          <div css={Styles.VERTICAL_CONTAINER}>
            <ShortcutsTooltip label="Delete" keyTrigger="delete">
              <DeleteButton tabIndex="-1" onClick={onRemoveObject} />
            </ShortcutsTooltip>

            <ShortcutsTooltip
              label="Tag"
              keyTrigger={isNewTab ? "T" : isUsingMac() ? "T / ⌥T" : "T/ Alt T"}
            >
              <SlatesButton
                tabIndex="-1"
                style={{ marginTop: 6 }}
                onClick={onOpenSlatesJumper}
              />
            </ShortcutsTooltip>

            <ShortcutsTooltip label="Copy" keyTrigger="C">
              <CopyButton
                tabIndex="-1"
                style={{ marginTop: 6 }}
                isCopied={isCopied}
                onClick={onCopy}
              />
            </ShortcutsTooltip>
          </div>
        )}
      </motion.div>
    </>
  );
}

/* -----------------------------------------------------------------------------------------------*/

const STYLES_WRAPPER = (theme) => css`
  ${Styles.BUTTON_RESET};
  position: relative;
  background-color: ${theme.semantic.bgLight};
  transition: box-shadow 0.2s;
  box-shadow: 0 0 0 1px ${theme.semantic.borderGrayLight}, ${theme.shadow.card};
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;

  :hover #object_preview_controls {
    opacity: 1;
  }
  :focus #object_preview_controls {
    opacity: 1;
  }

  :focus {
    box-shadow: 0 0 0 2px ${theme.system.teal};
  }
`;

const STYLES_DESCRIPTION = (theme) => css`
  position: relative;
  border-radius: 0px 0px 16px 16px;
  box-sizing: border-box;
  width: 100%;
  background-color: ${theme.semantic.bgLight};
`;

const STYLES_INNER_DESCRIPTION = (theme) => css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: ${theme.semantic.bgLight};
  padding: 9px 16px 0px;
  border-top: 1px solid ${theme.semantic.borderGrayLight};
`;

const STYLES_TAG = css`
  position: relative;
  display: flex;
  padding: 4px 16px 8px;
`;

const STYLES_PREVIEW = css`
  overflow: hidden;
  position: relative;
  flex-grow: 1;
`;

const STYLES_SELECTED_RING = (theme) => css`
  box-shadow: 0 0 0 2px ${theme.system.blue} !important;
`;

const STYLES_UPPERCASE = css`
  text-transform: uppercase;
`;

export default function ObjectPreviewPrimitive({
  children,
  tag = "FILE",
  file,
  onOpenSlatesJumper,
  onOpenUrl,
  onRemoveObject,
  owner,
  index,
  // NOTE(amine): internal prop used to display
  isImage,
  onKeyDown,
  onKeyUp,
}) {
  const {
    isMultiSelectMode,
    isIndexChecked,

    createHandleOnIndexCheckChange,
    createHandleKeyDownNavigation,
  } = MultiSelection.useMultiSelectionContext();

  const isChecked = React.useMemo(
    () => isIndexChecked(index),
    [index, isIndexChecked]
  );

  const { isCopied, handleCopying } = useCopyState(file.url);

  const handleOpenSlatesJumper = () => {
    onOpenSlatesJumper([
      {
        url: file.url,
        title: file.title,
        rootDomain: getRootDomain(file.url),
      },
    ]);
  };

  const handleOpenUrl = () => onOpenUrl({ urls: [file.url] });

  const handleKeyboardActions = (e) => {
    if (!withActions) return;

    if (e.code === "KeyT") {
      e.stopPropagation();
      handleOpenSlatesJumper();
      return;
    }

    if (e.code === "KeyC") {
      e.stopPropagation();
      handleCopying();
      return;
    }
  };

  const withActions = React.useMemo(() => {
    if (isMultiSelectMode) return false;
    return true;
  }, [isMultiSelectMode]);

  const description = file?.body;
  const { isDescriptionVisible, showDescription, hideDescription } =
    useShowDescription({
      disabled: !description,
    });

  const extendedDescriptionRef = React.useRef();
  const descriptionRef = React.useRef();

  const animationController = useAnimateDescription({
    extendedDescriptionRef: extendedDescriptionRef,
    descriptionRef: descriptionRef,
    isDescriptionVisible,
  });

  const { isLink } = file;

  const title = file.title || file.name || file.filename;

  if (file?.coverImage && !isImage && !isLink) {
    return <ImageObjectPreview file={file} owner={owner} tag={tag} />;
  }

  return (
    <button
      onClick={handleOpenUrl}
      css={[STYLES_WRAPPER, isChecked && STYLES_SELECTED_RING]}
      onKeyUp={mergeEvents(handleKeyboardActions, onKeyUp)}
      onKeyDown={mergeEvents(createHandleKeyDownNavigation(index), onKeyDown)}
    >
      <AspectRatio ratio={248 / 248}>
        <div css={Styles.VERTICAL_CONTAINER}>
          <Controls
            onOpenSlatesJumper={handleOpenSlatesJumper}
            onRemoveObject={onRemoveObject}
            url={file.url}
            isChecked={isChecked}
            onCheck={createHandleOnIndexCheckChange(index)}
            isCopied={isCopied}
            onCopy={handleCopying}
            withActions={withActions}
          />

          <div css={STYLES_PREVIEW}>{children}</div>

          <motion.article css={STYLES_DESCRIPTION}>
            <div style={{ position: "relative", paddingTop: 9 }}>
              <H5 as="h2" nbrOflines={1} style={{ visibility: "hidden" }}>
                {title?.slice(0, 5)}
              </H5>

              {description && (
                <div ref={descriptionRef}>
                  <P3
                    style={{ paddingTop: 3, visibility: "hidden" }}
                    nbrOflines={1}
                    color="textGrayDark"
                  >
                    {description?.slice(0, 5)}
                  </P3>
                </div>
              )}

              <motion.div
                css={STYLES_INNER_DESCRIPTION}
                initial={false}
                animate={isDescriptionVisible ? "hovered" : "initial"}
                variants={animationController.containerVariants}
                onMouseMove={showDescription}
                onMouseLeave={hideDescription}
              >
                <H5 as="h2" nbrOflines={1} color="textBlack" title={title}>
                  {title}
                </H5>
                {!isDescriptionVisible && (
                  <P3
                    style={{ paddingTop: 3 }}
                    nbrOflines={1}
                    color="textGrayDark"
                  >
                    {description}
                  </P3>
                )}
                {description && (
                  <div ref={extendedDescriptionRef}>
                    <P2
                      as={motion.p}
                      style={{ paddingTop: 3 }}
                      nbrOflines={7}
                      initial={{ opacity: 0 }}
                      color="textGrayDark"
                      animate={animationController.descriptionControls}
                    >
                      {description}
                    </P2>
                  </div>
                )}
              </motion.div>
            </div>

            <TagComponent tag={tag} />
          </motion.article>
        </div>
      </AspectRatio>
    </button>
  );
}

const TagComponent = ({ tag }) => (
  <div css={STYLES_TAG}>
    {typeof tag === "string" ? (
      <P3 as="small" css={STYLES_UPPERCASE} color="textGray">
        {tag}
      </P3>
    ) : (
      tag
    )}
  </div>
);

const useShowDescription = ({ disabled }) => {
  const [isDescriptionVisible, setShowDescription] = React.useState(false);
  const timeoutId = React.useRef();

  const showDescription = () => {
    if (disabled) return;

    clearTimeout(timeoutId.current);
    const id = setTimeout(() => setShowDescription(true), 200);
    timeoutId.current = id;
  };
  const hideDescription = () => {
    if (disabled) return;

    clearTimeout(timeoutId.current);
    setShowDescription(false);
  };

  return { isDescriptionVisible, showDescription, hideDescription };
};

const useAnimateDescription = ({
  extendedDescriptionRef,
  descriptionRef,
  isDescriptionVisible,
}) => {
  const descriptionHeights = React.useRef({
    extended: 0,
    static: 0,
  });

  React.useEffect(() => {
    const extendedDescriptionElement = extendedDescriptionRef.current;
    const descriptionElement = descriptionRef.current;
    if (descriptionElement && extendedDescriptionElement) {
      descriptionHeights.current.static = descriptionElement.offsetHeight;
      descriptionHeights.current.extended =
        extendedDescriptionElement.offsetHeight;
    }
  }, []);

  const containerVariants = {
    initial: {
      borderRadius: "0px",
      y: 0,
      transition: {
        type: "spring",
        stiffness: 170,
        damping: 26,
      },
    },
    hovered: {
      borderRadius: "16px",
      y:
        -descriptionHeights.current.extended +
        descriptionHeights.current.static,
      transition: {
        type: "spring",
        stiffness: 170,
        damping: 26,
      },
    },
  };
  const descriptionControls = useAnimation();

  useMounted(() => {
    const extendedDescriptionElement = extendedDescriptionRef.current;
    if (!extendedDescriptionElement) return;

    if (isDescriptionVisible) {
      extendedDescriptionElement.style.opacity = 1;
      descriptionControls.start({ opacity: 1, transition: { delay: 0.2 } });
      return;
    }

    extendedDescriptionElement.style.opacity = 0;
  }, [isDescriptionVisible]);

  return { containerVariants, descriptionControls };
};
