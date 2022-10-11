import * as React from "react";

import { css } from "@emotion/react";

export default function AudioPlaceholder({ ratio = 1, ...props }) {
  const STYLES_PLACEHOLDER = React.useMemo(
    () => css`
      overflow: visible !important;
      width: ${(102 / 248) * 100 * ratio}%;
      height: ${(102 / 248) * 100 * ratio}%;
    `,
    [ratio]
  );

  return (
    <svg
      viewBox="0 0 102 102"
      width={102}
      height={102}
      css={STYLES_PLACEHOLDER}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx={51} cy={51} r={51} fill="url(#prefix__paint0_radial)" />
      <path
        d="M51 61c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10z"
        fill="#F7F8F9"
      />
      <path d="M49 47l6 4-6 4v-8z" fill="#C7CACC" />
      <defs>
        <radialGradient
          id="prefix__paint0_radial"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="rotate(90 0 51) scale(54.7546)"
        >
          <stop stopColor="#C7CACC" />
          <stop offset={1} stopColor="#F7F8F9" />
        </radialGradient>
      </defs>
    </svg>
  );
}
