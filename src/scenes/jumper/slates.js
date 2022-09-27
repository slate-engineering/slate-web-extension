import * as React from "react";
import * as Jumper from "~/components/jumper";
import * as EditSlates from "~/components/EditSlates";
import * as Styles from "~/common/styles";
import * as SVG from "~/common/SVG";

import { useViewer } from "~/core/viewer/app/jumper";
import { css } from "@emotion/react";
import { useNavigation } from "~/core/navigation/app/jumper";
import { useEscapeKey } from "~/common/hooks";

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

  const urlsQuery = decodeURIComponent(searchParams.get("urls"));
  const objects = JSON.parse(urlsQuery);

  const checkIfSlateIsApplied = (slate) => {
    return objects.every((object) => object.url in viewer.slatesLookup[slate]);
  };

  useEscapeKey(navigateToHomeJumper);

  return (
    <EditSlates.Provider
      objects={objects}
      onCreateSlate={viewer.createSlate}
      onAddObjectsToSlate={viewer.addObjectsToSlate}
      onRemoveObjectsFromSlate={viewer.removeObjectsFromSlate}
      slates={viewer.slates}
      checkIfSlateIsApplied={checkIfSlateIsApplied}
    >
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
