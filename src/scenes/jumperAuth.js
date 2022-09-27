import * as React from "react";
import * as Styles from "~/common/styles";
import * as SVG from "~/common/SVG";
import * as Jumper from "~/components/jumper";
import * as Constants from "~/common/constants";
import * as Navigation from "~/core/navigation/app/jumper";

import Logo from "~/components/Logo";

import { Input } from "~/components/Input";
import { Divider } from "~/components/jumper";
import { css } from "@emotion/react";
import { isNewTab } from "~/common/utilities";

const STYLES_AUTH_ARROW_BUTTON = (theme) => css`
  background-color: ${theme.system.bgGrayLight4};
  border: none;
  padding: 2px;
  height: 20px;
  width: 20px;
  border-radius: 8px;
  color: ${theme.semantic.textBlack};
`;

function ArrowButton({ disabled, ...props }) {
  return (
    <button
      type="button"
      disabled={disabled}
      css={[
        STYLES_AUTH_ARROW_BUTTON,
        Styles.CONTAINER_CENTERED,
        Styles.HOVERABLE,
      ]}
      {...props}
    >
      <SVG.RightArrow height={16} width={16} />
    </button>
  );
}

/* -----------------------------------------------------------------------------------------------*/
const STYLES_AUTH_BODY = css`
  ${Styles.VERTICAL_CONTAINER_CENTERED};
  width: 300px;
  margin: 0 auto;
`;

const STYLES_TWITTER_AUTH_LINK = (theme) => css`
  display: block;
  width: 100%;
  padding: 9px 0px 11px 0px;

  ${Styles.B1};
  color: ${theme.semantic.bgWhite};
  text-decoration: none;
  text-align: center;

  background-color: ${theme.system.twitterBlue};
  border-radius: 12px;
  box-shadow: ${theme.shadow.lightSmall};
`;

const STYLES_AUTH_SWITCH = (theme) => css`
  border-radius: 32px;
  border: 1px solid ${theme.semantic.borderGrayLight4};
  overflow: hidden;
`;

const STYLES_AUTH_SWITCH_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  ${Styles.B1};
  color: ${theme.semantic.textGray};
  padding: 5px 17px 7px;
  box-shadow: ${theme.shadow.lightSmall};
`;

const STYLES_AUTH_SWITCH_BUTTON_SELECTED = (theme) => css`
  ${Styles.B1};
  color: ${theme.semantic.textBlack};
  background-color: ${theme.semantic.bgGrayLight4};
  transition: background-color 0.25s;
`;

const STYLES_AUTH_INPUT = (theme) => css`
  border-radius: 12px;
  border: 1px solid ${theme.semantic.borderGray};
  box-shadow: ${theme.shadow.lightSmall};
  background-color: transparent;
`;

export default function JumperAuth() {
  const AuthSwitchStates = { login: "LOGIN", signup: "SIGNUP" };
  const [authSwitchState, setAuthSwitchState] = React.useState(
    AuthSwitchStates.login
  );

  const inputValueRef = React.useRef();
  const handleInputChange = (e) => (inputValueRef.current = e.target.value);

  const handleSubmit = () => {
    const slateAuthTab =
      authSwitchState === AuthSwitchStates.login ? "signin" : "signup";
    window.open(
      `${Constants.uri.hostname}/_/auth?tab=${slateAuthTab}&email=${inputValueRef.current}`,
      isNewTab ? "_self" : "_blank"
    );
  };

  const { closeTheJumper } = Navigation.useNavigation();

  // NOTE(amine): to prevent conflicts with global hotkeys
  const preventPropagation = (e) => {
    if (e.keyCode > 46 && !(e.shiftKey || e.altKey)) {
      e.stopPropagation();
    }
  };

  return (
    <Jumper.Root onClose={closeTheJumper}>
      <Jumper.Body>
        <section css={STYLES_AUTH_BODY}>
          <Logo width={33} height={32} style={{ marginTop: 40 }} />
          <a
            href={`${Constants.uri.hostname}/_/auth`}
            target={isNewTab ? "_self" : "_blank"}
            rel="noreferrer"
            style={{ marginTop: 48 }}
            css={STYLES_TWITTER_AUTH_LINK}
          >
            Continue with Twitter
          </a>
          <Divider
            color="borderGrayLight4"
            style={{ marginTop: 32, width: "100%" }}
          />
          <div css={STYLES_AUTH_SWITCH} style={{ marginTop: 32 }}>
            <button
              css={[
                STYLES_AUTH_SWITCH_BUTTON,
                authSwitchState === AuthSwitchStates.login &&
                  STYLES_AUTH_SWITCH_BUTTON_SELECTED,
              ]}
              onClick={() => setAuthSwitchState(AuthSwitchStates.login)}
            >
              Sign in
            </button>
            <button
              css={[
                STYLES_AUTH_SWITCH_BUTTON,
                authSwitchState === AuthSwitchStates.signup &&
                  STYLES_AUTH_SWITCH_BUTTON_SELECTED,
              ]}
              onClick={() => setAuthSwitchState(AuthSwitchStates.signup)}
            >
              Sign up
            </button>
          </div>

          <Input
            autoFocus
            full
            containerStyle={{ marginTop: 20 }}
            inputCss={STYLES_AUTH_INPUT}
            placeholder={
              authSwitchState === AuthSwitchStates.login
                ? "Your email address or username"
                : "Your email address"
            }
            name="username"
            type={authSwitchState === AuthSwitchStates.login ? "text" : "email"}
            icon={ArrowButton}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onKeyDown={preventPropagation}
            onKeyUp={preventPropagation}
          />
        </section>
      </Jumper.Body>
    </Jumper.Root>
  );
}
