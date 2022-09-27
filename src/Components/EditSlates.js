import * as React from "react";
import * as Styles from "../common/styles";
import * as SVG from "../common/SVG";
import * as Typography from "../components/system/Typography";
import * as Strings from "../common/strings";
import * as Validations from "../common/validations";

import { css } from "@emotion/react";
import { Combobox, useComboboxNavigation } from "./ComboboxNavigation";
import { getFavicon } from "../common/favicons";
import { useEscapeKey } from "../common/hooks";

/* -------------------------------------------------------------------------------------------------
 * Provider
 * -----------------------------------------------------------------------------------------------*/

const EditSlatesContext = React.createContext({});

const useEditSlatesContext = () => React.useContext(EditSlatesContext);

export const useSlatesCombobox = ({
  slates: slatesProp,
  checkIfSlateIsApplied,
}) => {
  const [searchValue, setSearchValue] = React.useState("");

  const slates = React.useMemo(() => {
    if (searchValue === "") {
      if (!checkIfSlateIsApplied) return slatesProp;
      const sortByIfApplied = (slateA, slateB) => {
        if (checkIfSlateIsApplied(slateA) && checkIfSlateIsApplied(slateB)) {
          return 0;
        }
        if (checkIfSlateIsApplied(slateA)) {
          return -1;
        }
        return 1;
      };
      return slatesProp.sort(sortByIfApplied);
    }

    const searchRegex = new RegExp(searchValue, "gi");
    return slatesProp.filter((slate) => {
      return searchRegex.test(slate);
    });
  }, [slatesProp.length, searchValue]);

  const canCreateSlate = React.useMemo(() => {
    if (searchValue === "") return false;

    return !slates.some((slate) => slate === searchValue);
  }, [slates, searchValue]);

  return { slates, canCreateSlate, searchValue, setSearchValue };
};

const Provider = ({
  children,
  objects,
  slates: slatesProp,
  checkIfSlateIsApplied,

  onCreateSlate,
  onAddObjectsToSlate,
  onRemoveObjectsFromSlate,
}) => {
  const { slates, canCreateSlate, searchValue, setSearchValue } =
    useSlatesCombobox({ slates: slatesProp, checkIfSlateIsApplied });

  const contextValue = React.useMemo(
    () => ({
      searchValue,
      setSearchValue,
      slates,
      objects,
      canCreateSlate,
      onCreateSlate,
      onAddObjectsToSlate,
      onRemoveObjectsFromSlate,
      checkIfSlateIsApplied,
    }),
    [
      searchValue,
      canCreateSlate,
      setSearchValue,
      slates,
      objects,
      onCreateSlate,
      onAddObjectsToSlate,
      onRemoveObjectsFromSlate,
      checkIfSlateIsApplied,
    ]
  );

  return (
    <EditSlatesContext.Provider value={contextValue}>
      <Combobox.Provider>{children}</Combobox.Provider>
    </EditSlatesContext.Provider>
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
  paddingtop: 8px;
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

function Dismiss({ css, onDimiss, ...props }) {
  useEscapeKey(onDimiss);
  return (
    <button css={[STYLES_DISMISS_BUTTON, css]} onClick={onDimiss} {...props}>
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

const useEditSlatesInput = () => {
  const { searchValue, setSearchValue } = useEditSlatesContext();
  const handleInputChange = (e) => {
    const nextValue = e.target.value;
    //NOTE(amine): allow input's value to be empty but keep other validations
    if (Strings.isEmpty(nextValue) || Validations.slatename(nextValue)) {
      setSearchValue(Strings.createSlug(nextValue, ""));
    }
  };
  const clearInputValue = () => setSearchValue("");

  return [searchValue, { handleInputChange, clearInputValue }];
};

const Input = ({ ...props }) => {
  const [value, { handleInputChange, clearInputValue }] = useEditSlatesInput();

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
          placeholder="Search or create a tag"
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
        <Dismiss onDimiss={() => (focusInput(), clearInputValue())} />
      ) : null}
    </section>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Top Panel
 * -----------------------------------------------------------------------------------------------*/

const STYLES_TOP_PANEL_WRAPPER = css`
  height: 48px;
  padding: 0px 16px;
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
`;

const STYLES_FAVICONS_WRAPPER = (theme) => css`
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  color: ${theme.semantic.textBlack};
  & > * + * {
    margin-left: 8px;
  }
`;

const TopPanel = () => {
  const { objects } = useEditSlatesContext();
  const Favicons = React.useMemo(() => {
    return objects.slice(0, 3).map(({ rootDomain }) => getFavicon(rootDomain));
  }, [objects]);

  return (
    <div css={STYLES_TOP_PANEL_WRAPPER}>
      <div css={STYLES_FAVICONS_WRAPPER}>
        {Favicons.map((Favicon, index) => (
          <Favicon key={index} />
        ))}
      </div>
      <div
        css={Styles.HORIZONTAL_CONTAINER_CENTERED}
        style={{ marginLeft: 12 }}
      >
        <Typography.H5 color="textBlack" nbrOflines={1}>
          {objects[0].title}
          {objects.length > 1 && " and" + ` ${objects.length - 1} more`}
        </Typography.H5>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Body
 * -----------------------------------------------------------------------------------------------*/

const STYLES_RETURN_KEY = (theme) => css`
  padding: 0px 2px;
  border-radius: 6px;
  background-color: ${theme.semantic.bgBlurLightOP};
`;

const KeyboardInteractionHint = ({ children, ...props }) => {
  return (
    <div css={Styles.HORIZONTAL_CONTAINER_CENTERED} {...props}>
      <Typography.P3 color="textGrayDark">{children}</Typography.P3>
      <Typography.P3
        css={STYLES_RETURN_KEY}
        color="textGray"
        style={{ marginLeft: 4 }}
      >
        ⏎
      </Typography.P3>
    </div>
  );
};

const STYLES_BODY_WRAPPER = css`
  height: 100%;
  flex: 1;
  padding: 8px 0px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
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

const STYLES_SLATES_MENU_BUTTON_BLUE = (theme) => css`
  ${STYLES_OBJECT(theme)};
  color: ${theme.system.blue};
  &:hover {
    color: ${theme.system.blue};
  }
`;

const STYLES_OBJECT_SELECTED = (theme) => css`
  background-color: ${theme.semantic.bgGrayLight};
`;

const Body = ({ ...props }) => {
  const {
    slates,
    objects,
    searchValue,
    setSearchValue,
    canCreateSlate,

    checkIfSlateIsApplied,
    onCreateSlate,
    onAddObjectsToSlate,
    onRemoveObjectsFromSlate,
  } = useEditSlatesContext();
  const { checkIfIndexSelected } = useComboboxNavigation();

  const createSlateActionHandler =
    ({ slateName, isApplied }) =>
    () => {
      if (isApplied) {
        onRemoveObjectsFromSlate({ slateName, objects });
      } else {
        onAddObjectsToSlate({ slateName, objects });
      }
      setTimeout(() => {
        setSearchValue("");
      }, 100);
    };

  const handleCreateSlate = () => {
    onCreateSlate({ slateName: searchValue, objects });
    setSearchValue("");
  };

  return (
    <Combobox.Menu>
      <div css={STYLES_BODY_WRAPPER} {...props}>
        {slates.map((slate, index) => {
          const isButtonSelected = checkIfIndexSelected(index);
          const isSlateApplied = checkIfSlateIsApplied(slate);

          return (
            <Combobox.MenuButton
              onSubmit={createSlateActionHandler({
                slateName: slate,
                isApplied: isSlateApplied,
              })}
              onClick={createSlateActionHandler({
                slateName: slate,
                isApplied: isSlateApplied,
              })}
              key={slate}
              index={index}
            >
              <button
                css={[
                  STYLES_OBJECT,
                  isButtonSelected && STYLES_OBJECT_SELECTED,
                ]}
              >
                <SVG.Hash height={16} width={16} />
                <Typography.H5
                  as="span"
                  nbrOflines={1}
                  color="textBlack"
                  style={{ marginLeft: 12 }}
                >
                  {slate}
                </Typography.H5>
                <div
                  css={Styles.HORIZONTAL_CONTAINER_CENTERED}
                  style={{ marginLeft: "auto" }}
                >
                  {isButtonSelected && (
                    <KeyboardInteractionHint>
                      {isSlateApplied ? "remove tag" : "apply tag"}
                    </KeyboardInteractionHint>
                  )}
                  {isSlateApplied && (
                    <div style={{ marginLeft: 8, padding: 2 }}>
                      <SVG.CheckCircle />
                    </div>
                  )}
                </div>
              </button>
            </Combobox.MenuButton>
          );
        })}
        {canCreateSlate && (
          <Combobox.MenuButton
            index={slates.length}
            onClick={handleCreateSlate}
            onSubmit={handleCreateSlate}
          >
            <button
              css={[
                STYLES_SLATES_MENU_BUTTON_BLUE,
                checkIfIndexSelected(slates.length) && STYLES_OBJECT_SELECTED,
              ]}
            >
              <SVG.Hash style={{ opacity: 0 }} height={16} width={16} />
              <Typography.H5
                as="span"
                nbrOflines={2}
                style={{ marginLeft: 12 }}
              >
                create new tag “{searchValue}”
              </Typography.H5>
              {checkIfIndexSelected(slates.length) && (
                <KeyboardInteractionHint style={{ marginLeft: "auto" }}>
                  create tag
                </KeyboardInteractionHint>
              )}
            </button>
          </Combobox.MenuButton>
        )}
      </div>
    </Combobox.Menu>
  );
};

export { Provider, Input, TopPanel, Body };
