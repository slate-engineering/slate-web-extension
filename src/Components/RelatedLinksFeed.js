import * as React from "react";
import * as Styles from "../Common/styles";
import * as ListView from "./ListView";
import * as Navigation from "../Core/navigation/app/jumper";

import { css } from "@emotion/react";
import { getFavicon } from "../Common/favicons";
import { useGetRelatedLinks } from "../Core/history/app";

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

export default function RelatedLinksFeed({ url, ...props }) {
  const relatedLinks = useGetRelatedLinks(url);
  if (!relatedLinks) return null;

  return (
    <ListView.Section {...props}>
      <ListView.Title
        css={STYLES_RELATED_LINKS_POPUP_HEADER}
        count={relatedLinks.length}
      >
        Related
      </ListView.Title>
      <div css={STYLES_OBJECT_PREVIEW_LIST_WRAPPER}>
        {relatedLinks
          .flatMap(({ item: session }) => session.visits)
          .map((visit, i) => (
            <ListView.Object
              key={visit.id + i}
              title={visit.title}
              Favicon={getFavicon(visit.rootDomain)}
              onClick={() => Navigation.openUrls({ urls: [visit.url] })}
              onMouseEnter={(e) => e.target.focus()}
            />
          ))}
      </div>
    </ListView.Section>
  );
}
