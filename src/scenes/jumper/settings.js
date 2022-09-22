import * as React from "react";
import * as Jumper from "../../Components/jumper";
import * as EditSettings from "../../Components/EditSettings";
import * as Styles from "../../Common/styles";
import * as SVG from "../../Common/SVG";

import { useViewer } from "../../Core/viewer/app/jumper";
import { css } from "@emotion/react";
import { useNavigation } from "../../Core/navigation/app/jumper";
import { useEscapeKey } from "../../Common/hooks";

const STYLES_BACK_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  border-radius: 8px;
  padding: 2px;
  background-color: ${theme.semantic.bgGrayLight};
  color: ${theme.semantic.textBlack};
`;

export default function Settings() {
  const viewer = useViewer();
  const { navigateToHomeJumper } = useNavigation();

  useEscapeKey(navigateToHomeJumper);

  return (
    <EditSettings.Provider viewer={viewer}>
      <Jumper.Header
        css={Styles.HORIZONTAL_CONTAINER_CENTERED}
        style={{ padding: "0px 16px" }}
      >
        <button
          onClick={navigateToHomeJumper}
          css={STYLES_BACK_BUTTON}
          style={{ marginRight: 12 }}
        >
          <SVG.ChevronLeft height={16} width={16} />
        </button>
        <EditSettings.Input />
      </Jumper.Header>
      <Jumper.Divider />
      <Jumper.Body>
        <EditSettings.Body />
      </Jumper.Body>
    </EditSettings.Provider>
  );
}
