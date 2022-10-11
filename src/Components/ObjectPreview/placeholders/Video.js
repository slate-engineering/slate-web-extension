import * as React from "react";
import { css } from "@emotion/react";

export default function VideoPlaceholder({ ratio = 1, ...props }) {
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
      viewBox="64 52 96 64"
      width={96}
      height={64}
      css={STYLES_PLACEHOLDER}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#prefix__filter0_d_video)">
        <rect x={64} y={52} width={96} height={64} rx={8} fill="#fff" />
      </g>
      <path
        d="M112 94c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10z"
        fill="#F7F8F9"
      />
      <path d="M110 80l6 4-6 4v-8z" fill="#C7CACC" />
      <defs>
        <filter
          id="prefix__filter0_d_video"
          x={0}
          y={0}
          width={224}
          height={192}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
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
