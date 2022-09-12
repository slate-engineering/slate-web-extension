import * as React from "react";
import * as Typography from "../Components/system/Typography";
import * as Styles from "../Common/styles";
import * as ListView from "../Components/ListView";
import * as SVG from "../Common/SVG";
import * as RovingTabIndex from "./RovingTabIndex";
import * as MultiSelection from "./MultiSelection";
import * as Constants from "../Common/constants";

import { css } from "@emotion/react";

import { defaultViews, viewsType } from "../Core/views";
import { Divider } from "./Divider";
import {
  Combobox,
  useComboboxNavigation,
} from "../Components/ComboboxNavigation";
import { useEscapeKey, useEventListener } from "Common/hooks";
import { motion, AnimateSharedLayout, AnimatePresence } from "framer-motion";
import {
  mergeRefs,
  mergeEvents,
  isNewTab,
  getRootDomain,
} from "../Common/utilities";
import { ShortcutsTooltip } from "../Components/Tooltip";
import { Favicon } from "../Components/Favicon";
import { useSlatesCombobox } from "../Components/EditSlates";
import { useSources as useJumperSources } from "../Core/viewer/app/jumper.js";
import { useSources as useNewTabSources } from "../Core/viewer/app/newTab";
const useSources = isNewTab ? useNewTabSources : useJumperSources;

import HistoryFeed from "./HistoryFeed";
import WindowsFeed from "./WindowsFeed";

/* -------------------------------------------------------------------------------------------------
 * Views Provider
 * -----------------------------------------------------------------------------------------------*/

const ViewsContext = React.createContext();
export const useViewsContext = () => React.useContext(ViewsContext);

const useHandleViewsNavigation = () => {
  const initialIndex = 0;
  const [selectedIdx, setSelectedIdx] = React.useState(initialIndex);

  const menuItemsRef = React.useRef({});
  const registerMenuItem = ({ index, onSubmitRef, ref }) => {
    menuItemsRef.current[index] = { index, onSubmitRef, ref };
  };
  const cleanupMenuItem = (index) => {
    if (index === selectedIdx) setSelectedIdx(initialIndex);
    delete menuItemsRef.current[index];
  };

  const menuElementRef = React.useRef();
  const registerMenuRef = (node) => (menuElementRef.current = node);
  const cleanupMenu = () => {
    setSelectedIdx(initialIndex);
    menuItemsRef.current = {};
    menuElementRef.current = undefined;
  };

  const applyElementSubmit = (index) => {
    menuItemsRef.current[index].onSubmitRef.current();
  };

  const isNavigatingViaKeyboard = React.useRef(true);
  const moveSelectionToNextElement = () => {
    isNavigatingViaKeyboard.current = true;

    const nextIndex = selectedIdx + 1;
    const elementExists = !!menuItemsRef?.current?.[nextIndex];
    const nextFocusedIndex = elementExists ? nextIndex : initialIndex;

    applyElementSubmit(nextFocusedIndex);
    setSelectedIdx(nextFocusedIndex);
  };

  const moveSelectionToPreviousElement = () => {
    isNavigatingViaKeyboard.current = true;

    const prevIndex = selectedIdx - 1;
    let prevFocusedIndex = null;
    if (prevIndex >= initialIndex) {
      prevFocusedIndex = prevIndex;
    } else {
      prevFocusedIndex = Math.max(...Object.keys(menuItemsRef.current));
    }
    applyElementSubmit(prevFocusedIndex);
    setSelectedIdx(prevFocusedIndex);
  };

  const moveSelectionOnClick = (index) => {
    setSelectedIdx(index);
  };

  const handleOnKeyDown = (e) => {
    if (e.altKey && e.shiftKey && e.key === "Tab") {
      moveSelectionToPreviousElement();

      e.stopPropagation();
      e.preventDefault();
      return;
    }

    if (e.altKey && e.key === "Tab") {
      moveSelectionToNextElement();

      e.stopPropagation();
      e.preventDefault();
    }
  };

  const scrollMenuToRightEdge = () => {
    const menuNode = menuElementRef.current;
    if (!menuNode) return;
    menuNode.scrollTo({ left: menuNode.scrollWidth });
  };

  const scrollMenuToLeftEdge = () => {
    const menuNode = menuElementRef.current;
    if (!menuNode) return;
    menuNode.scrollTo({ left: 0 });
  };

  useEventListener({ type: "keydown", handler: handleOnKeyDown }, [
    selectedIdx,
  ]);

  React.useLayoutEffect(() => {
    //NOTE(amine): don't scroll automatically when the user is navigating using a mouse
    if (!isNavigatingViaKeyboard.current) return;
    const menuNode = menuElementRef.current;
    const selectedNode = menuItemsRef.current[selectedIdx]?.ref?.current;
    if (!menuNode || !selectedNode) return;

    if (selectedIdx === 0) {
      menuNode.scrollTo({ left: 0 });
    }

    const lastIndex = Math.max(...Object.keys(menuItemsRef.current));
    if (selectedIdx === lastIndex) {
      menuNode.scrollTo({ left: menuNode.scrollWidth });
    }

    if (
      selectedNode.offsetLeft + selectedNode.offsetWidth >=
      menuNode.scrollLeft + menuNode.offsetWidth
    ) {
      menuNode.scrollTo({
        left: selectedNode.offsetLeft - selectedNode.offsetWidth,
      });
      return;
    }

    if (selectedNode.offsetLeft <= menuNode.scrollLeft) {
      const prevIndex = selectedIdx - 1;
      const prevNode = menuItemsRef.current[prevIndex]?.ref?.current;

      menuNode.scrollTo({
        left: prevNode ? prevNode.offsetLeft : selectedNode.offsetLeft,
      });
    }
  }, [selectedIdx]);

  return {
    registerMenuItem,
    cleanupMenuItem,

    registerMenuRef,
    cleanupMenu,

    scrollMenuToRightEdge,
    scrollMenuToLeftEdge,
    moveSelectionOnClick,
  };
};

function Provider({
  children,
  viewer,
  viewsFeed,
  appliedView,
  viewsType,
  getViewsFeed,
  createViewByTag,
  createViewBySource,
  isLoadingViewFeed,
  onRestoreFocus,
}) {
  const [isCreateMenuOpen, setCreateMenuVisibility] = React.useState(false);
  const openCreateMenu = () => setCreateMenuVisibility(true);
  const closeCreateMenu = () => setCreateMenuVisibility(false);
  const toggleCreateMenu = () => setCreateMenuVisibility((prev) => !prev);

  const {
    registerMenuItem,
    cleanupMenuItem,

    registerMenuRef,
    cleanupMenu,

    moveSelectionOnClick,
    scrollMenuToRightEdge,
    scrollMenuToLeftEdge,
  } = useHandleViewsNavigation();

  const handleOpenCreateMenuOnKeyDown = (e) => {
    if (e.key === "n") {
      openCreateMenu();

      e.stopPropagation();
      e.preventDefault();
      return;
    }
  };
  useEventListener({ type: "keydown", handler: handleOpenCreateMenuOnKeyDown });

  const value = React.useMemo(
    () => ({
      viewer,
      viewsFeed,
      appliedView,
      isLoadingViewFeed,
      viewsType,
      getViewsFeed,
      createViewByTag,
      createViewBySource,

      registerMenuItem,
      cleanupMenuItem,
      registerMenuRef,
      cleanupMenu,
      moveSelectionOnClick,
      scrollMenuToRightEdge,
      scrollMenuToLeftEdge,

      isCreateMenuOpen,
      openCreateMenu,
      closeCreateMenu,
      toggleCreateMenu,

      onRestoreFocus,
    }),
    [
      viewer,
      viewsFeed,
      appliedView,
      isLoadingViewFeed,
      viewsType,
      getViewsFeed,
      createViewByTag,
      createViewBySource,

      registerMenuItem,
      cleanupMenuItem,
      registerMenuRef,
      cleanupMenu,
      moveSelectionOnClick,
      scrollMenuToRightEdge,
      scrollMenuToLeftEdge,

      isCreateMenuOpen,
      openCreateMenu,
      closeCreateMenu,
      toggleCreateMenu,

      onRestoreFocus,
    ]
  );

  return (
    <ViewsContext.Provider value={value}>{children}</ViewsContext.Provider>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Views CreateMenu
 * -----------------------------------------------------------------------------------------------*/

const STYLES_CREATE_MENU_INPUT = (theme) => css`
  ${Styles.H4};

  font-family: ${theme.font.text};
  -webkit-appearance: none;
  width: 100%;
  height: 36px;
  background-color: ${theme.semantic.bgGrayLight};
  outline: 0;
  border: 1px solid ${theme.semantic.borderGrayLight};
  border-radius: 8px;
  box-sizing: border-box;
  color: ${theme.semantic.textBlack};
  padding-left: 16px;

  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: ${theme.semantic.textGray};
    opacity: 1; /* Firefox */
  }

  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: ${theme.semantic.textGray};
  }

  ::-ms-input-placeholder {
    /* Microsoft Edge */
    color: ${theme.semantic.textGray};
  }
`;

const STYLES_CREATE_MENU_BUTTON_FOCUS = (theme) => css`
  background-color: ${theme.semantic.bgGrayLight};
`;

const STYLES_CREATE_MENU_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  padding: 5px 12px 7px;
  border-radius: 8px;
  width: 100%;
  text-align: left;
  color: ${theme.semantic.textBlack};
  &:hover {
    color: ${theme.semantic.textBlack};
  }
  &:focus {
    ${STYLES_CREATE_MENU_BUTTON_FOCUS(theme)}
  }
`;

const CreateMenuInitialScene = ({
  goToSourceScene,
  goToTagScene,
  ...props
}) => {
  const { viewer, scrollMenuToLeftEdge } = useViewsContext();

  const handleToggleSavedView = () => {
    viewer.updateViewerSettings({
      isSavedViewActivated: !viewer.settings?.isSavedViewActivated,
    });
    scrollMenuToLeftEdge();
  };
  const handleToggleFilesView = () => {
    viewer.updateViewerSettings({
      isFilesViewActivated: !viewer.settings?.isFilesViewActivated,
    });
    scrollMenuToLeftEdge();
  };

  const actions = React.useMemo(
    () => [
      { label: "Source", handler: goToSourceScene },
      { label: "Tag", handler: goToTagScene },
      {
        label: "Saved",
        handler: handleToggleSavedView,
        isApplied: viewer.settings?.isSavedViewActivated,
      },
      {
        label: "Files",
        handler: handleToggleFilesView,
        isApplied: viewer.settings?.isFilesViewActivated,
      },
    ],
    [viewer.settings]
  );
  return (
    <section layoutId="create_menu" style={{ padding: 8 }} {...props}>
      <RovingTabIndex.Provider
        id="create_menu_tabindex"
        withRestoreFocusOnMount
        withFocusOnHover
      >
        <RovingTabIndex.List>
          <div style={{ width: "100%" }}>
            {actions.map((action, index) => {
              return (
                <RovingTabIndex.Item key={action.label} index={index}>
                  <button
                    onClick={action.handler}
                    css={STYLES_CREATE_MENU_BUTTON}
                    autoFocus={index === 0}
                  >
                    <Typography.H5 color="textBlack">
                      {action.label}
                    </Typography.H5>

                    {action.isApplied && (
                      <div style={{ marginLeft: "auto" }}>
                        <SVG.CheckCircle />
                      </div>
                    )}
                  </button>
                </RovingTabIndex.Item>
              );
            })}
          </div>
        </RovingTabIndex.List>
      </RovingTabIndex.Provider>
    </section>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const CreateMenuTagButton = ({ index, children, css, onClick, ...props }) => {
  const { checkIfIndexSelected } = useComboboxNavigation();
  const isSelected = checkIfIndexSelected(index);

  return (
    <Combobox.MenuButton onSubmit={onClick} index={index}>
      <button
        css={[
          STYLES_CREATE_MENU_BUTTON,
          isSelected && STYLES_CREATE_MENU_BUTTON_FOCUS,
          css,
        ]}
        style={{ padding: "5px 12px 7px" }}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    </Combobox.MenuButton>
  );
};

export const useSourcesCombobox = ({ sources }) => {
  const [searchValue, setSearchValue] = React.useState("");

  const filteredSources = React.useMemo(() => {
    if (searchValue === "") return sources;

    const searchRegex = new RegExp(searchValue, "gi");
    return sources.filter((source) => {
      return searchRegex.test(source.title);
    });
  }, [sources, searchValue]);

  return { filteredSources, searchValue, setSearchValue };
};

const CreateMenuSourceScene = ({ goToInitialScene, sources, ...props }) => {
  const {
    viewer,
    getViewsFeed,
    createViewBySource,
    scrollMenuToRightEdge,
    closeCreateMenu,
  } = useViewsContext();

  const { filteredSources, searchValue, setSearchValue } = useSourcesCombobox({
    sources,
  });

  const handleOnInputChange = (e) => setSearchValue(e.target.value);

  useEscapeKey(goToInitialScene);

  const handleSwitchToAppliedSourceView = (source) => {
    const view = viewer.viewsSourcesLookup[source];
    getViewsFeed(view);
    closeCreateMenu();
  };
  const handleCreateView = (source) => {
    createViewBySource(source);
    scrollMenuToRightEdge();
  };

  return (
    <div {...props}>
      <Combobox.Provider>
        <div style={{ width: "100%", padding: 8 }}>
          <Combobox.Input>
            <input
              placeholder="Search"
              css={STYLES_CREATE_MENU_INPUT}
              value={searchValue}
              onChange={handleOnInputChange}
              autoFocus
            />
          </Combobox.Input>
        </div>
        <Divider color="borderGrayLight" style={{ width: "100%" }} />
        <Combobox.Menu>
          <div css={STYLES_CREATE_MENU_SLATES_WRAPPER}>
            {filteredSources.map((sourceData, index) => {
              const isApplied = sourceData.source in viewer.viewsSourcesLookup;
              const handleOnClick = isApplied
                ? handleSwitchToAppliedSourceView
                : handleCreateView;

              return (
                <CreateMenuTagButton
                  onClick={() => handleOnClick(sourceData.source)}
                  index={index}
                  key={sourceData.title}
                >
                  <div>
                    <Favicon
                      rootDomain={sourceData.rootDomain}
                      src={sourceData.favicon}
                      alt={`${sourceData.title}'s favicon`}
                    />
                  </div>
                  <Typography.H5
                    color="textBlack"
                    style={{ marginLeft: 8 }}
                    as="div"
                  >
                    {sourceData.title}
                  </Typography.H5>

                  {isApplied && (
                    <div style={{ marginLeft: "auto" }}>
                      <SVG.CheckCircle />
                    </div>
                  )}
                </CreateMenuTagButton>
              );
            })}
          </div>
        </Combobox.Menu>
      </Combobox.Provider>
    </div>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const STYLES_CREATE_MENU_SLATES_WRAPPER = css`
  ${Styles.VERTICAL_CONTAINER_CENTERED};
  width: 100%;
  padding: 8px;
  height: 128px;
  overflow-y: auto;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const STYLES_COLOR_SYSTEM_BLUE = (theme) => css`
  color: ${theme.system.blue};
  &:hover {
    color: ${theme.system.blue};
  }
`;

const CreateMenuTagScene = ({ goToInitialScene, ...props }) => {
  useEscapeKey(goToInitialScene);

  const {
    viewer,
    closeCreateMenu,
    getViewsFeed,
    createViewByTag,
    scrollMenuToRightEdge,
  } = useViewsContext();
  const { slates, canCreateSlate, searchValue, setSearchValue } =
    useSlatesCombobox({ slates: viewer.slates });
  const handleOnInputChange = (e) => setSearchValue(e.target.value);

  const handleSwitchToAppliedTagView = (slateName) => {
    const view = viewer.viewsSlatesLookup[slateName];
    getViewsFeed(view);
    closeCreateMenu();
  };
  const handleCreateView = (slateName) => {
    createViewByTag(slateName);
    scrollMenuToRightEdge();
  };

  return (
    <section layoutId="create_menu" {...props}>
      <Combobox.Provider>
        <div style={{ width: "100%", padding: 8 }}>
          <Combobox.Input>
            <input
              placeholder="Search or create new tag"
              css={STYLES_CREATE_MENU_INPUT}
              value={searchValue}
              onChange={handleOnInputChange}
              autoFocus
            />
          </Combobox.Input>
        </div>
        <Divider style={{ width: "100%" }} />
        <Combobox.Menu>
          <div css={STYLES_CREATE_MENU_SLATES_WRAPPER}>
            {slates.map((slate, index) => {
              const isApplied = slate in viewer.viewsSlatesLookup;
              const handleOnClick = isApplied
                ? handleSwitchToAppliedTagView
                : handleCreateView;
              return (
                <CreateMenuTagButton
                  onClick={() => handleOnClick(slate)}
                  index={index}
                  key={slate}
                >
                  <div>
                    <SVG.Hash height={16} width={16} />
                  </div>
                  <Typography.H5
                    color="textBlack"
                    style={{ marginLeft: 8 }}
                    as="div"
                  >
                    {slate}
                  </Typography.H5>
                  {isApplied && (
                    <div style={{ marginLeft: "auto" }}>
                      <SVG.CheckCircle />
                    </div>
                  )}
                </CreateMenuTagButton>
              );
            })}
            {canCreateSlate && (
              <CreateMenuTagButton
                index={slates.length}
                css={STYLES_COLOR_SYSTEM_BLUE}
              >
                <div>
                  <SVG.Plus height={16} width={16} />
                </div>
                <Typography.H5 color="blue" style={{ marginLeft: 8 }} as="div">
                  create &quot;{searchValue}&quot;
                </Typography.H5>
              </CreateMenuTagButton>
            )}
          </div>
        </Combobox.Menu>
      </Combobox.Provider>
    </section>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const STYLES_CREATE_MENU_WRAPPER = css`
  ${Styles.VERTICAL_CONTAINER_CENTERED};
  width: 100%;
`;

const CreateMenu = ({ css, ...props }) => {
  const scenes = {
    initial: "initial",
    source: "source",
    tag: "tag",
  };
  const [scene, setScene] = React.useState(scenes.initial);

  const goToSourceScene = () => setScene(scenes.source);
  const goToTagScene = () => setScene(scenes.tag);
  const goToInitialScene = () => setScene(scenes.initial);

  const { closeCreateMenu, onRestoreFocus } = useViewsContext();
  useEscapeKey(closeCreateMenu);

  React.useLayoutEffect(() => {
    return () => onRestoreFocus?.();
  }, []);

  const sources = useSources();

  if (scene === scenes.source) {
    return (
      <CreateMenuSourceScene
        css={[STYLES_CREATE_MENU_WRAPPER, css]}
        goToInitialScene={goToInitialScene}
        sources={sources}
        {...props}
      />
    );
  }

  if (scene === scenes.tag) {
    return (
      <CreateMenuTagScene
        css={[STYLES_CREATE_MENU_WRAPPER, css]}
        goToInitialScene={goToInitialScene}
        {...props}
      />
    );
  }

  return (
    <CreateMenuInitialScene
      css={[STYLES_CREATE_MENU_WRAPPER, css]}
      goToTagScene={goToTagScene}
      goToSourceScene={goToSourceScene}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------------------------------
 * Views MenuContext
 * -----------------------------------------------------------------------------------------------*/
const ViewsMenuContext = React.createContext();
export const useViewsMenuContext = () => React.useContext(ViewsMenuContext);

const MenuProvider = ({ children, ...props }) => {
  const [isMenuOverflowingFrom, setMenuOverflowFrom] = React.useState({
    left: false,
    right: false,
  });

  const value = React.useMemo(
    () => ({
      isMenuOverflowingFrom,
      setMenuOverflowFrom,
    }),
    [isMenuOverflowingFrom, setMenuOverflowFrom]
  );

  return (
    <ViewsMenuContext.Provider value={value} {...props}>
      {children}
    </ViewsMenuContext.Provider>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Views Menu
 * -----------------------------------------------------------------------------------------------*/

const STYLES_VIEWS_BUTTON_ACTIVE = (theme) => css`
  color: ${theme.semantic.textBlack};
  transition: color 0.25s;
`;

const STYLES_VIEWS_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  position: relative;
  border-radius: 12px;
  padding: 5px 12px 7px;
  color: ${theme.semantic.textGray};

  white-space: nowrap;

  &:hover {
    color: ${theme.semantic.textBlack};
  }
`;

const STYLES_VIEWS_BUTTON_BACKGROUND = (theme) => css`
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 12px;
  background-color: ${theme.semantic.bgGrayLight};
`;

const MenuItem = ({
  isViewApplied,
  onClick,
  rootDomain,
  favicon,
  isSlateView,
  isSourceView,
  children,
  index,
  onSubmit,
  ...props
}) => {
  const { registerMenuItem, cleanupMenuItem, moveSelectionOnClick } =
    useViewsContext();
  const ref = React.useRef();

  //NOTE(amine): fix closure stale state
  const onSubmitRef = React.useRef(onSubmit);
  onSubmitRef.current = onSubmit;
  React.useEffect(() => {
    registerMenuItem({ index, onSubmitRef: onSubmitRef, ref });
    return () => cleanupMenuItem(index);
  }, [index]);

  React.useLayoutEffect(() => {
    if (isViewApplied) {
      moveSelectionOnClick(index);
    }
  }, [isViewApplied]);

  return (
    <Typography.H5
      css={[STYLES_VIEWS_BUTTON, isViewApplied && STYLES_VIEWS_BUTTON_ACTIVE]}
      as="button"
      onClick={mergeEvents(onClick, () => moveSelectionOnClick(index))}
      tabIndex="-1"
      ref={ref}
      {...props}
    >
      {(isSlateView || isSourceView) && (
        <div
          style={{
            marginRight: 4,
            opacity: isViewApplied ? 1 : 0.5,
            transition: "opacity 0.25s",
          }}
        >
          {isSourceView ? (
            <Favicon src={favicon} rootDomain={rootDomain} />
          ) : (
            <SVG.Hash height={16} width={16} />
          )}
        </div>
      )}
      {children}
      <AnimatePresence>
        {isViewApplied && (
          <motion.div
            css={STYLES_VIEWS_BUTTON_BACKGROUND}
            layoutId="views-menu-actions-motion"
          />
        )}
      </AnimatePresence>
    </Typography.H5>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const STYLES_VIEWS_MENU_WRAPPER = css`
  ${Styles.HORIZONTAL_CONTAINER};
  position: relative;
  width: 100%;
  padding: 8px;

  &:hover .views_actions_chevron {
    opacity: 1;
  }

  &:focus-within .views_actions_chevron {
    opacity: 1;
  }
`;

const STYLES_VIEWS_MENU_ACTIONS = css`
  overflow-x: auto;
  ${Styles.HORIZONTAL_CONTAINER};

  &::-webkit-scrollbar {
    display: none;
  }
`;

const STYLES_SCROLL_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  margin-left: auto;
  border-radius: 8px;
  padding: 8px;
  height: 32px;
  width: 32px;
  background-color: ${theme.semantic.bgLight};
  color: ${theme.semantic.textGrayDark};

  opacity: 0;
  transition: opacity 0.25s;

  &:hover {
    background-color: ${theme.semantic.bgGrayLight};
    color: ${theme.semantic.textBlack};
  }

  &:focus {
    background-color: ${theme.semantic.bgGrayLight};
    color: ${theme.semantic.textBlack};
  }
`;

const STYLES_SCROLL_BUTTON_RIGHT = (theme) => css`
  ${STYLES_SCROLL_BUTTON(theme)};
  position: absolute;
  //NOTE(amine): plus button's width + paddings
  right: calc(32px + 8px + 8px);
  top: 8px;
`;

const STYLES_SCROLL_BUTTON_LEFT = (theme) => css`
  ${STYLES_SCROLL_BUTTON(theme)};
  position: absolute;
  left: 8px;
  top: 8px;
`;

const STYLES_VIEWS_ADD_BUTTON_FOCUS = (theme) => css`
  background-color: ${theme.semantic.bgGrayLight};
  color: ${theme.semantic.textBlack};
`;

const STYLES_VIEWS_ADD_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  margin-left: auto;
  border-radius: 8px;
  padding: 8px;
  height: 32px;
  width: 32px;
  background-color: ${theme.semantic.bgLight};
  color: ${theme.semantic.textGrayDark};

  &:hover {
    background-color: ${theme.semantic.bgGrayLight};
    color: ${theme.semantic.textBlack};
  }

  &:focus {
    background-color: ${theme.semantic.bgGrayLight};
    color: ${theme.semantic.textBlack};
  }
`;

const useHandleScrollNavigation = ({
  isMenuOverflowingFrom,
  setMenuOverflowFrom,
  containerRef,
}) => {
  const handleActionWrapperScroll = () => {
    const wrapper = containerRef.current;
    if (!wrapper) return;

    setMenuOverflowFrom((prev) => {
      const newState = {
        right: wrapper.scrollLeft < wrapper.scrollWidth - wrapper.offsetWidth,
        left: wrapper.scrollLeft > 0,
      };

      const didStateChange = Object.keys(prev).some(
        (key) => newState[key] !== prev[key]
      );

      if (didStateChange) {
        return newState;
      }

      return prev;
    });
  };

  React.useEffect(handleActionWrapperScroll, []);
  useEventListener(
    {
      type: "scroll",
      handler: handleActionWrapperScroll,
      ref: containerRef,
    },
    [isMenuOverflowingFrom]
  );

  const scrollToRight = () => {
    const wrapper = containerRef.current;
    wrapper.scrollTo({ left: wrapper.scrollLeft + 250 });
  };

  const scrollToLeft = () => {
    const wrapper = containerRef.current;
    wrapper.scrollTo({ left: wrapper.scrollLeft - 250 });
  };

  return { scrollToLeft, scrollToRight };
};

function Menu({ css, actionsWrapperStyle, ...props }) {
  const {
    viewer,

    appliedView,
    getViewsFeed,

    scrollButtonCss,

    registerMenuRef,
    cleanupMenu,

    isCreateMenuOpen,
    toggleCreateMenu,
  } = useViewsContext();

  const { isMenuOverflowingFrom, setMenuOverflowFrom } = useViewsMenuContext();

  React.useLayoutEffect(() => cleanupMenu, []);

  const createOnClickHandler = (view) => () => getViewsFeed(view);

  const preventActionButtonFocus = (e) => e.preventDefault();

  const actionWrapperRef = React.useRef();
  const { scrollToLeft, scrollToRight } = useHandleScrollNavigation({
    isMenuOverflowingFrom,
    setMenuOverflowFrom,
    containerRef: actionWrapperRef,
  });

  const VIEWS_ACTIONS = React.useMemo(() => {
    const actions = [defaultViews.allOpen, defaultViews.recent];

    if (viewer.settings?.isSavedViewActivated) {
      actions.push(defaultViews.saved);
    }
    if (viewer.settings?.isFilesViewActivated) {
      actions.push(defaultViews.files);
    }

    return actions;
  }, [viewer.settings]);

  return (
    <section css={[STYLES_VIEWS_MENU_WRAPPER, css]} {...props}>
      <div
        css={STYLES_VIEWS_MENU_ACTIONS}
        ref={mergeRefs([actionWrapperRef, registerMenuRef])}
        style={{
          paddingRight: 132,
          position: "relative",
          overflow: "hidden",
          width: "100%",
          ...actionsWrapperStyle,
        }}
      >
        <AnimateSharedLayout>
          {VIEWS_ACTIONS.map((view, i) => {
            const isApplied = appliedView.id === view.id;
            return (
              <MenuItem
                isViewApplied={isApplied}
                key={view.name}
                style={{ marginLeft: i > 0 ? 4 : 0 }}
                onMouseDown={preventActionButtonFocus}
                onClick={createOnClickHandler(view)}
                onSubmit={createOnClickHandler(view)}
                index={i}
              >
                {view.name}
              </MenuItem>
            );
          })}

          {viewer.views.length !== 0 && (
            <Divider
              height="none"
              width="1px"
              style={{ margin: "0px 4px", flexShrink: 0 }}
            />
          )}

          {viewer.views.map((view, i) => {
            const isApplied = appliedView.id === view.id;
            const isSlateFilter = view.filterBySlateId;
            return (
              <MenuItem
                key={view.name}
                isViewApplied={isApplied}
                style={{ marginLeft: 4 }}
                favicon={view?.metadata?.favicon}
                rootDomain={getRootDomain(view.filterBySource)}
                isSlateView={isSlateFilter}
                isSourceView={!isSlateFilter}
                onMouseDown={preventActionButtonFocus}
                onClick={createOnClickHandler(view)}
                onSubmit={createOnClickHandler(view)}
                index={VIEWS_ACTIONS.length + i}
                Favicon={Favicon}
              >
                {view.name}
              </MenuItem>
            );
          })}
        </AnimateSharedLayout>
      </div>

      {isMenuOverflowingFrom.left ? (
        <button
          className="views_actions_chevron"
          css={[STYLES_SCROLL_BUTTON_LEFT, scrollButtonCss]}
          onClick={scrollToLeft}
        >
          <SVG.ChevronLeft width={16} height={16} />
        </button>
      ) : null}

      {isMenuOverflowingFrom.right ? (
        <button
          className="views_actions_chevron"
          css={[STYLES_SCROLL_BUTTON_RIGHT, scrollButtonCss]}
          onClick={scrollToRight}
        >
          <SVG.ChevronRight width={16} height={16} />
        </button>
      ) : null}

      <ShortcutsTooltip label="Create new space" keyTrigger="N">
        <button
          css={[
            STYLES_VIEWS_ADD_BUTTON,
            isCreateMenuOpen && STYLES_VIEWS_ADD_BUTTON_FOCUS,
          ]}
          style={{ marginLeft: 6 }}
          onClick={toggleCreateMenu}
        >
          <motion.div animate={{ rotate: isCreateMenuOpen ? 45 : 0 }}>
            <SVG.Plus width={16} height={16} />
          </motion.div>
        </button>
      </ShortcutsTooltip>
    </section>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Views Feed
 * -----------------------------------------------------------------------------------------------*/

const STYLES_VIEWS_FEED_ROW = {
  width: "100%",
  transform: "translateY(8px)",
};

const ViewsFeedRow = ({ index, data, style }) => {
  const visit = data.feed[index];
  const { onOpenUrl, onOpenSlatesJumper } = data.props;

  return (
    <ListView.RovingTabIndexWithMultiSelectObject
      key={visit.url}
      withActions
      withMultiSelection
      style={{ ...style, ...STYLES_VIEWS_FEED_ROW }}
      index={index}
      title={visit.title}
      url={visit.url}
      favicon={visit.favicon}
      rootDomain={visit.rootDomain}
      relatedVisits={visit.relatedVisits}
      isSaved={visit.isSaved}
      onClick={() => onOpenUrl({ urls: [visit.url] })}
      onOpenSlatesJumper={() =>
        onOpenSlatesJumper([
          {
            title: visit.title,
            url: visit.url,
            rootDomain: getRootDomain(visit.url),
          },
        ])
      }
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

const ViewsFeedList = React.forwardRef(
  ({ children, ...props }, forwardedRef) => {
    const [listHeight, setListHeight] = React.useState(
      isNewTab ? null : Constants.sizes.jumperFeedWrapper
    );

    const ref = React.useRef();
    React.useEffect(() => {
      if (ref.current) {
        setListHeight(ref.current.offsetHeight);
      }
    }, []);

    if (!listHeight) {
      return <div style={{ height: "100%" }} ref={ref} />;
    }

    return (
      <RovingTabIndex.List>
        <ListView.FixedSizeListRoot
          height={listHeight}
          ref={forwardedRef}
          {...props}
        >
          {children}
        </ListView.FixedSizeListRoot>
      </RovingTabIndex.List>
    );
  }
);

/* -----------------------------------------------------------------------------------------------*/

const useManageFeedFocus = ({
  viewer,
  getViewsFeed,
  onRestoreFocus,

  appliedView,
}) => {
  const shouldFocus = React.useRef(true);

  // NOTE(amine): When creating a new view, load the feed without focusing it
  const prevViewsRef = React.useRef(viewer.views);
  React.useEffect(() => {
    const prevViews = prevViewsRef.current;
    const currentViews = viewer.views;

    if (currentViews.length > prevViews.length) {
      const newView = currentViews[currentViews.length - 1];
      shouldFocus.current = false;
      getViewsFeed(newView);
    }

    prevViewsRef.current = viewer.views;
  }, [viewer.views]);

  // NOTE(amine): When activating a view, load the feed without focusing it
  const prevSettingsRef = React.useRef(viewer.settings);
  React.useEffect(() => {
    const prevSettings = prevSettingsRef.current;
    const currentSettings = viewer.settings;

    if (
      currentSettings.isSavedViewActivated &&
      !prevSettings.isSavedViewActivated
    ) {
      shouldFocus.current = false;
      getViewsFeed(defaultViews.saved);
    }

    if (
      currentSettings.isFilesViewActivated &&
      !prevSettings.isFilesViewActivated
    ) {
      shouldFocus.current = false;
      getViewsFeed(defaultViews.files);
    }

    prevSettingsRef.current = viewer.settings;
  }, [viewer.settings]);

  // NOTE(amine): focus the feed when the applied view changes
  React.useLayoutEffect(() => {
    if (!shouldFocus.current) {
      shouldFocus.current = true;
      return;
    }
    onRestoreFocus();
  }, [appliedView]);
};

const Feed = React.memo(
  React.forwardRef(
    (
      {
        onOpenUrl,
        onOpenSlatesJumper,
        onGroupURLs,
        onSaveObjects,

        historyFeed,
        historyFeedKeys,
        loadMoreHistory,

        windowsFeed,
        windowsFeedKeys,
        onCloseTabs,
        activeTabId,

        ...props
      },
      ref
    ) => {
      const {
        viewsFeed,
        viewer,
        appliedView,
        getViewsFeed,
        isLoadingViewFeed,
        onRestoreFocus,
      } = useViewsContext();

      const handleOnSubmitSelectedItem = (index) => viewsFeed[index];

      // NOTE(amine): display the new feed once it's loaded
      const prevView = React.useRef(appliedView);
      const loadedView = React.useMemo(() => {
        const isCustomView = [
          viewsType.custom,
          viewsType.saved,
          viewsType.files,
        ].some((type) => appliedView.type === type);

        if (isCustomView && isLoadingViewFeed) {
          return prevView.current;
        } else {
          prevView.current = appliedView;
          return appliedView;
        }
      }, [appliedView, isLoadingViewFeed]);

      const viewsFeedItemsData = React.useMemo(() => {
        return {
          feed: viewsFeed,
          props: {
            onOpenUrl,
            onOpenSlatesJumper,
          },
        };
      }, [viewsFeed]);

      const handleRestoreFocus = () => {
        ref.rovingTabIndexRef.focus(onRestoreFocus);
      };

      useManageFeedFocus({
        viewer,
        getViewsFeed,
        onRestoreFocus: handleRestoreFocus,

        appliedView: loadedView,
      });

      if (loadedView.type === viewsType.allOpen) {
        return (
          <WindowsFeed
            ref={ref}
            windowsFeed={windowsFeed}
            windowsFeedKeys={windowsFeedKeys}
            activeTabId={activeTabId}
            onCloseTabs={onCloseTabs}
            onOpenSlatesJumper={onOpenSlatesJumper}
            onSaveObjects={onSaveObjects}
            onOpenUrl={onOpenUrl}
            {...props}
          />
        );
      }

      if (loadedView.type === viewsType.recent) {
        return (
          <HistoryFeed
            ref={ref}
            sessionsFeed={historyFeed}
            sessionsFeedKeys={historyFeedKeys}
            onLoadMore={loadMoreHistory}
            onOpenUrl={onOpenUrl}
            onOpenSlatesJumper={onOpenSlatesJumper}
            onSaveObjects={onSaveObjects}
            onGroupURLs={onGroupURLs}
            {...props}
          />
        );
      }

      return (
        <RovingTabIndex.Provider
          key={loadedView.id}
          ref={(node) => (ref.rovingTabIndexRef = node)}
          isInfiniteList
          withFocusOnHover
        >
          <MultiSelection.Provider
            totalSelectableItems={viewsFeedItemsData.feed.length}
            onSubmitSelectedItem={handleOnSubmitSelectedItem}
          >
            <ViewsFeedList
              itemCount={viewsFeedItemsData.feed.length}
              itemData={viewsFeedItemsData}
              itemSize={Constants.sizes.jumperFeedItem}
              {...props}
            >
              {ViewsFeedRow}
            </ViewsFeedList>

            <MultiSelection.ActionsMenu
              onOpenURLs={(urls) => onOpenUrl({ urls })}
              onGroupURLs={(urls) =>
                onGroupURLs({ urls, title: loadedView.name })
              }
              onOpenSlatesJumper={onOpenSlatesJumper}
              onSaveObjects={onSaveObjects}
            />
          </MultiSelection.Provider>
        </RovingTabIndex.Provider>
      );
    }
  )
);

export { Provider, MenuProvider, Menu, CreateMenu, Feed };
