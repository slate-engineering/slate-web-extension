import * as React from "react";
import * as Typography from "../Components/system/Typography";
import * as Styles from "../Common/styles";
import * as ListView from "../Components/ListView";
import * as SVG from "../Common/SVG";
import * as RovingTabIndex from "./RovingTabIndex";
import * as MultiSelection from "./MultiSelection";
import * as Constants from "../Common/constants";

import { css } from "@emotion/react";
import { getFavicon } from "../Common/favicons";
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
import { useSlatesCombobox } from "../Components/EditSlates";
import { Switch, Match } from "../Components/Switch.js";

import HistoryFeed from "./HistoryFeed";
import WindowsFeed from "./WindowsFeed";

const VIEWS_ACTIONS = [
  defaultViews.allOpen,
  defaultViews.recent,
  defaultViews.saved,
  defaultViews.files,
];

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

  const {
    registerMenuItem,
    cleanupMenuItem,

    registerMenuRef,
    cleanupMenu,

    moveSelectionOnClick,
    scrollMenuToRightEdge,
  } = useHandleViewsNavigation();

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

      isCreateMenuOpen,
      openCreateMenu,
      closeCreateMenu,

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

      isCreateMenuOpen,
      openCreateMenu,
      closeCreateMenu,

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
  const handleToggleSavedView = () => {};
  const handleToggleFilesView = () => {};

  const actions = React.useMemo(
    () => [
      { label: "Source", handler: goToSourceScene },
      { label: "Tag", handler: goToTagScene },
      { label: "Saved", handler: handleToggleSavedView },
      { label: "Files", handler: handleToggleFilesView },
    ],
    []
  );
  return (
    <motion.section layoutId="create_menu" {...props}>
      <RovingTabIndex.Provider
        id="create_menu_tabindex"
        withRestoreFocusOnMount
        withFocusOnHover
      >
        <RovingTabIndex.List>
          <div style={{ width: "100%" }}>
            {actions.map((action, index) => (
              <RovingTabIndex.Item key={action.label} index={index}>
                <button
                  onClick={action.handler}
                  css={STYLES_CREATE_MENU_BUTTON}
                  autoFocus={index === 0}
                >
                  <Typography.H5 color="textBlack">
                    {action.label}
                  </Typography.H5>
                </button>
              </RovingTabIndex.Item>
            ))}
          </div>
        </RovingTabIndex.List>
      </RovingTabIndex.Provider>
    </motion.section>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const sources = [
  {
    name: "Twitter",
    rootDomain: "twitter.com",
    source: "https://twitter.com/",
  },
  {
    name: "Youtube",
    rootDomain: "youtube.com",
    source: "https://www.youtube.com/",
  },
];

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

const CreateMenuSourceScene = ({ goToInitialScene, ...props }) => {
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
    console.log("switching to source", source);
    const view = viewer.viewsSourcesLookup[source];
    getViewsFeed(view);
    closeCreateMenu();
  };
  const handleCreateView = (source) => {
    console.log("creating source", source);
    createViewBySource(source);
    scrollMenuToRightEdge();
  };

  return (
    <div {...props}>
      <Combobox.Provider>
        <Combobox.Input>
          <input
            placeholder="Search"
            css={STYLES_CREATE_MENU_INPUT}
            value={searchValue}
            onChange={handleOnInputChange}
            autoFocus
          />
        </Combobox.Input>
        <Combobox.Menu>
          <div css={STYLES_CREATE_MENU_SLATES_WRAPPER}>
            {filteredSources.map((sourceData, index) => {
              const Favicon = getFavicon(sourceData.rootDomain);
              const isApplied = sourceData.source in viewer.viewsSourcesLookup;
              const handleOnClick = isApplied
                ? handleSwitchToAppliedSourceView
                : handleCreateView;

              return (
                <CreateMenuTagButton
                  onClick={() => handleOnClick(sourceData.source)}
                  index={index}
                  key={sourceData.name}
                >
                  <div>
                    <Favicon />
                  </div>
                  <Typography.H5
                    color="textBlack"
                    style={{ marginLeft: 8 }}
                    as="div"
                  >
                    {sourceData.name}
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
  padding-top: 8px;
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
    console.log("switching to slate", slateName);
    const view = viewer.viewsSlatesLookup[slateName];
    getViewsFeed(view);
    closeCreateMenu();
  };
  const handleCreateView = (slateName) => {
    console.log("creating slate"), slateName;
    createViewByTag(slateName);
    scrollMenuToRightEdge();
  };

  return (
    <motion.div layoutId="create_menu" {...props}>
      <Combobox.Provider>
        <Combobox.Input>
          <input
            placeholder="Search or create new tag"
            css={STYLES_CREATE_MENU_INPUT}
            value={searchValue}
            onChange={handleOnInputChange}
            autoFocus
          />
        </Combobox.Input>
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
    </motion.div>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const STYLES_CREATE_MENU_WRAPPER = css`
  ${Styles.VERTICAL_CONTAINER_CENTERED};
  padding: 8px;
  width: 100%;
`;

const CreateMenu = (props) => {
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

  return (
    <Switch {...props}>
      <Match
        when={scene === scenes.source}
        component={CreateMenuSourceScene}
        css={STYLES_CREATE_MENU_WRAPPER}
        goToInitialScene={goToInitialScene}
      />
      <Match
        when={scene === scenes.tag}
        component={CreateMenuTagScene}
        css={STYLES_CREATE_MENU_WRAPPER}
        goToInitialScene={goToInitialScene}
      />
      <Match
        when={scene === scenes.initial}
        component={CreateMenuInitialScene}
        goToTagScene={goToTagScene}
        goToSourceScene={goToSourceScene}
        css={STYLES_CREATE_MENU_WRAPPER}
      />
    </Switch>
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
  Favicon,
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
      {Favicon && (
        <Favicon
          style={{
            marginRight: 4,
            opacity: isViewApplied ? 1 : 0.5,
            transition: "opacity 0.25s",
          }}
        />
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
  right: 0px;
  top: 0px;
`;

const STYLES_SCROLL_BUTTON_LEFT = (theme) => css`
  ${STYLES_SCROLL_BUTTON(theme)};
  position: absolute;
  left: 0px;
  top: 0px;
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

const useHandleScrollNavigation = ({ containerRef }) => {
  const [isOverflowFrom, setOverflowFrom] = React.useState({
    left: false,
    right: false,
  });

  const handleActionWrapperScroll = () => {
    const wrapper = containerRef.current;
    if (!wrapper) return;

    setOverflowFrom((prev) => {
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
    [isOverflowFrom]
  );

  const scrollToRight = () => {
    const wrapper = containerRef.current;
    wrapper.scrollTo({ left: wrapper.scrollLeft + 250 });
  };

  const scrollToLeft = () => {
    const wrapper = containerRef.current;
    wrapper.scrollTo({ left: wrapper.scrollLeft - 250 });
  };

  return [isOverflowFrom, { scrollToLeft, scrollToRight }];
};

function Menu({ css, ...props }) {
  const {
    viewer,

    appliedView,
    getViewsFeed,

    scrollButtonCss,

    registerMenuRef,
    cleanupMenu,

    openCreateMenu,
  } = useViewsContext();

  React.useLayoutEffect(() => cleanupMenu, []);

  const createOnClickHandler = (view) => () => getViewsFeed(view);

  const actionWrapperRef = React.useRef();
  const [isOverflowFrom, { scrollToLeft, scrollToRight }] =
    useHandleScrollNavigation({ containerRef: actionWrapperRef });

  return (
    <section css={[STYLES_VIEWS_MENU_WRAPPER, css]} {...props}>
      <div style={{ position: "relative", overflow: "hidden", width: "100%" }}>
        <div
          css={STYLES_VIEWS_MENU_ACTIONS}
          ref={mergeRefs([actionWrapperRef, registerMenuRef])}
          style={{ paddingRight: 132 }}
        >
          <AnimateSharedLayout>
            {VIEWS_ACTIONS.map((view, i) => {
              const isApplied = appliedView.id === view.id;
              return (
                <MenuItem
                  isViewApplied={isApplied}
                  key={view.name}
                  style={{ marginLeft: i > 0 ? 4 : 0 }}
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
              const isSlateFilter = view.filters.slate;
              const Favicon = isSlateFilter
                ? SVG.Hash
                : getFavicon(getRootDomain(view.filters.source));

              return (
                <MenuItem
                  key={view.name}
                  isViewApplied={isApplied}
                  style={{ marginLeft: 4 }}
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

        {isOverflowFrom.left ? (
          <button
            className="views_actions_chevron"
            css={[STYLES_SCROLL_BUTTON_LEFT, scrollButtonCss]}
            onClick={scrollToLeft}
          >
            <SVG.ChevronLeft width={16} height={16} />
          </button>
        ) : null}

        {isOverflowFrom.right ? (
          <button
            className="views_actions_chevron"
            css={[STYLES_SCROLL_BUTTON_RIGHT, scrollButtonCss]}
            onClick={scrollToRight}
          >
            <SVG.ChevronRight width={16} height={16} />
          </button>
        ) : null}
      </div>

      <button
        css={STYLES_VIEWS_ADD_BUTTON}
        style={{ marginLeft: 6 }}
        onClick={openCreateMenu}
      >
        <SVG.Plus width={16} height={16} />
      </button>
    </section>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Views Feed
 * -----------------------------------------------------------------------------------------------*/

const STYLES_VIEWS_FEED_ROW = {
  width: "calc(100% - 16px)",
  left: "8px",
  transform: "translateY(8px)",
};

const ViewsFeedRow = ({ index, data, style, ...props }) => {
  const visit = data.feed[index];
  const { onOpenUrl, onOpenSlatesJumper } = props;

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
      relatedVisits={visit.relatedVisits}
      isSaved={visit.isSaved}
      Favicon={getFavicon(visit.rootDomain)}
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
      autoFocus={index === 0}
      {...props}
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

const Feed = React.memo(
  React.forwardRef(
    (
      {
        onObjectHover,
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
      const { viewsFeed, appliedView, isLoadingViewFeed, onRestoreFocus } =
        useViewsContext();

      const handleOnSubmitSelectedItem = (index) => viewsFeed[index];

      // NOTE(amine): display the new feed once it's loaded
      const prevView = React.useRef(appliedView);
      const loadedView = React.useMemo(() => {
        if (isLoadingViewFeed) {
          return prevView.current;
        } else {
          prevView.current = appliedView;
          return appliedView;
        }
      }, [appliedView, isLoadingViewFeed]);

      React.useLayoutEffect(() => {
        if (loadedView.type === viewsType.allOpen && windowsFeed.length === 0) {
          onRestoreFocus();
          return;
        }
        if (loadedView.type === viewsType.recent && historyFeed.length === 0) {
          onRestoreFocus();
          return;
        }
        if (
          (loadedView.type === viewsType.custom ||
            loadedView.type === viewsType.saved ||
            loadedView === viewsType.files) &&
          viewsFeed.length === 0
        ) {
          onRestoreFocus();
          return;
        }
      }, [loadedView]);

      const viewsFeedItemsData = React.useMemo(() => {
        return {
          feed: viewsFeed,
          props: {
            onOpenUrl,
            onOpenSlatesJumper,
            onObjectHover,
          },
        };
      }, [viewsFeed]);

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
                onGroupURLs({ urls, title: appliedView.name })
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

export { Provider, CreateMenu, Menu, Feed };
