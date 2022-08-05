import * as React from "react";
import * as Jumper from "../../Components/jumper";
import * as EditSlates from "../../Components/EditSlates";
import * as Styles from "../../Common/styles";
import * as SVG from "../../Common/SVG";

import { useViewer } from "../../Core/viewer/app/jumper";
import { css } from "@emotion/react";
import { useNavigation } from "../../Core/navigation/app/jumper";

const STYLES_BACK_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  border-radius: 8px;
  padding: 2px;
  background-color: ${theme.semantic.bgGrayLight};
  color: ${theme.semantic.textBlack};
`;

export default function Slates() {
  const viewer = useViewer();
  const { navigateToHomeJumper, navigationState } = useNavigation();

  const { searchParams } = navigationState;

  const objects = JSON.parse(searchParams.get("urls"));

  return (
    <EditSlates.Provider objects={objects} viewer={viewer}>
      <Jumper.TopPanel>
        <EditSlates.TopPanel />
      </Jumper.TopPanel>
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
        <EditSlates.Input />
      </Jumper.Header>
      <Jumper.Divider />
      <Jumper.Body>
        <EditSlates.Body />
      </Jumper.Body>
    </EditSlates.Provider>
  );
}
