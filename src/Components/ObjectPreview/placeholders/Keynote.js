import * as React from "react";

import { css } from "@emotion/react";

export default function KeynotePlaceholder({ ratio = 1, ...props }) {
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
      viewBox="65 50 96 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={STYLES_PLACEHOLDER}
      {...props}
    >
      <g filter="url(#prefix__filter0_d_keynote)">
        <rect x={68} y={56} width={96} height={60} rx={8} fill="#F7F8F9" />
      </g>
      <g filter="url(#prefix__filter1_d_keynote)">
        <path
          d="M72 112h80a8 8 0 008-8V78.627c0-4.243-1.686-8.313-4.686-11.313l-10.628-10.628c-3-3-7.07-4.686-11.313-4.686H72a8 8 0 00-8 8v44a8 8 0 008 8z"
          fill="#fff"
        />
      </g>
      <g filter="url(#prefix__filter2_d_keynote)">
        <path d="M152 69h5l-13-13v5a8 8 0 008 8z" fill="#D1D4D6" />
      </g>
      <path
        d="M92.667 78h-9.334c-.736 0-1.333.597-1.333 1.333v9.334c0 .736.597 1.333 1.333 1.333h9.334c.736 0 1.333-.597 1.333-1.333v-9.334c0-.736-.597-1.333-1.333-1.333zM110.86 78.573L105.213 88a1.33 1.33 0 00-.003 1.327 1.327 1.327 0 001.143.673h11.294a1.33 1.33 0 001.318-1.337 1.33 1.33 0 00-.178-.663l-5.647-9.427a1.332 1.332 0 00-2.28 0zM136 90.667a6.667 6.667 0 100-13.334 6.667 6.667 0 000 13.334z"
        fill="#E5E8EA"
        stroke="#E5E8EA"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <filter
          id="prefix__filter0_d_keynote"
          x={4}
          y={4}
          width={224}
          height={188}
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
          id="prefix__filter1_d_keynote"
          x={0}
          y={0}
          width={224}
          height={188}
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
          id="prefix__filter2_d_keynote"
          x={132}
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
