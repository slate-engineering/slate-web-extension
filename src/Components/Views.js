import * as React from "react";
import * as Typography from "~/components/system/Typography";
import * as Styles from "~/common/styles";
import * as ListView from "~/components/ListView";
import * as SVG from "~/common/SVG";
import * as RovingTabIndex from "./RovingTabIndex";
import * as MultiSelection from "./MultiSelection";
import * as Constants from "~/common/constants";

import { css } from "@emotion/react";
import { defaultViews, viewsType } from "~/core/views";
import { Divider } from "~/components/Divider";
import {
  Combobox,
  useComboboxNavigation,
} from "~/components/ComboboxNavigation";
import { useEscapeKey, useEventListener } from "~/common/hooks";
import { motion, AnimateSharedLayout, AnimatePresence } from "framer-motion";
import {
  mergeRefs,
  mergeEvents,
  isNewTab,
  getRootDomain,
  isUsingMac,
} from "~/common/utilities";
import { ShortcutsTooltip } from "~/components/Tooltip";
import { Favicon } from "~/components/Favicon";
import { Boundary } from "~/components/Boundary";
import { Switch, Match } from "~/components/Switch";
import { useSearchContext } from "~/components/Search";
import { useSlatesCombobox } from "~/components/EditSlates";
import { LoadingSpinner } from "~/components/Loaders";
import { SavingKeyboardShortcut } from "~/components/SavingKeyboardShortcut";
import { SavedObjectsFeed } from "./SavedObjectsFeed";
import { useSources as useJumperSources } from "~/core/viewer/app/jumper.js";
import { useSources as useNewTabSources } from "~/core/viewer/app/newTab";
const useSources = isNewTab ? useNewTabSources : useJumperSources;

import HistoryFeed from "~/components/HistoryFeed";
import WindowsFeed from "~/components/WindowsFeed";

/* -------------------------------------------------------------------------------------------------
 * Views Provider
 * -----------------------------------------------------------------------------------------------*/

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
    let isMoveToPrevElementShortcut;
    if (isUsingMac()) {
      isMoveToPrevElementShortcut = e.altKey && e.shiftKey && e.key === "Tab";
    } else {
      isMoveToPrevElementShortcut = e.ctrlKey && e.key === "ArrowLeft";
    }

    if (isMoveToPrevElementShortcut) {
      moveSelectionToPreviousElement();

      e.stopPropagation();
      e.preventDefault();
      return;
    }

    let isMoveToNextElementShortcut;
    if (isUsingMac()) {
      isMoveToNextElementShortcut = e.altKey && e.key === "Tab";
    } else {
      isMoveToNextElementShortcut = e.ctrlKey && e.key === "ArrowRight";
    }

    if (isMoveToNextElementShortcut) {
      moveSelectionToNextElement();

      e.stopPropagation();
      e.preventDefault();
    }
  };

  const scrollMenuToRightEdge = () => {
    const menuNode = menuElementRef.current;
    if (!menuNode) return;
    menuNode.scrollTo({ left: menuNode.scrollWidth, behavior: "smooth" });
  };

  const scrollMenuToLeftEdge = () => {
    const menuNode = menuElementRef.current;
    if (!menuNode) return;
    menuNode.scrollTo({ left: 0, behavior: "smooth" });
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
      menuNode.scrollTo({ left: 0, behavior: "smooth" });
    }

    const lastIndex = Math.max(...Object.keys(menuItemsRef.current));
    if (selectedIdx === lastIndex) {
      menuNode.scrollTo({ left: menuNode.scrollWidth, behavior: "smooth" });
    }

    if (
      selectedNode.offsetLeft + selectedNode.offsetWidth >=
      menuNode.scrollLeft + menuNode.offsetWidth
    ) {
      menuNode.scrollTo({
        left: selectedNode.offsetLeft - selectedNode.offsetWidth,
        behavior: "smooth",
      });
      return;
    }

    if (selectedNode.offsetLeft <= menuNode.scrollLeft) {
      const prevIndex = selectedIdx - 1;
      const prevNode = menuItemsRef.current[prevIndex]?.ref?.current;

      menuNode.scrollTo({
        left: prevNode ? prevNode.offsetLeft : selectedNode.offsetLeft,
        behavior: "smooth",
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

/* -----------------------------------------------------------------------------------------------*/

const useCreateMenuVisibility = () => {
  const [isCreateMenuOpen, setCreateMenuVisibility] = React.useState(false);
  const openCreateMenu = () => setCreateMenuVisibility(true);
  const closeCreateMenu = () => setCreateMenuVisibility(false);
  const toggleCreateMenu = () => setCreateMenuVisibility((prev) => !prev);

  const handleOpenCreateMenuOnKeyDown = (e) => {
    if (e.key === "n") {
      openCreateMenu();

      e.stopPropagation();
      e.preventDefault();
      return;
    }
  };

  useEventListener(
    { type: "keydown", handler: handleOpenCreateMenuOnKeyDown },
    []
  );

  return [
    isCreateMenuOpen,
    { openCreateMenu, closeCreateMenu, toggleCreateMenu },
  ];
};

/* -----------------------------------------------------------------------------------------------*/

const useSetAppliedFeedOnceFeedIsLoaded = ({
  preloadedView,
  isLoadingViewFeed,
}) => {
  const prevView = React.useRef(preloadedView);
  const appliedView = React.useMemo(() => {
    const isCustomView = [
      viewsType.custom,
      viewsType.saved,
      viewsType.files,
    ].some((type) => preloadedView.type === type);

    if (isCustomView && isLoadingViewFeed) {
      return prevView.current;
    } else {
      prevView.current = preloadedView;
      return preloadedView;
    }
  }, [preloadedView, isLoadingViewFeed]);

  return appliedView;
};

/* -----------------------------------------------------------------------------------------------*/

const ViewsContext = React.createContext();
export const useViewsContext = () => React.useContext(ViewsContext);

function Provider({
  children,
  viewer,
  viewsFeed,
  viewsFeedKeys,
  appliedView: preloadedView,
  viewsType,
  getViewsFeed,
  createViewByTag,
  createViewBySource,
  removeView,
  isLoadingViewFeed,
  onRestoreFocus,
}) {
  const {
    registerMenuItem,
    cleanupMenuItem,

    registerMenuRef,
    cleanupMenu,

    moveSelectionOnClick,
    scrollMenuToRightEdge,
    scrollMenuToLeftEdge,
  } = useHandleViewsNavigation();

  const [
    isCreateMenuOpen,
    { openCreateMenu, closeCreateMenu, toggleCreateMenu },
  ] = useCreateMenuVisibility();

  // NOTE(amine): display the new feed once it's loaded
  const appliedView = useSetAppliedFeedOnceFeedIsLoaded({
    preloadedView,
    isLoadingViewFeed,
  });

  const VIEWS_ACTIONS = React.useMemo(() => {
    const actions = [];
    if (!isNewTab) {
      actions.push(defaultViews.allOpen);
    }

    actions.push(defaultViews.saved);

    if (viewer.settings?.isFilesViewActivated) {
      actions.push(defaultViews.files);
    }

    if (viewer.settings?.isRecentViewActivated) {
      actions.push(defaultViews.recent);
    }

    return actions;
  }, [viewer.settings]);

  const removeViewAndFocusPrevView = React.useCallback(
    (view) => {
      let viewIndex = viewer.views.findIndex((item) => item.id === view.id);

      if (view.id === preloadedView.id) {
        let prevView = viewer.views[viewIndex - 1];
        if (!prevView) {
          prevView = VIEWS_ACTIONS[VIEWS_ACTIONS.length - 1];
        }
        getViewsFeed(prevView);
      }

      removeView(view.id);
    },
    [VIEWS_ACTIONS, getViewsFeed, preloadedView, removeView, viewer.views]
  );

  const disableRecentOrFilesViewAndFocusPrevView = React.useCallback(
    (view) => {
      const viewIndex = VIEWS_ACTIONS.findIndex((item) => item.id === view.id);
      if (view.type === viewsType.recent) {
        if (preloadedView.id === view.id) {
          const prevView = VIEWS_ACTIONS[viewIndex - 1];
          getViewsFeed(prevView);
        }
        viewer.updateViewerSettings({
          isRecentViewActivated: false,
        });
        return;
      }

      if (view.type === viewsType.files) {
        if (preloadedView.id === view.id) {
          const prevView = VIEWS_ACTIONS[viewIndex - 1];
          getViewsFeed(prevView);
        }
        viewer.updateViewerSettings({
          isFilesViewActivated: false,
        });
      }
    },
    [VIEWS_ACTIONS, viewer, getViewsFeed, preloadedView, viewsType]
  );

  const value = React.useMemo(
    () => ({
      VIEWS_ACTIONS,

      viewer,
      viewsFeed,
      viewsFeedKeys,
      preloadedView,
      appliedView,
      isLoadingViewFeed,
      viewsType,
      getViewsFeed,
      createViewByTag,
      createViewBySource,
      removeViewAndFocusPrevView,
      disableRecentOrFilesViewAndFocusPrevView,

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
      VIEWS_ACTIONS,
      viewer,
      appliedView,
      preloadedView,
      viewsFeed,
      viewsFeedKeys,
      isLoadingViewFeed,
      viewsType,
      getViewsFeed,
      createViewByTag,
      createViewBySource,
      removeViewAndFocusPrevView,
      disableRecentOrFilesViewAndFocusPrevView,

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
  closeCreateMenu,
  ...props
}) => {
  useEscapeKey(closeCreateMenu);

  const {
    viewer,
    disableRecentOrFilesViewAndFocusPrevView,
    scrollMenuToLeftEdge,
  } = useViewsContext();

  const handleToggleRecentView = () => {
    if (viewer.settings.isRecentViewActivated) {
      disableRecentOrFilesViewAndFocusPrevView(defaultViews.recent);
      return;
    }

    viewer.updateViewerSettings({ isRecentViewActivated: true });
    scrollMenuToLeftEdge();
  };

  const handleToggleFilesView = () => {
    if (viewer.settings.isFilesViewActivated) {
      disableRecentOrFilesViewAndFocusPrevView(defaultViews.files);
      return;
    }

    viewer.updateViewerSettings({ isFilesViewActivated: true });
    scrollMenuToLeftEdge();
  };

  const actions = React.useMemo(
    () => [
      { label: "Source", handler: goToSourceScene },
      { label: "Tag", handler: goToTagScene },
      {
        label: "Recent",
        handler: handleToggleRecentView,
        isApplied: viewer.settings?.isRecentViewActivated,
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
    <section style={{ padding: 8 }} {...props}>
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
    createViewBySource,
    scrollMenuToRightEdge,
    removeViewAndFocusPrevView,
  } = useViewsContext();

  const { filteredSources, searchValue, setSearchValue } = useSourcesCombobox({
    sources,
  });

  const handleOnInputChange = (e) => setSearchValue(e.target.value);

  useEscapeKey(goToInitialScene);

  const handleRemoveView = (source) => {
    const view = viewer.viewsSourcesLookup[source];
    removeViewAndFocusPrevView(view);
  };

  const handleCreateView = (source) => {
    createViewBySource(source);
    scrollMenuToRightEdge();
  };

  // NOTE(amine): to prevent conflicts with global hotkeys
  const preventPropagation = (e) => {
    if (e.keyCode > 46 && !(e.shiftKey || e.altKey)) {
      e.stopPropagation();
    }
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
              onKeyUp={preventPropagation}
              onKeyDown={preventPropagation}
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
                ? handleRemoveView
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
            {filteredSources.length === 0 && (
              <Typography.H5
                color="textBlack"
                style={{ padding: "5px 12px 7px" }}
              >
                No sources found
              </Typography.H5>
            )}
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
  max-height: 268px;
  overflow-y: auto;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const CreateMenuTagScene = ({ goToInitialScene, ...props }) => {
  useEscapeKey(goToInitialScene);

  const {
    viewer,
    createViewByTag,
    scrollMenuToRightEdge,
    removeViewAndFocusPrevView,
  } = useViewsContext();

  const { slates, searchValue, setSearchValue } = useSlatesCombobox({
    slates: viewer.slates,
  });
  const handleOnInputChange = (e) => setSearchValue(e.target.value);

  const handleRemoveView = (slateName) => {
    const view = viewer.viewsSlatesLookup[slateName];
    removeViewAndFocusPrevView(view);
  };

  const handleCreateView = (slateName) => {
    createViewByTag(slateName);
    scrollMenuToRightEdge();
  };

  // NOTE(amine): to prevent conflicts with global hotkeys
  const preventPropagation = (e) => {
    if (e.keyCode > 46 && !(e.shiftKey || e.altKey)) {
      e.stopPropagation();
    }
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
              onKeyDown={preventPropagation}
              onKeyUp={preventPropagation}
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
                ? handleRemoveView
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
            {slates.length === 0 && (
              <Typography.H5
                color="textBlack"
                style={{ padding: "5px 12px 7px" }}
              >
                No tags found
              </Typography.H5>
            )}
          </div>
        </Combobox.Menu>
      </Combobox.Provider>
    </section>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const STYLES_CREATE_MENU_WRAPPER = css`
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

  const sources = useSources();

  React.useLayoutEffect(() => onRestoreFocus, []);

  return (
    <Boundary enabled onOutsideRectEvent={closeCreateMenu}>
      <section css={STYLES_CREATE_MENU_WRAPPER}>
        <Switch {...props}>
          <Match
            when={scene === scenes.initial}
            component={CreateMenuInitialScene}
            goToTagScene={goToTagScene}
            goToSourceScene={goToSourceScene}
            closeCreateMenu={closeCreateMenu}
          />
          <Match
            when={scene === scenes.tag}
            component={CreateMenuTagScene}
            goToInitialScene={goToInitialScene}
          />
          <Match
            when={scene === scenes.source}
            component={CreateMenuSourceScene}
            goToInitialScene={goToInitialScene}
            sources={sources}
          />
        </Switch>
      </section>
    </Boundary>
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
const STYLES_VIEWS_BUTTON_WRAPPER = (theme) => css`
  position: relative;

  &:hover .views_menu_button {
    color: ${theme.semantic.textBlack};
    background-color: ${theme.semantic.bgGrayLight4};
  }
  &:hover-within .views_menu_button {
    color: ${theme.semantic.textBlack};
    background-color: ${theme.semantic.bgGrayLight4};
  }

  @keyframes active_remove_button {
    from {
      opacity: 0;
      pointer-events: none;
    }
    to {
      opacity: 1;
      pointer-events: unset;
    }
  }

  .views_menu_remove_button {
    opacity: 0;
    pointer-events: none;
  }
  &:hover .views_menu_remove_button {
    animation: active_remove_button 0.2s;
    animation-delay: 200ms;
    animation-fill-mode: forwards;
  }

  &:hover-within .views_menu_remove_button {
    animation: active_remove_button 0.2s;
    animation-delay: 200ms;
    animation-fill-mode: forwards;
  }
`;

const STYLES_VIEWS_BUTTON_ACTIVE = (theme) => css`
  color: ${theme.semantic.textBlack};
  transition: color 0.25s;
`;

const STYLES_VIEWS_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  position: relative;
  padding: 5px 12px 7px;
  color: ${theme.semantic.textGray};
  border-radius: 12px;
  white-space: nowrap;
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

const STYLES_VIEWS_REMOVE_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 10px 6px;
  background: linear-gradient(
    270deg,
    #d1d4d6 70.83%,
    rgba(209, 212, 214, 0) 100%
  );
  color: ${theme.semantic.textGray} !important;
  border-radius: 12px;
`;

const MenuItem = ({
  isViewApplied,
  rootDomain,
  favicon,
  isSlateView,
  isSourceView,
  children,
  index,
  onClick,
  onSubmit,
  onRemove,
  style,
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
    <div
      style={{ position: "relative", ...style }}
      ref={ref}
      css={STYLES_VIEWS_BUTTON_WRAPPER}
    >
      <ShortcutsTooltip
        horizontal="right"
        vertical="below"
        label="Navigate Spaces"
        keyTrigger={isUsingMac() ? "⌥ Tab / ⌥ Shift Tab" : "Ctrl →/←"}
      >
        <Typography.H5
          css={[
            STYLES_VIEWS_BUTTON,
            isViewApplied && STYLES_VIEWS_BUTTON_ACTIVE,
          ]}
          as="button"
          onClick={mergeEvents(onClick, () => moveSelectionOnClick(index))}
          tabIndex="-1"
          className="views_menu_button"
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
      </ShortcutsTooltip>
      {onRemove && (
        <button
          onClick={onRemove}
          className="views_menu_remove_button"
          tabIndex="-1"
          css={STYLES_VIEWS_REMOVE_BUTTON}
        >
          <SVG.Dismiss height={12} width={12} />
        </button>
      )}
    </div>
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

const useHandleScrollNavigation = ({ containerRef }) => {
  const { isMenuOverflowingFrom, setMenuOverflowFrom } = useViewsMenuContext();

  const { viewer } = useViewsContext();

  const handleActionWrapperScroll = () => {
    const wrapper = containerRef.current;
    if (!wrapper) return;

    setMenuOverflowFrom((prev) => {
      const newState = {
        right: wrapper.scrollLeft + wrapper.offsetWidth < wrapper.scrollWidth,
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

  React.useEffect(handleActionWrapperScroll, [viewer.views.length]);

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
    wrapper.scrollTo({ left: wrapper.scrollLeft + 350, behavior: "smooth" });
  };

  const scrollToLeft = () => {
    const wrapper = containerRef.current;
    wrapper.scrollTo({ left: wrapper.scrollLeft - 350, behavior: "smooth" });
  };

  return { scrollToLeft, scrollToRight };
};

function Menu({ css, actionsWrapperStyle, ...props }) {
  const {
    VIEWS_ACTIONS,

    viewer,

    preloadedView,
    getViewsFeed,
    removeViewAndFocusPrevView,
    disableRecentOrFilesViewAndFocusPrevView,

    scrollButtonCss,

    registerMenuRef,
    cleanupMenu,

    isCreateMenuOpen,
    toggleCreateMenu,
  } = useViewsContext();

  const { isMenuOverflowingFrom } = useViewsMenuContext();

  React.useLayoutEffect(() => cleanupMenu, []);

  const createOnClickHandler = (view) => () => getViewsFeed(view);

  const preventActionButtonFocus = (e) => e.preventDefault();

  const actionWrapperRef = React.useRef();
  const { scrollToLeft, scrollToRight } = useHandleScrollNavigation({
    containerRef: actionWrapperRef,
  });

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
            const isApplied = preloadedView.id === view.id;

            const isRecentOrFilesView =
              view.type === viewsType.recent || view.type === viewsType.files;

            const handleOnRemove = () => {
              disableRecentOrFilesViewAndFocusPrevView(view);
            };

            return (
              <MenuItem
                isViewApplied={isApplied}
                key={view.name}
                style={{ marginLeft: i > 0 ? 4 : 0 }}
                onMouseDown={preventActionButtonFocus}
                onClick={createOnClickHandler(view)}
                onSubmit={createOnClickHandler(view)}
                onRemove={isRecentOrFilesView && handleOnRemove}
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
            const isApplied = preloadedView.id === view.id;
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
                index={VIEWS_ACTIONS.length + i}
                onClick={createOnClickHandler(view)}
                onSubmit={createOnClickHandler(view)}
                onRemove={() => removeViewAndFocusPrevView(view)}
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

      <ShortcutsTooltip
        label="Create New Space"
        vertical={isNewTab ? "below" : "above"}
        keyTrigger="N"
      >
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

  if (visit.isPadding) {
    return <div style={{ ...style, height: visit.value }} />;
  }

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
        <ListView.VariableSizeListRoot
          height={listHeight}
          ref={forwardedRef}
          {...props}
        >
          {children}
        </ListView.VariableSizeListRoot>
      </RovingTabIndex.List>
    );
  }
);

/* -----------------------------------------------------------------------------------------------*/

const STYLES_VIEWS_SLATES_EMPTY_BUTTON = (theme) => css`
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  height: 32px;
  padding: 5px 12px 7px;
  background-color: ${theme.semantic.bgGrayLight};
  border-radius: 12px;
  color: ${theme.semantic.textBlack};
`;

function ViewsSlatesEmptyState({ appliedView }) {
  return (
    <section css={Styles.VERTICAL_CONTAINER_CENTERED} style={{ width: "100%" }}>
      <Typography.H4 as="p" color="textBlack" style={{ marginTop: 80 }}>
        You don’t have any links or files tagged with
      </Typography.H4>
      <div style={{ marginTop: 8 }} css={STYLES_VIEWS_SLATES_EMPTY_BUTTON}>
        <SVG.Hash height={16} width={16} />
        <Typography.H5 as="p" color="textBlack" style={{ marginLeft: 4 }}>
          {appliedView.name}
        </Typography.H5>
      </div>
      <Divider style={{ marginTop: 24, marginBottom: 24 }} width={80} />
      <Typography.H4 as="p" color="textBlack">
        Start tagging links and files with
      </Typography.H4>
      <SavingKeyboardShortcut style={{ marginTop: 8 }} />
    </section>
  );
}

/* -----------------------------------------------------------------------------------------------*/

const ViewsHistoryLoadingState = () => {
  return (
    <section css={Styles.VERTICAL_CONTAINER_CENTERED} style={{ width: "100%" }}>
      <div style={{ marginTop: 162 }}>
        <LoadingSpinner style={{ color: Constants.semantic.textBlack }} />
      </div>
      <Typography.H4 as="p" color="textBlack" style={{ marginTop: 8 }}>
        Updating your library
      </Typography.H4>
    </section>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const STYLES_VIEWS_SOURCE_EMPTY_BUTTON = (theme) => css`
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  height: 32px;
  padding: 5px 12px 7px;
  background-color: ${theme.semantic.bgGrayLight};
  border-radius: 12px;
`;

function ViewsSourceEmptyState({ appliedView }) {
  const rootDomain = React.useMemo(
    () => getRootDomain(appliedView.filterBySource),
    [appliedView]
  );
  return (
    <section css={Styles.VERTICAL_CONTAINER_CENTERED} style={{ width: "100%" }}>
      <Typography.H4 as="p" color="textBlack" style={{ marginTop: 80 }}>
        You don’t have any links from
      </Typography.H4>
      <div style={{ marginTop: 8 }} css={STYLES_VIEWS_SOURCE_EMPTY_BUTTON}>
        <Favicon src={appliedView.metadata?.favicon} rootDomain={rootDomain} />
        <Typography.H5 as="p" color="textBlack" style={{ marginLeft: 4 }}>
          {appliedView.name}
        </Typography.H5>
      </div>
      <Divider style={{ marginTop: 24, marginBottom: 24 }} width={80} />
      <Typography.H4 as="p" color="textBlack">
        Start saving links to Slate with
      </Typography.H4>
      <SavingKeyboardShortcut style={{ marginTop: 8 }} />
    </section>
  );
}

/* -----------------------------------------------------------------------------------------------*/

const useManageFeedAutoFocus = ({
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
      currentSettings.isRecentViewActivated &&
      !prevSettings.isRecentViewActivated
    ) {
      shouldFocus.current = false;
      getViewsFeed(defaultViews.recent);
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

  // NOTE(amine): focus the feed when the applied view changes and if the search input isn't in focus
  const searchContext = useSearchContext();
  React.useLayoutEffect(() => {
    if (!shouldFocus.current || searchContext?.isSearchInputFocused) {
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
        isFetchingHistoryFirstBatch,

        windowsFeed,
        windowsFeedKeys,
        onCloseTabs,
        activeTabId,

        ...props
      },
      ref
    ) => {
      const {
        viewer,
        viewsFeed,
        viewsFeedKeys,
        appliedView,
        isLoadingViewFeed,
        getViewsFeed,
        onRestoreFocus,
      } = useViewsContext();

      const handleOnSubmitSelectedItem = (index) => viewsFeed[index];

      const viewsFeedItemsData = React.useMemo(() => {
        if (viewsFeedKeys) {
          return {
            feed: [],
            totalSelectableItems: 0,
            props: {
              onOpenUrl,
              onOpenSlatesJumper,
            },
          };
        }
        return {
          feed: viewsFeed,
          totalSelectableItems: viewsFeed.length,
          props: {
            onOpenUrl,
            onOpenSlatesJumper,
          },
        };
      }, [viewsFeed]);

      const handleRestoreFocus = () => {
        if (!ref.rovingTabIndexRef) return;
        ref.rovingTabIndexRef.focus(onRestoreFocus);
      };

      useManageFeedAutoFocus({
        viewer,
        getViewsFeed,
        onRestoreFocus: handleRestoreFocus,

        appliedView,
      });

      if (
        appliedView.type === viewsType.saved ||
        appliedView.type === viewsType.files
      ) {
        return (
          <SavedObjectsFeed
            ref={ref}
            onOpenUrl={onOpenUrl}
            onOpenSlatesJumper={onOpenSlatesJumper}
            onGroupURLs={onGroupURLs}
            onRestoreFocus={onRestoreFocus}
            feed={viewsFeed}
            feedKeys={viewsFeedKeys}
            {...props}
          />
        );
      }

      if (appliedView.type === viewsType.allOpen) {
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
            onRestoreFocus={handleRestoreFocus}
            {...props}
          />
        );
      }

      if (appliedView.type === viewsType.recent) {
        if (isFetchingHistoryFirstBatch) {
          return <ViewsHistoryLoadingState />;
        }

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
            onRestoreFocus={handleRestoreFocus}
            {...props}
          />
        );
      }

      if (viewsFeedItemsData.totalSelectableItems === 0) {
        if (isLoadingViewFeed) return null;

        return (
          <Switch>
            <Match
              when={appliedView.filterBySource}
              component={ViewsSourceEmptyState}
              appliedView={appliedView}
            />
            <Match
              when={appliedView.filterBySlateId}
              component={ViewsSlatesEmptyState}
              appliedView={appliedView}
            />
          </Switch>
        );
      }

      const getFeedItemHeight = () => Constants.sizes.jumperFeedItem;

      return (
        <RovingTabIndex.Provider
          key={appliedView.id}
          ref={(node) => (ref.rovingTabIndexRef = node)}
          isInfiniteList
          withFocusOnHover
        >
          <MultiSelection.Provider
            totalSelectableItems={viewsFeedItemsData.totalSelectableItems}
            onSubmitSelectedItem={handleOnSubmitSelectedItem}
            onRestoreFocus={handleRestoreFocus}
          >
            <ViewsFeedList
              itemCount={viewsFeedItemsData.feed.length}
              itemData={viewsFeedItemsData}
              itemSize={getFeedItemHeight}
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

export { Provider, MenuProvider, Menu, CreateMenu, Feed };
