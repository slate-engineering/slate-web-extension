import * as React from "react";
import * as Styles from "../Common/styles";
import * as SVG from "../Common/SVG";
import * as Typography from "../Components/system/Typography";
import * as Constants from "../Common/constants";

import { css } from "@emotion/react";
import { Combobox, useComboboxNavigation } from "./ComboboxNavigation";
import { useEscapeKey } from "../Common/hooks";
import { motion } from "framer-motion";

const STYLES_SWITCH_CONTAINER = css`
  width: 40px;
  padding: 4px;
  border-radius: 100px;
`;

const STYLES_SWITCH = (theme) => css`
  border-radius: 50%;
  width: 16px;
  height: 16px;
  background-color: ${theme.semantic.bgWhite};
`;

const SwitchComponent = ({ isActive }) => (
  <motion.div
    css={STYLES_SWITCH_CONTAINER}
    initial={{
      backgroundColor: isActive
        ? Constants.system.green
        : Constants.semantic.bgGrayLight4,
    }}
    animate={{
      backgroundColor: isActive
        ? Constants.system.green
        : Constants.semantic.bgGrayLight4,
    }}
  >
    <motion.div
      css={STYLES_SWITCH}
      initial={{ x: isActive ? 16 : 0 }}
      animate={{ x: isActive ? 16 : 0 }}
    />
  </motion.div>
);

/* -------------------------------------------------------------------------------------------------
 * Provider
 * -----------------------------------------------------------------------------------------------*/

const EditSettingsContext = React.createContext({});

const useEditSettingsContext = () => React.useContext(EditSettingsContext);

export const useSettingsInput = () => {
  const [searchValue, setSearchValue] = React.useState("");
  return { searchValue, setSearchValue };
};

const useSettingsOptions = ({ filterValue, options }) => {
  return React.useMemo(() => {
    if (filterValue === "") return options;

    const searchRegex = new RegExp(filterValue, "gi");
    return options.filter((option) => {
      return searchRegex.test(option.name);
    });
  }, [filterValue, options]);
};

const Provider = ({
  children,
  viewer,

  onDisableBookmark,
}) => {
  const { searchValue, setSearchValue } = useSettingsInput();

  const onToggleHistorySync = React.useCallback(() => {
    viewer.updateViewerSettings({
      isRecentViewActivated: !viewer.settings?.isRecentViewActivated,
    });
  }, [viewer.settings?.isRecentViewActivated]);

  const DEFAULT_PERMISSION_OPTIONS = React.useMemo(
    () => [
      {
        name: "Sync browser history",
        handler: onToggleHistorySync,
        isEnabled: viewer.settings?.isRecentViewActivated,
      },
      {
        name: "Sync browser bookmark",
        handler: onDisableBookmark,
        isEnabled: viewer.settings?.isBookmarkSyncActivated,
      },
    ],
    [onDisableBookmark, onToggleHistorySync, viewer.settings]
  );

  const DEFAULT_ACCOUNT_SETTINGS = React.useMemo(
    () => [
      {
        name: "Account settings",
        handler: () => window.open(Constants.links.slateAppSettingsPage),
      },
    ],
    []
  );

  const permissionOptions = useSettingsOptions({
    filterValue: searchValue,
    options: DEFAULT_PERMISSION_OPTIONS,
  });
  const accountOptions = useSettingsOptions({
    filterValue: searchValue,
    options: DEFAULT_ACCOUNT_SETTINGS,
  });

  const contextValue = React.useMemo(
    () => ({
      searchValue,
      setSearchValue,
      permissionOptions,
      accountOptions,
    }),
    [searchValue, setSearchValue, permissionOptions, accountOptions]
  );

  return (
    <EditSettingsContext.Provider value={contextValue}>
      <Combobox.Provider>{children}</Combobox.Provider>
    </EditSettingsContext.Provider>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Input
 * -----------------------------------------------------------------------------------------------*/
const DISMISS_BUTTON_WIDTH = 16;
const STYLES_DISMISS_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  height: 32px;
  width: 32px;
  padding: 8px;
  border-radius: 8px;
  color: ${theme.semantic.textGray};

  &:hover {
    background-color: ${theme.semantic.bgGrayLight};
    color: ${theme.semantic.textBlack};
  }

  &:focus {
    background-color: ${theme.semantic.bgGrayLight};
    color: ${theme.semantic.textBlack};
  }
`;

function Dismiss({ css, onDismiss, ...props }) {
  useEscapeKey(onDismiss);

  return (
    <button css={[STYLES_DISMISS_BUTTON, css]} onClick={onDismiss} {...props}>
      <SVG.Dismiss
        style={{ display: "block" }}
        height={DISMISS_BUTTON_WIDTH}
        width={DISMISS_BUTTON_WIDTH}
      />
    </button>
  );
}

const STYLES_SEARCH_WRAPPER = css`
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  position: relative;
  width: 100%;
`;

const STYLES_SEARCH_INPUT = (theme) => css`
  ${Styles.H3};

  font-family: ${theme.font.text};
  -webkit-appearance: none;
  width: 100%;
  height: 56px;
  padding-right: ${DISMISS_BUTTON_WIDTH + 24}px;
  background-color: transparent;
  outline: 0;
  border: none;
  box-sizing: border-box;
  color: ${theme.semantic.textBlack};

  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: ${theme.semantic.textGrayLight};
    opacity: 1; /* Firefox */
  }

  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: ${theme.semantic.textGrayLight};
  }

  ::-ms-input-placeholder {
    /* Microsoft Edge */
    color: ${theme.semantic.textGrayLight};
  }
`;

const useEditSettingsInput = () => {
  const { searchValue, setSearchValue } = useEditSettingsContext();
  const handleInputChange = (e) => {
    const nextValue = e.target.value;
    setSearchValue(nextValue);
  };
  const clearInputValue = () => setSearchValue("");

  return [searchValue, { handleInputChange, clearInputValue }];
};

const Input = ({ ...props }) => {
  const [value, { handleInputChange, clearInputValue }] =
    useEditSettingsInput();

  const inputRef = React.useRef();
  const focusInput = () => inputRef.current.focus();

  // NOTE(amine): to prevent conflicts with global hotkeys
  const preventPropagation = (e) => {
    if (e.keyCode > 46 && !(e.shiftKey || e.altKey)) {
      e.stopPropagation();
    }
  };

  return (
    <section css={STYLES_SEARCH_WRAPPER}>
      <Combobox.Input>
        <input
          css={[STYLES_SEARCH_INPUT, css]}
          ref={inputRef}
          placeholder="Search system settings"
          name="search"
          value={value}
          onChange={handleInputChange}
          autoComplete="off"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          onKeyDown={preventPropagation}
          onKeyUp={preventPropagation}
          {...props}
        />
      </Combobox.Input>

      {value.length > 0 ? (
        <Dismiss onDismiss={() => (focusInput(), clearInputValue())} />
      ) : null}
    </section>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Body
 * -----------------------------------------------------------------------------------------------*/

const STYLES_BODY_WRAPPER = css`
  height: 100%;
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const STYLES_TITLE = css`
  width: 100%;
  padding: 10px 12px;
`;

const STYLES_OBJECT = (theme) => css`
  ${Styles.BUTTON_RESET};
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  color: ${theme.semantic.textBlack};
  &:hover {
    color: ${theme.semantic.textBlack};
  }
`;

const STYLES_OBJECT_SELECTED = (theme) => css`
  background-color: ${theme.semantic.bgGrayLight};
`;

const Body = ({ ...props }) => {
  const { permissionOptions, accountOptions } = useEditSettingsContext();

  const { checkIfIndexSelected } = useComboboxNavigation();

  return (
    <Combobox.Menu>
      <div css={STYLES_BODY_WRAPPER} {...props}>
        {permissionOptions.length !== 0 && (
          <Typography.H5 as="h1" css={STYLES_TITLE} color="textGray">
            Permission
          </Typography.H5>
        )}
        {permissionOptions.map((option, index) => {
          const isButtonSelected = checkIfIndexSelected(index);

          return (
            <Combobox.MenuButton
              onSubmit={option.handler}
              onClick={option.handler}
              key={option.name}
              index={index}
            >
              <button
                css={[
                  STYLES_OBJECT,
                  isButtonSelected && STYLES_OBJECT_SELECTED,
                ]}
              >
                <Typography.H5 as="span" nbrOflines={1} color="textBlack">
                  {option.name}
                </Typography.H5>
                <div
                  css={Styles.HORIZONTAL_CONTAINER_CENTERED}
                  style={{ marginLeft: "auto" }}
                >
                  <SwitchComponent isActive={option.isEnabled} />
                </div>
              </button>
            </Combobox.MenuButton>
          );
        })}

        {accountOptions.length !== 0 && (
          <Typography.H5 as="h1" css={STYLES_TITLE} color="textGray">
            Account
          </Typography.H5>
        )}
        {accountOptions.map((option, index) => {
          const comboboxIndex = permissionOptions.length + index;
          const isButtonSelected = checkIfIndexSelected(comboboxIndex);
          return (
            <Combobox.MenuButton
              onSubmit={option.handler}
              onClick={option.handler}
              key={option.name}
              index={comboboxIndex}
            >
              <button
                css={[
                  STYLES_OBJECT,
                  isButtonSelected && STYLES_OBJECT_SELECTED,
                ]}
              >
                <Typography.H5 as="span" nbrOflines={1} color="textBlack">
                  {option.name}
                </Typography.H5>
              </button>
            </Combobox.MenuButton>
          );
        })}
      </div>
    </Combobox.Menu>
  );
};

export { Provider, Input, Body };
