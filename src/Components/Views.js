import * as React from "react";
import * as Typography from "../Components/system/Typography";
import * as Styles from "../Common/styles";
import * as ListView from "../Components/ListView";
import * as SVG from "../Common/SVG";
import * as Favicons from "../Common/favicons";
import * as RovingTabIndex from "./RovingTabIndex";

import { css } from "@emotion/react";
import { getFavicon } from "../Common/favicons";
import { viewsType } from "../Core/views";
import { Divider } from "./Divider";
import { useEventListener } from "Common/hooks";
import { motion, AnimateSharedLayout, AnimatePresence } from "framer-motion";
import { mergeRefs, mergeEvents } from "../Common/utilities";

const VIEWS_ACTIONS = [
  { label: "Current Window", data: { type: viewsType.currentWindow } },
  { label: "All Open", data: { type: viewsType.allOpen } },
  { label: "Recent", data: { type: viewsType.recent } },
  { label: "Saved Files", data: { type: viewsType.savedFiles } },
];

const CUSTOM_VIEWS_ACTIONS = [
  {
    label: "Twitter",
    data: { type: viewsType.relatedLinks, query: "https://twitter.com/" },
    Favicon: Favicons.getFavicon("twitter.com"),
  },
  {
    label: "Hacker News",
    data: {
      type: viewsType.relatedLinks,
      query: "https://news.ycombinator.com",
    },
    Favicon: Favicons.getFavicon("ycombinator.com"),
  },
  {
    label: "Youtube",
    data: { type: viewsType.relatedLinks, query: "https://www.youtube.com/" },
    Favicon: Favicons.getFavicon("youtube.com"),
  },
  {
    label: "Figma",
    data: { type: viewsType.relatedLinks, query: "https://www.figma.com/" },
    Favicon: Favicons.getFavicon("figma.com"),
  },
  {
    label: "Notion",
    data: { type: viewsType.relatedLinks, query: "https://www.notion.so/" },
    Favicon: Favicons.getFavicon("notion.so"),
  },
  {
    label: "Google Search",
    data: {
      type: viewsType.relatedLinks,
      query: "https://www.google.com/search",
    },
    Favicon: Favicons.getFavicon("google.com"),
  },
  {
    label: "Google Calendar",
    data: {
      type: viewsType.relatedLinks,
      query: "https://calendar.google.com/",
    },
    Favicon: Favicons.getFavicon("google.com"),
  },
];

/* -------------------------------------------------------------------------------------------------
 * Views Provider
 * -----------------------------------------------------------------------------------------------*/

const ViewsContext = React.createContext();
const useViewsContext = () => React.useContext(ViewsContext);

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
    isNavigatingViaKeyboard.current = false;
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

    moveSelectionOnClick,
  };
};

function Provider({
  children,
  viewsFeed,
  currentView,
  currentViewQuery,
  viewsType,
  getViewsFeed,
  onChange,
}) {
  React.useLayoutEffect(() => {
    if (onChange) onChange();
  }, [currentView, currentViewQuery]);

  const {
    registerMenuItem,
    cleanupMenuItem,

    registerMenuRef,
    cleanupMenu,

    moveSelectionOnClick,
  } = useHandleViewsNavigation();

  const value = React.useMemo(
    () => ({
      viewsFeed,
      currentView,
      currentViewQuery,
      viewsType,
      getViewsFeed,
      onChange,

      registerMenuItem,
      cleanupMenuItem,
      registerMenuRef,
      cleanupMenu,
      moveSelectionOnClick,
    }),
    [
      viewsFeed,
      currentView,
      currentViewQuery,
      viewsType,
      onChange,
      getViewsFeed,

      registerMenuItem,
      cleanupMenuItem,
      registerMenuRef,
      cleanupMenu,
      moveSelectionOnClick,
    ]
  );

  return (
    <ViewsContext.Provider value={value}>{children}</ViewsContext.Provider>
  );
}

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

function Menu({ css, showAllOpenAction, ...props }) {
  const {
    currentView,
    currentViewQuery,
    getViewsFeed,

    scrollButtonCss,

    registerMenuRef,
    cleanupMenu,
  } = useViewsContext();

  React.useLayoutEffect(() => cleanupMenu, []);

  const createOnClickHandler =
    ({ type, query }) =>
    () =>
      getViewsFeed({ type, query });

  const actionWrapperRef = React.useRef();
  const [isOverflowFrom, { scrollToLeft, scrollToRight }] =
    useHandleScrollNavigation({ containerRef: actionWrapperRef });

  // NOTE(amine): remove All Open action if only one window is open
  const FILTERED_VIEWS_ACTIONS = React.useMemo(() => {
    const filterOutAllOpenIfOneWindowIsOpen = (viewAction) =>
      !(viewAction.data.type === viewsType.allOpen && !showAllOpenAction);

    return VIEWS_ACTIONS.filter(filterOutAllOpenIfOneWindowIsOpen);
  }, [showAllOpenAction]);

  return (
    <section css={[STYLES_VIEWS_MENU_WRAPPER, css]} {...props}>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div
          css={STYLES_VIEWS_MENU_ACTIONS}
          ref={mergeRefs([actionWrapperRef, registerMenuRef])}
          style={{ paddingRight: 132 }}
        >
          <AnimateSharedLayout>
            {FILTERED_VIEWS_ACTIONS.map((viewAction, i) => {
              const isApplied = currentView === viewAction.data.type;
              return (
                <MenuItem
                  key={viewAction.label}
                  isViewApplied={isApplied}
                  style={{ marginLeft: i > 0 ? 4 : 0 }}
                  onClick={createOnClickHandler({ type: viewAction.data.type })}
                  onSubmit={createOnClickHandler({
                    type: viewAction.data.type,
                  })}
                  index={i}
                >
                  {viewAction.label}
                </MenuItem>
              );
            })}

            <Divider
              height="none"
              width="1px"
              style={{ margin: "0px 4px", flexShrink: 0 }}
            />

            {CUSTOM_VIEWS_ACTIONS.map((viewAction, i) => {
              const { Favicon } = viewAction;
              const isApplied =
                currentView === viewAction.data.type &&
                currentViewQuery === viewAction.data.query;

              return (
                <MenuItem
                  key={viewAction.label}
                  isViewApplied={isApplied}
                  style={{ marginLeft: 4 }}
                  onClick={createOnClickHandler({
                    type: viewAction.data.type,
                    query: viewAction.data.query,
                  })}
                  onSubmit={createOnClickHandler({
                    type: viewAction.data.type,
                    query: viewAction.data.query,
                  })}
                  index={FILTERED_VIEWS_ACTIONS.length + i}
                  Favicon={Favicon}
                >
                  {viewAction.label}
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

      <button css={STYLES_VIEWS_ADD_BUTTON} style={{ marginLeft: 6 }}>
        <SVG.Plus width={16} height={16} />
      </button>
    </section>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Views Feed
 * -----------------------------------------------------------------------------------------------*/

function Feed({ onObjectHover, onOpenUrl, style, ...props }) {
  const { viewsFeed } = useViewsContext();
  return (
    <RovingTabIndex.Provider>
      <RovingTabIndex.List>
        <ListView.Root style={{ paddingTop: 8, ...style }} {...props}>
          <div key={viewsFeed.length}>
            {viewsFeed.map((visit, i) => (
              <ListView.RovingTabIndexObject
                key={visit.url}
                index={i}
                title={visit.title}
                url={visit.url}
                favicon={visit.favicon}
                relatedVisits={visit.relatedVisits}
                withActions
                isSaved={visit.isSaved}
                Favicon={getFavicon(visit.rootDomain)}
                onClick={() => onOpenUrl({ urls: [visit.url] })}
                onMouseEnter={() => onObjectHover?.({ url: visit.url })}
              />
            ))}
          </div>
        </ListView.Root>
      </RovingTabIndex.List>
    </RovingTabIndex.Provider>
  );
}

export { Provider, Menu, Feed };
