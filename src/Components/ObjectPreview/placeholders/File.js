import * as React from "react";

import { css } from "@emotion/react";

export default function FilePlaceholder({ ratio = 1, ...props }) {
  const STYLES_PLACEHOLDER = React.useMemo(
    () => css`
      overflow: visible !important;
      width: ${(64 / 248) * 100 * ratio}%;
      height: ${(80 / 248) * 100 * ratio}%;
    `,
    [ratio]
  );

  return (
    <svg
      width={64}
      height={80}
      viewBox="63 52 64 80"
      fill="none"
      css={STYLES_PLACEHOLDER}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#prefix__filter0_d_code)">
        <path
          d="M72 132h48a8 8 0 008-8V78.627c0-4.243-1.686-8.313-4.686-11.313l-10.628-10.628c-3-3-7.07-4.686-11.313-4.686H72a8 8 0 00-8 8v64a8 8 0 008 8z"
          fill="#fff"
        />
      </g>
      <g filter="url(#prefix__filter1_d_code)">
        <path d="M120 69h5l-13-13v5a8 8 0 008 8z" fill="#D1D4D6" />
      </g>
      <path
        d="M105 96v-8a2.001 2.001 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 0087 88v8a2 2 0 001 1.73l7 4a1.995 1.995 0 002 0l7-4a2.003 2.003 0 001-1.73z"
        fill="#E5E8EA"
        stroke="#fff"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M87.27 86.96L96 92.01l8.73-5.05M96 102.08V92"
        stroke="#fff"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <filter
          id="prefix__filter0_d_code"
          x={0}
          y={0}
          width={192}
          height={208}
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
        <filter
          id="prefix__filter1_d_code"
          x={100}
          y={48}
          width={37}
          height={37}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
          <feOffset dy={4} />
          <feGaussianBlur stdDeviation={6} />
          <feColorMatrix values="0 0 0 0 0.682353 0 0 0 0 0.69051 0 0 0 0 0.698039 0 0 0 1 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}
