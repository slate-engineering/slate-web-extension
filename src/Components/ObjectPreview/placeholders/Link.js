import * as React from "react";

import { css } from "@emotion/react";

export default function LinkPlaceholder({ ratio = 1, ...props }) {
  const STYLES_PLACEHOLDER = React.useMemo(
    () => css`
      overflow: visible !important;
      width: ${(96 / 248) * 100 * ratio}%;
      height: ${(64 / 248) * 100 * ratio}%;
    `,
    [ratio]
  );

  return (
    <svg
      width={96}
      height={64}
      viewBox="62 50 96 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={STYLES_PLACEHOLDER}
      {...props}
    >
      <g filter="url(#prefix__filter0_d_link)">
        <rect x={64} y={52} width={96} height={64} rx={8} fill="#fff" />
      </g>
      <path d="M64 60a8 8 0 018-8h80a8 8 0 018 8H64z" fill="#E5E8EA" />
      <path
        d="M121 92v-8a2.001 2.001 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4a2.003 2.003 0 00-1 1.73v8a2.002 2.002 0 001 1.73l7 4a2 2 0 002 0l7-4a2.003 2.003 0 001-1.73z"
        fill="#E5E8EA"
        stroke="#fff"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M103.27 82.96l8.73 5.05 8.73-5.05M112 98.08V88"
        stroke="#fff"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={70.5} cy={56.5} r={1.5} fill="#FF4530" />
      <circle cx={75.5} cy={56.5} r={1.5} fill="#C4C4C4" />
      <circle cx={80.5} cy={56.5} r={1.5} fill="#34D159" />
      <defs>
        <filter
          id="prefix__filter0_d_link"
          x={0}
          y={0}
          width={224}
          height={192}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={12} />
          <feGaussianBlur stdDeviation={32} />
          <feColorMatrix values="0 0 0 0 0.682353 0 0 0 0 0.690196 0 0 0 0 0.698039 0 0 0 0.3 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}
