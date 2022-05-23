import * as React from "react";
import * as Styles from "../Common/styles";
import * as ListView from "./ListView";
import * as Navigation from "../Core/navigation/app/jumper";
import * as RovingTabIndex from "../Components/RovingTabIndex";

import { css } from "@emotion/react";
import { getFavicon } from "../Common/favicons";

const STYLES_RELATED_LINKS_POPUP_HEADER = css`
  ${Styles.HORIZONTAL_CONTAINER};
  padding: 13px 16px 11px;
`;

const STYLES_OBJECT_PREVIEW_LIST_WRAPPER = css`
  padding: 0px 8px 24px;
  @keyframes object-preview-fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  animation: object-preview-fade-in 250ms ease;
`;

export default function RelatedLinksFeed({ feed, ...props }) {
  return (
    <RovingTabIndex.Provider>
      <RovingTabIndex.List>
        <ListView.Root {...props}>
          <ListView.Section>
            <ListView.Title
              css={STYLES_RELATED_LINKS_POPUP_HEADER}
              count={feed?.length}
            >
              Related
            </ListView.Title>
            <div css={STYLES_OBJECT_PREVIEW_LIST_WRAPPER}>
              {feed &&
                feed.map((visit, i) => (
                  <RovingTabIndex.Item key={visit.id} index={i}>
                    <ListView.Object
                      title={visit.title}
                      Favicon={getFavicon(visit.rootDomain)}
                      onClick={() => Navigation.openUrls({ urls: [visit.url] })}
                      onMouseEnter={(e) => e.target.focus()}
                    />
                  </RovingTabIndex.Item>
                ))}
            </div>
          </ListView.Section>
        </ListView.Root>
      </RovingTabIndex.List>
    </RovingTabIndex.Provider>
  );
}
